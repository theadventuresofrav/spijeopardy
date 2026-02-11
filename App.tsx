import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from "convex/react";
// @ts-ignore
import { api } from "./convex/_generated/api";
import { 
  GameBoardData, GameState, Clue, JudgmentResult, Difficulty, 
  ActiveClue, UserSettings, MissionHistory, TranscribedInteraction, 
  Module, LectureScript, UserProfile, Badge 
} from './types';
import { 
  generateGameData, judgeAnswer, generateSpeech, generateHeckle, 
  generateCourseOutline, generateLectureScript, generateIntroTheme, prefetchBoards
} from './services/geminiService';
import { SPI_COURSE_DATA, LECTURE_CONTENT } from './data/spiCourseData';
import { playSfx } from './services/soundEffects';
import { MusicService } from './services/musicService';
import { prefetchHints, getHint } from './services/geminiService';
import GameBoard from './components/GameBoard';
import ClueScreen from './components/ClueScreen';
import HostAvatar from './components/HostAvatar';
import CourseScreen from './components/CourseScreen';
import LectureScreen from './components/LectureScreen';
import StudyBuddyScreen from './components/StudyBuddyScreen';
import ProfileScreen from './components/ProfileScreen';
import GlossaryScreen from './components/GlossaryScreen';
import FormulaHubScreen from './components/FormulaHubScreen';
import MockExamScreen from './components/MockExamScreen';
import LandingPage from './components/LandingPage';
import DailyDoubleWager from './components/DailyDoubleWager';
import FinalJeopardy from './components/FinalJeopardy';
import FastestFinger from './components/FastestFinger';
import LegalScreen from './components/LegalScreen';
import ArchiveScreen from './components/ArchiveScreen';
import VaultScreen from './components/VaultScreen';
import { CinematicIntro } from './components/CinematicIntro';
import { AmbientBackground } from './components/AmbientBackground';
import DemoGame from './components/DemoGame';
import { MusicPlayer } from './components/MusicPlayer';
import { SettingsModal } from './components/SettingsModal';
import { XP_REWARDS, checkBadges, calculateLevel } from './utils/gamification';
import { LevelProgress } from './components/LevelProgress';
import confetti from 'canvas-confetti';
import { 
  Radio, Terminal, Database, Settings, Volume2, VolumeX, Cpu, 
  LayoutGrid, LogOut, BookOpen, User as UserIcon, MessageSquare, Plus, Zap,
  Maximize, Minimize, Activity, Shield, Library, FunctionSquare, CheckSquare, Play
} from 'lucide-react';

const STORAGE_KEY = 'echo_jeopardy_v4_profiles';

const INITIAL_BADGES: Badge[] = [
  { id: 'first_mission', name: 'Initiate', description: 'Complete your first registry sync.', icon: 'Zap' },
  { id: 'perfect_sync', name: 'Physicist', description: 'Achieve 100% efficiency in a session.', icon: 'Target' },
  { id: 'resonance_master', name: 'Resonance', description: 'Maintain a 10x streak.', icon: 'Activity' },
  { id: 'vault_hunter', name: 'Archivist', description: 'Accumulate 10,000 career resonance.', icon: 'Database' }
];

interface ProfileSelectionProps {
  profiles: UserProfile[];
  onSelect: (id: string) => void;
  onCreate: (tag: string, variant: 'echo' | 'hertz' | 'harvey') => void;
  onDelete: (id: string) => void;
  onDemo: () => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({ profiles, onSelect, onCreate, onDelete, onDemo }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [tag, setTag] = useState('');
  const [variant, setVariant] = useState<'echo' | 'hertz' | 'harvey' | 'polis'>('echo');

  return (
    <div className="my-auto w-full max-w-4xl space-y-8 md:space-y-12 animate-in zoom-in duration-700 px-4">
      <div className="text-center space-y-2 md:space-y-4">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-cinzel font-black text-white tracking-widest uppercase">Select Operator</h1>
        <p className="text-[10px] md:text-xs text-slate-500 uppercase font-black tracking-widest">Neural Link Matrix v4.2</p>
        <button 
          onClick={onDemo}
          className="mt-4 flex items-center justify-center space-x-2 mx-auto text-cyan-500/50 hover:text-cyan-400 uppercase tracking-[0.2em] text-[10px] transition-colors"
        >
          <Play size={10} />
          <span>Run Simulation Protocol</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {profiles.map(p => (
          <div key={p.id} className="group relative tech-border-container p-0.5 rounded-2xl">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-xl flex flex-col items-center text-center hover:bg-cyan-500/10 transition-all">
              <div className="mb-4 md:mb-6 scale-75 md:scale-90"><HostAvatar mood="neutral" careerScore={p.careerScore} type={p.avatarVariant === 'polis' ? 'polis' : undefined} /></div>
              <h3 className="text-xl md:text-2xl font-cinzel font-black text-white mb-1">{p.tag}</h3>
              <p className="text-[8px] md:text-[10px] text-slate-500 uppercase font-black tracking-widest mb-4 md:mb-6">${p.careerScore.toLocaleString()} resonance</p>
              <button onClick={() => onSelect(p.id)} className="w-full py-2.5 md:py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest rounded-lg transition-all text-xs md:text-sm">Engage</button>
              <button onClick={() => onDelete(p.id)} className="mt-4 text-[8px] text-red-900 hover:text-red-500 uppercase font-black">Decommission</button>
            </div>
          </div>
        ))}
        {profiles.length < 5 && !isCreating && (
          <button onClick={() => setIsCreating(true)} className="border-2 border-dashed border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center hover:bg-white/5 transition-all group min-h-[200px]">
            <Plus size={32} className="text-slate-700 group-hover:text-cyan-500 transition-colors mb-2 md:mb-4 md:w-12 md:h-12" />
            <span className="text-[8px] md:text-[10px] text-slate-600 font-black uppercase tracking-widest">Register Operator</span>
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-slate-900/80 border border-white/10 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] animate-in slide-in-from-bottom-8 duration-500">
           <div className="flex justify-between items-center mb-6 md:mb-10">
              <h2 className="text-lg md:text-2xl font-cinzel font-black text-white uppercase tracking-widest">New Protocol</h2>
              <button onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-white transition-colors uppercase font-black text-[10px]">Cancel</button>
           </div>
           <div className="space-y-4 md:space-y-8">
              <input type="text" maxLength={12} value={tag} onChange={e => setTag(e.target.value)} className="w-full bg-black border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl text-xl md:text-2xl font-mono text-cyan-400 outline-none focus:border-cyan-500/50" placeholder="CODE_NAME" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {(['echo', 'hertz', 'harvey', 'polis'] as const).map(v => (
                  <button key={v} onClick={() => setVariant(v)} className={`py-3 md:py-6 rounded-xl md:rounded-2xl border transition-all ${variant === v ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-black/40 border-white/5 text-slate-600'}`}>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                      {v === 'echo' ? 'THE GUIDE' : v}
                    </span>
                  </button>
                ))}
              </div>
              <button onClick={() => onCreate(tag, variant)} disabled={!tag.trim()} className="w-full py-4 md:py-6 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-20 text-white font-black uppercase tracking-[0.3em] md:tracking-[0.5em] rounded-xl md:rounded-2xl transition-all shadow-xl active:scale-95 text-xs md:text-base">Register</button>
           </div>
        </div>
      )}
    </div>
  );
};

const UserSyncer: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const syncUser = useMutation(api.users.syncUser);
  
  useEffect(() => {
    if (!profile) return;
    const sync = async () => {
        try {
            await syncUser({
                userId: profile.id,
                tag: profile.tag,
                careerScore: profile.careerScore,
                examsTaken: profile.examHistory?.length || 0,
                avatarVariant: profile.avatarVariant
            });
        } catch(e) { 
           // Silent fail
        }
    };
    const timer = setTimeout(sync, 2000);
    return () => clearTimeout(timer);
  }, [profile, syncUser]);

  return null;
};

interface AppProps {
  isConvexEnabled?: boolean;
}

const App: React.FC<AppProps> = ({ isConvexEnabled = false }) => {
  const [isBooting, setIsBooting] = useState(false);
  const [bootPhase, setBootPhase] = useState(0); // 0: Start, 1: Loading, 2: Logo, 3: Finalizing, 4: Done
  const [transitioning, setTransitioning] = useState(false);
  const [gameState, setGameState] = useState<GameState>(GameState.LANDING);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  
  const [boardData, setBoardData] = useState<GameBoardData | null>(null);
  const [currentClue, setCurrentClue] = useState<ActiveClue | null>(null);
  const [score, setScore] = useState(0);
  const [currentLessons, setCurrentLessons] = useState<TranscribedInteraction[]>([]);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('echo_jeopardy_settings');
    return saved ? JSON.parse(saved) : { 
      muted: false, 
      volumes: { master: 1, sfx: 1, voice: 1, music: 0.3, ambience: 0.5 },
      lastDifficulty: null 
    };
  });
  const [hostMood, setHostMood] = useState<'neutral' | 'speaking' | 'thinking' | 'happy' | 'sassy'>('neutral');
  const [hostMessage, setHostMessage] = useState<string>("Initializing Core...");
  const [judgmentResult, setJudgmentResult] = useState<JudgmentResult | null>(null);
  const [celebritySpeaking, setCelebritySpeaking] = useState<string | null>(null); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [botLogicLog, setBotLogicLog] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [modules, setModules] = useState<Module[]>(SPI_COURSE_DATA);
  const [activeLecture, setActiveLecture] = useState<LectureScript | null>(null);
  const [streak, setStreak] = useState(0);
  const [maxStreakInGame, setMaxStreakInGame] = useState(0);

  const activeProfile = profiles.find(p => p.id === activeProfileId);
  const reactorHumRef = useRef<OscillatorNode | null>(null);
  
  const syncExamAttempt = useMutation(api.users.syncExamAttempt);

  // Prefetch boards immediately on app load to minimize wait times
  useEffect(() => {
    prefetchBoards();
  }, []);

  useEffect(() => {
    if (gameState === GameState.INTRO && bootPhase === 0) {
      const runBootSequence = async () => {
        setIsBooting(true);
        // Board generation already started in background
        setBootPhase(1);
        // playSfx('boot');

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const p = JSON.parse(saved);
            
            // Sanitization: Ensure no default 'Rav' profile exists if user requested removal
            if (p.profiles) {
                p.profiles = p.profiles.map((prof: any) => {
                    if (prof.tag && prof.tag.toUpperCase() === "RAV") {
                        return { ...prof, tag: "CADET" };
                    }
                    return prof;
                });
            }

            if (p.profiles) setProfiles(p.profiles);
            if (p.activeProfileId) setActiveProfileId(p.activeProfileId);
          } catch (e) { console.error("Persistence error", e); }
        }

        // Progression delays for cinematic effect
        setTimeout(() => setBootPhase(2), 2000);
        setTimeout(() => setBootPhase(3), 4500);
        setTimeout(() => {
          setBootPhase(4);
          setIsBooting(false);
        }, 6000);
      };
      runBootSequence();
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [gameState]);

  useEffect(() => {
    if (isBooting) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles, activeProfileId }));
  }, [profiles, activeProfileId, isBooting]);

  useEffect(() => {
    localStorage.setItem('echo_jeopardy_settings', JSON.stringify(settings));
    
    // Manage Music Playback - Disabled by user request
    /*
    if (!settings.muted && (settings.volumes?.music ?? 0.3) > 0) {
      MusicService.start(settings.volumes?.music ?? 0.3);
      MusicService.setVolume(settings.volumes?.music ?? 0.3);
    } else {
      MusicService.stop();
    }
    */
    MusicService.stop();
  }, [settings]);

  useEffect(() => {
    // Reactor hum disabled by request
    if (reactorHumRef.current) {
      reactorHumRef.current.stop();
      reactorHumRef.current = null;
    }
  }, [gameState, settings.muted]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const updateActiveProfile = (updates: Partial<UserProfile>) => {
    if (!activeProfileId) return;
    setProfiles(prev => prev.map(p => p.id === activeProfileId ? { ...p, ...updates } : p));
  };

  const triggerTransition = (cb: () => void) => {
    setTransitioning(true);
    // playSfx('warp');
    setTimeout(() => { cb(); setTimeout(() => setTransitioning(false), 300); }, 100);
  };

  const handleCreateProfile = (tag: string, variant: 'echo' | 'hertz' | 'harvey') => {
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      tag: tag.toUpperCase(),
      careerScore: 0,
      currency: 0,
      currentStreak: 0,
      lastActiveDate: new Date().toISOString(),
      avatarVariant: variant,
      missionHistory: [],
      completedTopicIds: [],
      badges: [...INITIAL_BADGES],
      lastDifficulty: 'MEDIUM',
      createdAt: new Date().toISOString()
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm("Permanently purge this operator's neural records?")) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (activeProfileId === id) setActiveProfileId(null);
    }
  };

  const startGame = async (diff: Difficulty) => {
    if (!activeProfile) return;
    triggerTransition(async () => {
      setGameState(GameState.LOADING_BOARD);
      setCurrentLessons([]);
      setScore(0);
      setStreak(0);
      setMaxStreakInGame(0);
      try {
        const data = await generateGameData(diff);
        
        // Start background hint prefetch
        prefetchHints(data);

        setBoardData(data);
        const intro = await generateIntroTheme(diff, activeProfile.tag);
        setGameState(GameState.BOARD);
        setSettings(s => ({ ...s, lastDifficulty: diff }));
        speak(intro, "Charon");
      } catch (e) { setGameState(GameState.INTRO); }
    });
  };

  const speak = async (text: string, voice: string) => {
    setHostMessage(text);
    if (settings.muted) return;
    try {
      const vol = (settings.volumes?.master ?? 1) * (settings.volumes?.voice ?? 1);
      const buf = await generateSpeech(text, voice, vol);
      setHostMood('speaking');
      await playAudioBuffer(buf);
      setHostMood('neutral');
    } catch (e) { console.error(e); }
  };

  const handleClueClick = async (catIdx: number, clueIdx: number) => {
    if (!boardData || !activeProfile) return;
    const clue = boardData.categories[catIdx].clues[clueIdx];
    
    // Heckle logic removed for speed
    /*
    if (clue.value >= 800) {
      const h = await generateHeckle(clue.value, activeProfile.tag);
      const audio = await generateSpeech(h, 'Fenrir');
      setCelebritySpeaking('hertz');
      await playAudioBuffer(audio);
      setCelebritySpeaking(null);
    }
    */

    triggerTransition(() => {
      setCurrentClue({ catIdx, clueIdx, clue, category: boardData.categories[catIdx].title });
      if (clue.isDailyDouble) {
        setGameState(GameState.DAILY_DOUBLE_WAGER);
      } else {
        setGameState(GameState.CLUE_ACTIVE);
      }
    });
  };

  const handleAnswer = async (ans: string, wagerOverride?: number) => {
    if (!currentClue) return;
    const finalValue = wagerOverride !== undefined ? wagerOverride : currentClue.clue.value;
    setGameState(GameState.JUDGING);
    setBotLogicLog(["ADJUDICATING_RESONANCE..."]);
    
    try {
      const result = await judgeAnswer(currentClue.clue.clueText, currentClue.clue.correctAnswer, ans);
      setJudgmentResult(result);

      const interaction: TranscribedInteraction = {
        clueText: currentClue.clue.clueText,
        userAnswer: ans,
        correctAnswer: currentClue.clue.correctAnswer,
        isCorrect: result.isCorrect,
        scripts: { echo: result.hostComment, hertz: result.celebrityComment, harvey: result.harveyComment }
      };
      setCurrentLessons(prev => [...prev, interaction]);

      const [hertzAudio, echoAudio, harveyAudio] = await Promise.all([
        generateSpeech(result.celebrityComment, 'Fenrir'),
        generateSpeech(result.hostComment, 'Charon'),
        generateSpeech(result.harveyComment, 'Orion')
      ]);

      setCelebritySpeaking('hertz'); await playAudioBuffer(hertzAudio);
      setCelebritySpeaking('echo'); setHostMood('speaking'); await playAudioBuffer(echoAudio);
      setCelebritySpeaking('harvey'); setHostMood('neutral'); await playAudioBuffer(harveyAudio);
      setCelebritySpeaking(null);

      // Apply the score multiplier from the judgment
      const resonanceChange = Math.round(finalValue * result.scoreMultiplier);
      setScore(s => s + resonanceChange);

      if (result.isCorrect && result.scoreMultiplier > 0) {
        // XP Calculation
        let xpGain = settings.lastDifficulty === 'HARD' ? XP_REWARDS.CORRECT_ANSWER_HARD : 
                     settings.lastDifficulty === 'EASY' ? XP_REWARDS.CORRECT_ANSWER_EASY : 
                     XP_REWARDS.CORRECT_ANSWER_MEDIUM;
        
        if (currentClue.clue.isDailyDouble) xpGain += XP_REWARDS.DAILY_DOUBLE_BONUS;
        
        // Currency Calculation (10% of XP)
        const currencyGain = Math.floor(xpGain / 10);

        // Update Profile
        const oldLevel = calculateLevel(activeProfile.careerScore).currentLevel;
        const newScore = activeProfile.careerScore + xpGain;
        const newLevel = calculateLevel(newScore).currentLevel;

        if (newLevel.level > oldLevel.level) {
           playSfx('level_up');
           // In a real app, we'd show a "Level Up" modal here
           // For now, we rely on the ProfileScreen to show the new level
        }

        const updatedProfile: UserProfile = { 
            ...activeProfile, 
            careerScore: newScore,
            currency: (activeProfile.currency || 0) + currencyGain,
            lastActiveDate: new Date().toISOString()
        };
        
        const newBadges = checkBadges(updatedProfile);
        
        if (newBadges.length > 0) {
          updatedProfile.badges = [...updatedProfile.badges, ...newBadges];
          playSfx('correct'); // Should use badge_unlock if available
          // TODO: Show Badge Toast
        }
        
        updateActiveProfile(updatedProfile);

        setStreak(st => { 
          const n = st + 1; 
          if (n > maxStreakInGame) setMaxStreakInGame(n); 
          if (n % 10 === 0) {
             // Streak Bonus
             updateActiveProfile({ 
                 careerScore: updatedProfile.careerScore + XP_REWARDS.STREAK_MILESTONE,
                 currency: updatedProfile.currency + 50 // Bonus currency for streak
             });
          }
          return n; 
        });
        setHostMood('happy');
        confetti();
      } else {
        setStreak(0);
        setHostMood(result.scoreMultiplier <= -1.0 ? 'sassy' : 'neutral');
      }

      if (boardData) {
        const updated = {...boardData};
        updated.categories[currentClue.catIdx].clues[currentClue.clueIdx].isAnswered = true;
        updated.categories[currentClue.catIdx].clues[currentClue.clueIdx].isCorrect = result.isCorrect;
        setBoardData(updated);
      }
    } catch (e) { setGameState(GameState.BOARD); }
  };

  const playAudioBuffer = (buf: AudioBuffer): Promise<void> => {
    if (settings.muted) return Promise.resolve();
    return new Promise(r => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = ctx.createGain();
      // Combine master and voice volume
      const volume = (settings.volumes?.master ?? 1) * (settings.volumes?.voice ?? 1);
      gainNode.gain.value = volume;

      const s = ctx.createBufferSource(); s.buffer = buf; s.connect(gainNode);
      gainNode.connect(ctx.destination);
      s.start(0); s.onended = () => r();
    });
  };

  const finalizeGame = () => {
    if (!activeProfile) return;
    const efficiency = currentLessons.length > 0 ? Math.round((currentLessons.filter(l => l.isCorrect).length / currentLessons.length) * 100) : 0;
    const report: MissionHistory = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      score,
      difficulty: settings.lastDifficulty || 'MEDIUM',
      efficiency,
      consultancyUsed: 0,
      maxStreak: maxStreakInGame,
      lessons: currentLessons
    };

    // Award Mission Complete XP
    const missionBonus = XP_REWARDS.LESSON_COMPLETE;
    const finalXP = activeProfile.careerScore + missionBonus;
    
    const updatedProfile = {
      ...activeProfile,
      careerScore: finalXP,
      missionHistory: [...activeProfile.missionHistory, report]
    };
    
    // Final Badge Check
    const newBadges = checkBadges(updatedProfile);
    if (newBadges.length > 0) updatedProfile.badges = [...updatedProfile.badges, ...newBadges];

    updateActiveProfile(updatedProfile);
    setGameState(GameState.GAME_OVER);
  };

  const handleBoardCheck = () => {
    if (boardData?.categories.every(c => c.clues.every(q => q.isAnswered))) {
      triggerTransition(() => setGameState(GameState.FINAL_JEOPARDY));
    } else {
      setGameState(GameState.BOARD);
    }
  };

  if (gameState === GameState.LANDING) {
    return <LandingPage onStart={() => setGameState(GameState.INTRO)} onDemo={() => setGameState(GameState.DEMO_MODE)} />;
  }

  if (isBooting) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
       {/* Background Grid */}
       <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none"></div>
       
       {/* Phase-based Cinematic Content */}
       <div className="relative z-10 flex flex-col items-center max-w-lg w-full">
          
          {bootPhase === 1 && (
            <div className="space-y-4 animate-in fade-in duration-500 text-center">
               <Activity className="text-cyan-500 mx-auto w-8 h-8 md:w-12 md:h-12 animate-pulse mb-6" />
               <div className="font-mono text-[9px] md:text-xs text-slate-500 uppercase tracking-[0.5em]">
                  <p className="mb-1">&gt; KERNEL_INIT: OK</p>
                  <p className="mb-1">&gt; NEURAL_LINK: ESTABLISHING...</p>
                  <p className="mb-1">&gt; SYNC_PROTOCOL: V4.2_LOADED</p>
               </div>
            </div>
          )}

          {bootPhase === 2 && (
            <div className="space-y-4 animate-in fade-in zoom-in duration-1000">
               <div className="flex items-center justify-center space-x-6">
                  <h1 className="text-6xl md:text-[8rem] font-cinzel font-black text-white tracking-[0.1em] relative glitch-text">
                    THE GUIDE
                  </h1>
               </div>
               <div className="flex items-center space-x-4 opacity-60">
                  <div className="h-0.5 w-12 bg-cyan-500/50"></div>
                  <span className="text-[10px] font-black text-cyan-400 tracking-[1em] uppercase">Matrix OS</span>
                  <div className="h-0.5 w-12 bg-cyan-500/50"></div>
               </div>
            </div>
          )}

          {bootPhase === 3 && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700 text-center">
               <Shield className="text-emerald-500 mx-auto w-10 h-10 md:w-16 md:h-16 mb-4 animate-bounce" />
               <div>
                  <h2 className="text-xl md:text-3xl font-cinzel font-black text-white tracking-widest uppercase mb-2">Access Granted</h2>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-500 animate-[pulse_1.5s_infinite] w-full"></div>
                  </div>
                  <p className="mt-4 text-[9px] md:text-[11px] font-mono text-emerald-400 uppercase tracking-widest">Operator Neural Match Confirmed</p>
               </div>
            </div>
          )}
       </div>

       {/* Decorative Lines */}
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
       <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030305] flex flex-col md:flex-row font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-hidden relative">
      <AmbientBackground settings={settings} />
      <div className="fixed inset-0 crt-overlay pointer-events-none z-[100]"></div>
      <div className={`fixed inset-0 bg-black z-[1000] pointer-events-none transition-opacity duration-700 ${transitioning ? 'opacity-100' : 'opacity-0'}`}></div>

      {isConvexEnabled && activeProfile && <UserSyncer profile={activeProfile} />}

      <nav className={`
        fixed bottom-0 left-0 right-0 h-16 bg-slate-950/95 border-t border-white/10 flex flex-row items-center z-[60] transition-all
        overflow-x-auto no-scrollbar px-4 space-x-6 md:space-x-0
        md:relative md:h-auto md:w-28 md:border-t-0 md:border-r md:flex-col md:py-8 md:space-y-8 md:overflow-visible md:px-0 md:justify-start
        ${!activeProfileId || gameState === GameState.INTRO ? 'translate-y-full md:-translate-x-full' : 'translate-y-0 md:translate-x-0'}
      `}>
          <div className="hidden md:block p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 mb-4 animate-pulse"><Radio className="text-cyan-500" size={24} /></div>
          
          <button onClick={() => triggerTransition(() => setGameState(GameState.BOARD))} className={`p-3 md:p-4 rounded-xl transition-all flex-shrink-0 ${gameState === GameState.BOARD ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-600'}`}>
            <LayoutGrid size={24} className="md:w-7 md:h-7"/>
          </button>
          
          {/* Admin Only: Reflex Mode */}
          {activeProfile?.tag === 'ADMIN' && (
            <button onClick={() => triggerTransition(() => setGameState(GameState.FASTEST_FINGER))} className={`p-3 md:p-4 rounded-xl transition-all flex-shrink-0 ${gameState === GameState.FASTEST_FINGER ? 'bg-red-500/20 text-red-400' : 'text-slate-600'}`}>
              <Zap size={24} className="md:w-7 md:h-7"/>
            </button>
          )}
          
          <button onClick={() => triggerTransition(async () => {
              setGameState(GameState.COURSE);
              if (modules.length === 0) {
                const outline = await generateCourseOutline();
                setModules(outline);
              }
          })} className={`p-3 md:p-4 rounded-xl transition-all flex-shrink-0 ${gameState === GameState.COURSE ? 'bg-blue-500/20 text-blue-400' : 'text-slate-600'}`}>
            <BookOpen size={24} className="md:w-7 md:h-7"/>
          </button>

          <button onClick={() => triggerTransition(() => setGameState(GameState.STUDY_BUDDY))} className={`p-3 md:p-4 rounded-xl transition-all flex-shrink-0 ${gameState === GameState.STUDY_BUDDY ? 'bg-amber-500/20 text-amber-400' : 'text-slate-600'}`}>
            <MessageSquare size={24} className="md:w-7 md:h-7"/>
          </button>

          <button onClick={() => triggerTransition(() => setGameState(GameState.GLOSSARY))} className={`p-3 md:p-4 rounded-xl transition-all flex-shrink-0 ${gameState === GameState.GLOSSARY ? 'bg-purple-500/20 text-purple-400' : 'text-slate-600'}`}>
            <Library size={24} className="md:w-7 md:h-7"/>
          </button>

          <button onClick={() => triggerTransition(() => setGameState(GameState.FORMULA_HUB))} className={`p-3 md:p-4 rounded-xl transition-all flex-shrink-0 ${gameState === GameState.FORMULA_HUB ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-600'}`}>
            <FunctionSquare size={24} className="md:w-7 md:h-7"/>
          </button>
          
          <button onClick={() => triggerTransition(() => setGameState(GameState.EXAM))} className={`p-3 md:p-4 rounded-xl transition-all flex-shrink-0 ${gameState === GameState.EXAM ? 'bg-teal-500/20 text-teal-400' : 'text-slate-600'}`}>
            <CheckSquare size={24} className="md:w-7 md:h-7"/>
          </button>

          <button onClick={() => triggerTransition(() => setGameState(GameState.PROFILE))} className={`p-3 md:p-4 rounded-xl transition-all flex-shrink-0 ${gameState === GameState.PROFILE ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-600'}`}>
            <UserIcon size={24} className="md:w-7 md:h-7"/>
          </button>

          <div className="hidden md:block md:flex-1" />
          
          <button onClick={() => triggerTransition(() => { setActiveProfileId(null); setGameState(GameState.INTRO); })} className="p-3 md:p-4 text-red-900/40 hover:text-red-500 transition-colors flex-shrink-0">
            <LogOut size={24} className="md:w-7 md:h-7"/>
          </button>
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden mb-16 md:mb-0">
        <header className="bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 p-3 md:p-6 flex items-center justify-between shadow-xl z-50">
            <div className="flex items-center space-x-3 md:space-x-6 overflow-hidden">
              {activeProfile && gameState !== GameState.INTRO && <div className="scale-75 md:scale-100 origin-left flex-shrink-0"><HostAvatar mood={hostMood} careerScore={activeProfile.careerScore} type={activeProfile.avatarVariant} /></div>}
              <div className="hidden sm:block overflow-hidden">
                <div className="text-[9px] md:text-[10px] font-black text-cyan-500/80 uppercase tracking-widest flex items-center mb-1"><Terminal size={10} className="mr-1 md:mr-2"/> {gameState}</div>
                <p className="text-slate-200 text-[10px] md:text-sm italic opacity-90 line-clamp-1 truncate">"{hostMessage}"</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 md:space-x-12">
              {(activeProfile && gameState !== GameState.INTRO && gameState !== GameState.PROFILE) && (
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xl md:text-5xl font-cinzel font-black text-white tracking-tighter">${score.toLocaleString()}</div>
                  <LevelProgress xp={activeProfile.careerScore} compact />
                </div>
              )}
              <div className="flex space-x-1 md:space-x-2 bg-white/5 p-1 rounded-lg border border-white/10">
                <MusicPlayer globalVolume={(settings.volumes?.master ?? 1) * (settings.volumes?.music ?? 0.5)} />
                <button onClick={toggleFullScreen} className="p-2 md:p-2.5 text-slate-500 hover:text-white transition-colors">
                  {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                </button>
                <button onClick={() => setSettings(s => ({ ...s, muted: !s.muted }))} className={`p-2 md:p-2.5 rounded-lg transition-all ${settings.muted ? 'bg-red-500/10 text-red-400' : 'text-slate-500 hover:text-cyan-400'}`}>
                  {settings.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button onClick={() => setIsSettingsOpen(true)} className="p-2 md:p-2.5 text-slate-500 hover:text-white transition-colors"><Settings size={14} /></button>
              </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-12 flex flex-col items-center relative">
            {isConvexEnabled && activeProfile && <UserSyncer profile={activeProfile} />}

            {gameState === GameState.INTRO && !activeProfileId && (
                <ProfileSelection 
                  profiles={profiles} 
                  onSelect={setActiveProfileId} 
                  onCreate={handleCreateProfile} 
                  onDelete={handleDeleteProfile}
                  onDemo={() => setGameState(GameState.DEMO_MODE)}
                />
            )}

            {gameState === GameState.DEMO_MODE && (
              <DemoGame 
                onComplete={() => setGameState(GameState.INTRO)} 
                volume={(settings.volumes?.master ?? 1) * (settings.volumes?.voice ?? 1)}
              />
            )}

            {gameState === GameState.CINEMATIC_INTRO && activeProfile && (
              <CinematicIntro 
                userName={activeProfile.tag}
                onComplete={() => setGameState(GameState.INTRO)}
              />
            )}

            {gameState === GameState.INTRO && activeProfileId && (
              <div className="my-auto w-full text-center space-y-6 md:space-y-8 animate-in zoom-in duration-1000 flex flex-col items-center px-4">
                 <div className="flex items-center space-x-2 mb-2 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <h2 className="text-[10px] md:text-xs font-mono text-emerald-500/80 uppercase tracking-widest">Operator Connected: <span className="text-white font-bold ml-1">{activeProfile?.tag}</span></h2>
                 </div>

                 <div className="flex flex-col gap-3 md:gap-4 w-full max-w-xs md:max-w-none md:flex-row justify-center">
                    <button onClick={() => startGame('EASY')} className="w-full md:px-12 py-5 md:py-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl md:rounded-2xl font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500/20 transition-all text-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">Easy Matrix</button>
                    <button onClick={() => startGame('MEDIUM')} className="w-full md:px-12 py-5 md:py-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl md:rounded-2xl font-black text-yellow-400 uppercase tracking-widest hover:bg-yellow-500/20 transition-all text-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]">Medium Matrix</button>
                    <button onClick={() => startGame('HARD')} className="w-full md:px-12 py-5 md:py-6 bg-red-500/10 border border-red-500/30 rounded-xl md:rounded-2xl font-black text-red-400 uppercase tracking-widest hover:bg-red-500/20 transition-all text-sm hover:scale-105 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">Hard Matrix</button>
                 </div>
                 
                 <button 
                    onClick={() => setGameState(GameState.CINEMATIC_INTRO)} 
                    className="group relative flex items-center gap-3 px-8 py-4 bg-slate-900 border border-cyan-500/30 rounded-full text-xs font-black tracking-[0.2em] text-cyan-400 transition-all mt-10 overflow-hidden hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                 >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Play size={14} className="fill-current" />
                    <span>INITIATE CINEMATIC SEQUENCE</span>
                 </button>
              </div>
            )}

            {gameState === GameState.LOADING_BOARD && (
              <div className="my-auto flex flex-col items-center space-y-6 animate-pulse">
                 <Activity className="text-cyan-500 w-12 h-12 md:w-16 md:h-16" />
                 <div className="text-center">
                    <h2 className="text-xl md:text-3xl font-cinzel font-black text-white uppercase tracking-widest mb-2">Generating Board</h2>
                    <p className="text-[10px] md:text-xs text-slate-500 font-mono uppercase tracking-[0.2em]">Neural Engine Processing...</p>
                 </div>
              </div>
            )}

            {gameState === GameState.BOARD && boardData && <GameBoard data={boardData} onClueClick={handleClueClick} />}
            {gameState === GameState.CLUE_ACTIVE && currentClue && <ClueScreen clue={currentClue.clue} categoryTitle={currentClue.category} onAnswer={handleAnswer} onClose={() => setGameState(GameState.BOARD)} onHintRequest={() => getHint(currentClue.clue.clueText, currentClue.clue.id, currentClue.clue.correctAnswer)} />}
            {gameState === GameState.DAILY_DOUBLE_WAGER && currentClue && <DailyDoubleWager currentScore={score} categoryTitle={currentClue.category} onWagerConfirm={(wager) => { setGameState(GameState.CLUE_ACTIVE); handleAnswer(prompt("Answer?") || "", wager); }} />}
            {gameState === GameState.FINAL_JEOPARDY && <FinalJeopardy score={score} difficulty={settings.lastDifficulty || 'MEDIUM'} onAnswer={(ans, w) => { handleAnswer(ans, w); finalizeGame(); }} onLoadingStart={() => {}} />}
            {gameState === GameState.FASTEST_FINGER && <FastestFinger currentScore={score} onComplete={(delta) => setScore(s => s + (delta * 1000))} onExit={() => setGameState(GameState.BOARD)} />}
            
            {gameState === GameState.JUDGING && judgmentResult && (
              <div className="fixed inset-0 z-[200] bg-black/98 flex flex-col items-center justify-center p-4 animate-in fade-in duration-700 overflow-y-auto">
                  <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 my-auto">
                      <div className="hidden lg:flex flex-col bg-slate-900/50 border border-white/10 rounded-3xl p-6 font-mono text-[10px]">
                         <div className="flex items-center space-x-2 text-cyan-500 mb-6 pb-4 border-b border-white/5 uppercase">
                            <Cpu size={14}/> <span>Logic_Pulse</span>
                         </div>
                         <div className="space-y-2 opacity-50">{botLogicLog.map((l, i) => <div key={i}>&gt; {l}</div>)}</div>
                      </div>
                      <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl glass-panel border-t-2 md:border-t-4 transition-all duration-700 ${celebritySpeaking === 'hertz' ? 'border-red-500 scale-105' : 'border-slate-800 opacity-60'}`}><p className="italic text-xs md:text-sm text-slate-200 leading-relaxed md:leading-normal">"{judgmentResult.celebrityComment}"</p></div>
                      <div className={`p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] glass-panel border-t-4 md:border-t-8 text-center transition-all duration-700 ${celebritySpeaking === 'echo' ? 'border-cyan-500 scale-105' : 'border-slate-800 opacity-60'}`}>
                        <div className={`text-5xl md:text-6xl font-cinzel font-black mb-4 md:mb-6 ${judgmentResult.isCorrect ? 'text-emerald-400' : 'text-red-500'}`}>{judgmentResult.isCorrect ? 'VALID' : 'REJECT'}</div>
                        <button onClick={() => { setJudgmentResult(null); handleBoardCheck(); }} className="w-full py-4 md:py-6 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-100 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.3em] md:tracking-[0.5em] transition-all transform active:scale-95 shadow-2xl text-xs md:text-base">Execute Pulse</button>
                      </div>
                      <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl glass-panel border-t-2 md:border-t-4 transition-all duration-700 ${celebritySpeaking === 'harvey' ? 'border-amber-500 scale-105' : 'border-slate-800 opacity-60'}`}><p className="italic text-xs md:text-sm text-slate-200 leading-relaxed md:leading-normal">"{judgmentResult.harveyComment}"</p></div>
                  </div>
              </div>
            )}

            {gameState === GameState.GAME_OVER && (
                <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-3xl p-8 md:p-24 rounded-[2rem] md:rounded-[3rem] border border-white/10 text-center animate-in zoom-in duration-1000 my-auto mx-4">
                    <h3 className="text-5xl md:text-[10rem] font-cinzel font-black text-white mb-8 md:mb-16 leading-none">DEBRIEF</h3>
                    <div className="grid grid-cols-2 gap-4 md:gap-10 mb-8 md:mb-20">
                        <div className="p-4 md:p-12 bg-black/40 rounded-xl md:rounded-[3rem] border border-white/5"><div className="text-2xl md:text-7xl text-cyan-500 font-cinzel font-black">${score.toLocaleString()}</div></div>
                        <div className="p-4 md:p-12 bg-black/40 rounded-xl md:rounded-[3rem] border border-white/5"><div className="text-2xl md:text-7xl text-purple-500 font-cinzel font-black">{maxStreakInGame}x</div></div>
                    </div>
                    <button onClick={() => triggerTransition(() => setGameState(GameState.INTRO))} className="w-full md:w-auto px-8 md:px-24 py-4 md:py-8 bg-white/5 border border-white/10 rounded-xl md:rounded-3xl text-white font-black tracking-[0.4em] md:tracking-[0.8em] uppercase hover:scale-105 transition-all text-xs md:text-base">Re-Initialize</button>
                </div>
            )}
            
            {gameState === GameState.PROFILE && (activeProfile ? (
              <ProfileScreen 
                profile={activeProfile} 
                isConvexEnabled={isConvexEnabled}
                onUpdateProfile={updateActiveProfile}
                onBack={() => setGameState(GameState.LANDING)}
                onStartGame={() => setGameState(GameState.LOADING_BOARD)}
                onViewArchive={() => setGameState(GameState.ARCHIVE)}
                onViewVault={() => setGameState(GameState.VAULT)}
                onViewCourse={() => setGameState(GameState.COURSE)}
                onViewStudyBuddy={() => setGameState(GameState.STUDY_BUDDY)}
                onViewGlossary={() => setGameState(GameState.GLOSSARY)}
                onViewFormulas={() => setGameState(GameState.FORMULA_HUB)}
                onViewExam={() => setGameState(GameState.EXAM)}
                onViewLegal={() => setGameState(GameState.LEGAL)}
              />
            ) : <div className="text-red-500 font-mono">ERROR: NO_PROFILE_DATA</div>)}
            
            {gameState === GameState.ARCHIVE && activeProfile && (
                <ArchiveScreen 
                    history={activeProfile.missionHistory || []} 
                    careerScore={activeProfile.careerScore} 
                    onBack={() => setGameState(GameState.PROFILE)} 
                />
            )}
            {gameState === GameState.VAULT && activeProfile && (
                <VaultScreen 
                    history={activeProfile.missionHistory || []} 
                    onBack={() => setGameState(GameState.PROFILE)} 
                />
            )}
            
            {gameState === GameState.LEGAL && <LegalScreen onBack={() => setGameState(GameState.PROFILE)} />}
            {gameState === GameState.GLOSSARY && <GlossaryScreen />}
            {gameState === GameState.FORMULA_HUB && <FormulaHubScreen />}
            {gameState === GameState.EXAM && (
              <MockExamScreen 
                onExit={() => setGameState(GameState.BOARD)} 
                onComplete={(result) => {
                  if (activeProfile) {
                    updateActiveProfile({
                      examHistory: [...(activeProfile.examHistory || []), result]
                    });
                    syncExamAttempt({
                        userId: activeProfile.id,
                        score: result.score,
                        maxScore: 110,
                        timeSpent: result.timeSpentSeconds,
                        timestamp: new Date(result.date).getTime()
                    }).catch(e => console.warn("Offline: Exam not synced"));
                  }
                }} 
              />
            )}
            {gameState === GameState.COURSE && (activeProfile ? (activeLecture ? <LectureScreen lecture={activeLecture} onBack={() => setActiveLecture(null)} onSpeak={(txt) => speak(txt, "Charon")} onComplete={() => { updateActiveProfile({ completedTopicIds: [...activeProfile.completedTopicIds, activeLecture.topicId] }); setActiveLecture(null); }} /> : <CourseScreen modules={modules} profile={activeProfile} onSelectTopic={async (id, title) => { 
              setTransitioning(true); 
              if (LECTURE_CONTENT[id]) {
                setActiveLecture(LECTURE_CONTENT[id]);
              } else {
                const l = await generateLectureScript(id, title); 
                setActiveLecture(l); 
              }
              setTransitioning(false); 
            }} onUpgrade={() => {
              if (activeProfile) {
                updateActiveProfile({ isPro: true });
                alert("Upgrade Successful! Welcome to Pro.");
              }
            }} />) : <div className="text-red-500 font-mono">ERROR: NO_PROFILE_DATA</div>)}
            {gameState === GameState.STUDY_BUDDY && <StudyBuddyScreen playerName={activeProfile?.tag || 'Cadet'} onSpeak={(txt) => speak(txt, "Orion")} />}
        </main>
      </div>

      {isSettingsOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={() => setIsSettingsOpen(false)}></div>
              <div className="relative w-full max-w-lg z-10">
                  <SettingsModal settings={settings} onUpdate={setSettings} onClose={() => setIsSettingsOpen(false)} />
              </div>
          </div>
      )}
    </div>
  );
};

export default App;