import React, { useState, useEffect, useRef } from 'react';
import { GameBoardData, Category, Clue } from '../types';
import GameBoard from './GameBoard';
import { generateSpeech } from '../services/geminiService';
import { playSfx } from '../services/soundEffects';
import HostAvatar from './HostAvatar';
import { Brain, SkipForward, Play, Volume2 } from 'lucide-react';

// Mock Data for the Demo
const DEMO_CATEGORIES: Category[] = [
  {
    id: 'phys', title: 'Physics Principles', clues: [
      { id: 'p200', value: 200, clueText: "The change in frequency of a wave in relation to an observer who is moving relative to the wave source.", correctAnswer: "What is the Doppler Effect?", isAnswered: false },
      { id: 'p400', value: 400, clueText: "The time required for one complete cycle of a wave to occur.", correctAnswer: "What is Period?", isAnswered: false },
      { id: 'p600', value: 600, clueText: "Resistance to sound propagation through a medium.", correctAnswer: "What is Impedance?", isAnswered: false },
      { id: 'p800', value: 800, clueText: "The rate at which energy passes through a unit area.", correctAnswer: "What is Intensity?", isAnswered: false },
      { id: 'p1000', value: 1000, clueText: "This law states that the angle of incidence equals the angle of reflection.", correctAnswer: "What is Snell's Law?", isAnswered: false },
    ]
  },
  {
    id: 'art', title: 'Artifacts', clues: [
      { id: 'a200', value: 200, clueText: "An artifact caused by sound bouncing back and forth between two strong reflectors.", correctAnswer: "What is Reverberation?", isAnswered: false },
      { id: 'a400', value: 400, clueText: "Shadowing occurring behind a highly attenuating structure.", correctAnswer: "What is Acoustic Shadowing?", isAnswered: false },
      { id: 'a600', value: 600, clueText: "Mirror image artifact is always located deeper than the true structure.", correctAnswer: "What is True?", isAnswered: false },
      { id: 'a800', value: 800, clueText: "The appearance of debris in a cystic structure due to slice thickness.", correctAnswer: "What is Slice Thickness Artifact?", isAnswered: false },
      { id: 'a1000', value: 1000, clueText: "Aliasing occurs when the Doppler shift exceeds this limit.", correctAnswer: "What is the Nyquist Limit?", isAnswered: false },
    ]
  },
  {
    id: 'bio', title: 'Bio-Effects', clues: Array.from({ length: 5 }).map((_, i) => ({ id: `b${i}`, value: (i + 1) * 200, clueText: "Bio-Effect Clue", correctAnswer: "Answer", isAnswered: false })),
  },
  {
    id: 'dop', title: 'Doppler', clues: Array.from({ length: 5 }).map((_, i) => ({ id: `d${i}`, value: (i + 1) * 200, clueText: "Doppler Clue", correctAnswer: "Answer", isAnswered: false })),
  },
  {
    id: 'inst', title: 'Instrumentation', clues: Array.from({ length: 5 }).map((_, i) => ({ id: `i${i}`, value: (i + 1) * 200, clueText: "Inst Clue", correctAnswer: "Answer", isAnswered: false })),
  },
  {
    id: 'safe', title: 'Safety', clues: Array.from({ length: 5 }).map((_, i) => ({ id: `s${i}`, value: (i + 1) * 200, clueText: "Safety Clue", correctAnswer: "Answer", isAnswered: false })),
  },
];

const DEMO_BOARD: GameBoardData = { categories: DEMO_CATEGORIES };

// Types for Script
type Actor = 'HOST' | 'HERTZ' | 'HARVEY' | 'POLIS';

interface ScriptStep {
  action: 'INTRO' | 'DIALOGUE' | 'SELECT_CLUE' | 'SHOW_CLUE' | 'BUZZ' | 'ANSWER' | 'JUDGE' | 'SHOW_BOARD' | 'OUTRO' | 'FINAL_JEOPARDY';
  actor?: Actor;
  text?: string;
  catIdx?: number;
  clueIdx?: number;
  delayAfter?: number;
  voice?: string;
  wager?: number;
}

const VOICES = {
  HOST: 'Charon',
  HERTZ: 'Fenrir',
  HARVEY: 'Orion',
  POLIS: 'Kore'
};

const DEMO_SCRIPT: ScriptStep[] = [
  // --- INTRO ---
  { action: 'INTRO', text: "System Online. Neural Link Established.", delayAfter: 1500 },
  { action: 'SHOW_BOARD', text: "Welcome to the Neural Link. I am The Guide.", actor: 'HOST', delayAfter: 2500 },
  
  // --- BANTER ---
  { action: 'DIALOGUE', actor: 'HERTZ', text: "Finally. I was beginning to decay waiting for this.", delayAfter: 2000 },
  { action: 'DIALOGUE', actor: 'HARVEY', text: "Woo! Let's make some noise! High frequency baby!", delayAfter: 2000 },
  { action: 'DIALOGUE', actor: 'POLIS', text: "Noise is inefficient. Only pure signal is required.", delayAfter: 2000 },
  { action: 'DIALOGUE', actor: 'HERTZ', text: "Hmph. Physics for 200.", delayAfter: 1000 },

  // --- ROUND 1: HERTZ DOMINATES ---
  { action: 'SELECT_CLUE', catIdx: 0, clueIdx: 0, delayAfter: 800 },
  { action: 'SHOW_CLUE', text: "The change in frequency of a wave in relation to an observer who is moving relative to the wave source.", delayAfter: 3000 },
  { action: 'BUZZ', actor: 'HERTZ', delayAfter: 300 },
  { action: 'ANSWER', actor: 'HERTZ', text: "What is the Doppler Effect? Child's play.", delayAfter: 2000 },
  { action: 'JUDGE', actor: 'HOST', text: "Correct.", delayAfter: 1000 },
  { action: 'SHOW_BOARD', delayAfter: 1000 },

  { action: 'DIALOGUE', actor: 'HERTZ', text: "Instrumentation, 400.", delayAfter: 1000 },
  { action: 'SELECT_CLUE', catIdx: 4, clueIdx: 1, delayAfter: 800 },
  { action: 'SHOW_CLUE', text: "This component determines the firing delay patterns for phased array systems.", delayAfter: 2500 },
  { action: 'BUZZ', actor: 'POLIS', delayAfter: 100 }, // Super fast reaction
  { action: 'ANSWER', actor: 'POLIS', text: "What is the Beam Former.", delayAfter: 1500 },
  { action: 'JUDGE', actor: 'HOST', text: "Precise.", delayAfter: 1000 },
  { action: 'SHOW_BOARD', delayAfter: 1000 },

  // --- ROUND 2: POLIS CALCULATES ---
  { action: 'DIALOGUE', actor: 'POLIS', text: "Calculated risk. Bio-Effects for 600.", delayAfter: 1000 },
  { action: 'SELECT_CLUE', catIdx: 2, clueIdx: 2, delayAfter: 800 },
  { action: 'SHOW_CLUE', text: "DAILY DOUBLE", delayAfter: 1500 }, 
  { action: 'DIALOGUE', actor: 'HOST', text: "A Daily Double. Wager?", delayAfter: 1500 },
  { action: 'DIALOGUE', actor: 'POLIS', text: "Risk is minimal. 1000.", delayAfter: 1500 },
  { action: 'SHOW_CLUE', text: "This term describes the conversion of sound energy into heat within the tissue.", delayAfter: 3000 },
  { action: 'ANSWER', actor: 'POLIS', text: "What is Absorption.", delayAfter: 1500 },
  { action: 'JUDGE', actor: 'HOST', text: "Correct.", delayAfter: 1000 },
  { action: 'SHOW_BOARD', delayAfter: 1000 },

  // --- ROUND 3: THE STUMBLE & STEAL ---
  { action: 'DIALOGUE', actor: 'HARVEY', text: "My turn! Artifacts 800! Big money!", delayAfter: 1000 },
  { action: 'SELECT_CLUE', catIdx: 1, clueIdx: 3, delayAfter: 800 },
  { action: 'SHOW_CLUE', text: "The appearance of debris in a cystic structure due to the beam having finite thickness.", delayAfter: 3500 },
  { action: 'BUZZ', actor: 'HARVEY', delayAfter: 800 },
  { action: 'ANSWER', actor: 'HARVEY', text: "What is... uh... Side Lobe Artifact?", delayAfter: 2000 },
  { action: 'JUDGE', actor: 'HOST', text: "Incorrect.", delayAfter: 800 },
  { action: 'BUZZ', actor: 'HERTZ', delayAfter: 400 },
  { action: 'ANSWER', actor: 'HERTZ', text: "What is Slice Thickness Artifact. Amateurs.", delayAfter: 2000 },
  { action: 'JUDGE', actor: 'HOST', text: "Correct.", delayAfter: 1000 },
  { action: 'SHOW_BOARD', delayAfter: 1000 },

  // --- ROUND 4: FINAL JEOPARDY SIMULATION ---
  { action: 'DIALOGUE', actor: 'HOST', text: "The board is cleared. The Final Phase.", delayAfter: 2500 },
  { action: 'FINAL_JEOPARDY', text: "Category: HISTORY OF ULTRASOUND", delayAfter: 2500 },
  { action: 'SHOW_CLUE', text: "This Austrian physicist first described the frequency shift of waves from a moving source in 1842.", delayAfter: 4000 },
  
  // Harvey's Answer
  { action: 'DIALOGUE', actor: 'HOST', text: "Harvey?", delayAfter: 1000 },
  { action: 'ANSWER', actor: 'HARVEY', text: "Who is... Einstein? He's the main guy, right?", delayAfter: 2000 },
  { action: 'JUDGE', actor: 'HOST', text: "No.", delayAfter: 1000 },

  // Polis's Answer
  { action: 'DIALOGUE', actor: 'HOST', text: "Polis?", delayAfter: 1000 },
  { action: 'ANSWER', actor: 'POLIS', text: "Who is Christian Doppler.", delayAfter: 1500 },
  { action: 'JUDGE', actor: 'HOST', text: "Correct.", delayAfter: 1000 },

  // Hertz's Answer
  { action: 'DIALOGUE', actor: 'HOST', text: "Dr. Hertz.", delayAfter: 1000 },
  { action: 'ANSWER', actor: 'HERTZ', text: "Who is Doppler. The father of us all.", delayAfter: 2500 },
  { action: 'JUDGE', actor: 'HOST', text: "Indeed.", delayAfter: 1500 },

  // --- OUTRO ---
  { action: 'OUTRO', text: "Simulation Complete. Begin your training.", delayAfter: 0 }
];

interface DemoGameProps {
  onComplete: () => void;
  volume?: number;
}

const DemoGame: React.FC<DemoGameProps> = ({ onComplete, volume = 1.0 }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [boardData, setBoardData] = useState<GameBoardData>(JSON.parse(JSON.stringify(DEMO_BOARD)));
  const [activeClue, setActiveClue] = useState<{ cat: number, clue: number, text: string, isFinal?: boolean } | null>(null);
  const [buzzerWinner, setBuzzerWinner] = useState<Actor | null>(null);
  const [scores, setScores] = useState({ HERTZ: 0, HARVEY: 0, POLIS: 0 });
  const [speakingActor, setSpeakingActor] = useState<Actor | null>(null);
  const [subtitle, setSubtitle] = useState<string>("");
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Audio Context once
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtxRef.current = new AudioContextClass();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  useEffect(() => {
    executeStep(stepIndex);
  }, [stepIndex]);

  const executeStep = async (index: number) => {
    if (index >= DEMO_SCRIPT.length) {
      onComplete();
      return;
    }

    const step = DEMO_SCRIPT[index];
    console.log(`Executing Step ${index}: ${step.action}`);

    // Update UI State based on action
    if (step.action === 'INTRO') {
       setSubtitle(step.text || "");
       if (step.text) await playAudio(step.text, VOICES.HOST);
    } else if (step.action === 'OUTRO') {
       setSubtitle(step.text || "");
       if (step.text) await playAudio(step.text, VOICES.HOST);
    } else if (step.action === 'SHOW_BOARD') {
      setActiveClue(null);
      setBuzzerWinner(null);
      setSubtitle(step.text || "");
      if (step.text) await playAudio(step.text, VOICES.HOST);
    } else if (step.action === 'DIALOGUE') {
      setSpeakingActor(step.actor!);
      setSubtitle(step.text || "");
      await playAudio(step.text!, VOICES[step.actor!]);
      setSpeakingActor(null);
    } else if (step.action === 'SELECT_CLUE') {
       // Visual highlight logic could go here
       playSfx('click', volume);
       const txt = `Selecting ${DEMO_CATEGORIES[step.catIdx!].title} for ${DEMO_CATEGORIES[step.catIdx!].clues[step.clueIdx!].value}`;
       setSubtitle(txt + "...");
       await playAudio(txt, VOICES.HOST);
    } else if (step.action === 'SHOW_CLUE') {
      // Check if it's Final Jeopardy or regular
      const isFinal = DEMO_SCRIPT.slice(0, index).some(s => s.action === 'FINAL_JEOPARDY');
      
      let catIdx = 0;
      let clueIdx = 0;
      
      // Try to find context from previous SELECT_CLUE
      for(let i = index - 1; i >= 0; i--) {
          if (DEMO_SCRIPT[i].action === 'SELECT_CLUE') {
              catIdx = DEMO_SCRIPT[i].catIdx!;
              clueIdx = DEMO_SCRIPT[i].clueIdx!;
              break;
          }
      }

      setActiveClue({
        cat: catIdx,
        clue: clueIdx,
        text: step.text!,
        isFinal: isFinal
      });
      // Host reads clue
      setSpeakingActor('HOST');
      setSubtitle(step.text!);
      await playAudio(step.text!, VOICES.HOST);
      setSpeakingActor(null);
    } else if (step.action === 'FINAL_JEOPARDY') {
       // Transition to Final Jeopardy visual
       setActiveClue({
           cat: -1,
           clue: -1,
           text: step.text!, // "Category: HISTORY..."
           isFinal: true
       });
       setSubtitle(step.text!);
       await playAudio(step.text!, VOICES.HOST);
    } else if (step.action === 'BUZZ') {
      setBuzzerWinner(step.actor!);
      playSfx('buzz', volume);
    } else if (step.action === 'ANSWER') {
      setSpeakingActor(step.actor!);
      setSubtitle(step.text!);
      playSfx('submit', volume); // Soft ping for answer start
      await playAudio(step.text!, VOICES[step.actor!]);
      setSpeakingActor(null);
    } else if (step.action === 'JUDGE') {
      const isCorrect = step.text?.toLowerCase().includes("correct") && !step.text?.toLowerCase().includes("incorrect");
      playSfx(isCorrect ? 'correct' : 'incorrect', volume);

      setSpeakingActor('HOST');
      setSubtitle(step.text!);
      await playAudio(step.text!, VOICES.HOST);
      setSpeakingActor(null);
      
      // Update score
      // Find the last ANSWER
      let prevStep = null;
      for(let i = index - 1; i >= 0; i--) {
          if (DEMO_SCRIPT[i].action === 'ANSWER') {
              prevStep = DEMO_SCRIPT[i];
              break;
          }
      }
      
      if (prevStep) {
        // Get value from active clue or fallback
        let clueValue = 0;
        
        // Find wager if exists in history since last clue shown
        // Or find clue value
        // Simple logic: if Final Jeopardy, look for wager logic (not implemented fully in state yet, but we can fake it)
        
        // Check for wager in recent history
        let wager = 0;
        // In this script, only Polis wagers on Daily Double.
        // For Final Jeopardy, we assume "All in" or just simulate.
        
        // Let's just grab the clue value from the last SELECT_CLUE if not Final Jeopardy
        const isFinal = DEMO_SCRIPT.slice(0, index).some(s => s.action === 'FINAL_JEOPARDY');
        
        if (isFinal) {
             // Arbitrary high value for final
             clueValue = 5000; 
        } else {
             // Check if it was a Daily Double wager
             // We can just hardcode or look back
             // Simplest: Check if previous steps had "wager" logic
             // But for the demo, let's just use standard value unless we see specific text
             
             // Look for SELECT_CLUE
             for(let i = index; i >= 0; i--) {
                 if (DEMO_SCRIPT[i].action === 'SELECT_CLUE') {
                     clueValue = DEMO_CATEGORIES[DEMO_SCRIPT[i].catIdx!].clues[DEMO_SCRIPT[i].clueIdx!].value;
                     break;
                 }
             }
             
             // Hack for Daily Double wager
             if (DEMO_SCRIPT.slice(index-5, index).some(s => s.text?.includes("wager 1000"))) {
                 clueValue = 1000;
             }
        }

        setScores(prev => ({
            ...prev,
            [prevStep!.actor!]: prev[prevStep!.actor!] + (isCorrect ? clueValue : -clueValue)
        }));
      }

      if (step.text?.toLowerCase().includes("correct") && !step.text?.toLowerCase().includes("incorrect")) {
        // Correct answer closes the clue
        // Unless it's Final Jeopardy where we might stay on the screen?
        // Actually, usually we clear after judging.
        // But for Final Jeopardy we might want to keep it up until all are judged.
        // The script has multiple JUDGEs for Final Jeopardy.
        // So we shouldn't clear activeClue automatically here if we are in Final Jeopardy
        const isFinal = DEMO_SCRIPT.slice(0, index).some(s => s.action === 'FINAL_JEOPARDY');
        if (!isFinal) {
             // Wait a moment then clear?
             // Actually the next step SHOW_BOARD does that.
        }
      }
    } else if (step.action === 'OUTRO') {
       setSpeakingActor('HOST');
       setSubtitle(step.text!);
       await playAudio(step.text!, VOICES.HOST);
    } else if (step.action === 'INTRO') {
       setSubtitle(step.text!);
    }

    // Schedule next step
    const delay = step.delayAfter || 500;
    timerRef.current = setTimeout(() => {
      setStepIndex(prev => prev + 1);
    }, delay);
  };

  const playAudio = async (text: string, voice: string) => {
    try {
      const buffer = await generateSpeech(text, voice, volume);
      
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const gainNode = ctx.createGain();
      gainNode.gain.value = volume;

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
      
      return new Promise<void>((resolve) => {
        source.onended = () => {
          // Do not close context here, we reuse it
          resolve();
        };
      });
    } catch (e) {
      console.error("Audio failed", e);
      return new Promise<void>(r => setTimeout(r, 1000 + text.length * 50));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden font-sans">
      {/* Cinematic Overlay & Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0.9)_80%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      {/* --- MIDDLE SECTION: GAME BOARD --- */}
      <div className="flex-1 w-full flex items-center justify-center p-4 relative z-10 min-h-0 mt-8">
         {activeClue ? (
            <div className={`w-full max-w-5xl aspect-video ${activeClue.isFinal ? 'bg-slate-950/80 border-amber-500/50 shadow-[0_0_150px_rgba(245,158,11,0.3)]' : 'bg-slate-900/60 border-blue-500/30 shadow-[0_0_100px_rgba(59,130,246,0.2)]'} border rounded-3xl flex flex-col items-center justify-center p-12 text-center backdrop-blur-2xl animate-in zoom-in duration-300 ring-1 ring-white/10`}>
               <div className={`mb-8 opacity-50 ${activeClue.isFinal ? 'text-amber-300' : 'text-blue-300'} font-mono tracking-[0.2em] uppercase text-sm`}>
                   {activeClue.isFinal ? 'FINAL PHASE // CRITICAL' : 'Active Data Stream'}
               </div>
               <h2 className={`text-3xl md:text-5xl font-cinzel font-black ${activeClue.isFinal ? 'text-amber-100' : 'text-white'} leading-tight drop-shadow-2xl uppercase max-w-4xl`}>
                  {activeClue.text}
               </h2>
            </div>
         ) : (
            <div className="w-full max-w-6xl h-full flex items-center justify-center scale-95 md:scale-100 transition-transform duration-500">
               <GameBoard data={boardData} onClueClick={() => {}} />
            </div>
         )}
      </div>

      {/* --- BOTTOM SECTION: CONTESTANTS --- */}
      <div className="w-full relative z-20 pt-4 pb-24 px-4">
          <div className="max-w-5xl mx-auto flex items-end justify-center space-x-8 md:space-x-16">
            
             {/* HERTZ */}
             <div className={`flex flex-col items-center transition-all duration-300 ${buzzerWinner === 'HERTZ' ? 'scale-110 -translate-y-4' : 'opacity-70 hover:opacity-100'}`}>
                <div className={`relative p-1 rounded-full ${buzzerWinner === 'HERTZ' ? 'bg-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.6)]' : 'bg-transparent'}`}>
                    <HostAvatar mood={speakingActor === 'HERTZ' ? 'speaking' : 'neutral'} type="hertz" variant="header" />
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md border border-purple-500/30 px-6 py-2 rounded-xl mt-3 text-center min-w-[120px] shadow-lg">
                   <span className="block text-purple-400 font-mono font-bold text-2xl drop-shadow-md">${scores.HERTZ}</span>
                   <span className="block text-[10px] text-purple-300/70 font-black tracking-[0.2em] uppercase mt-1">Dr. Hertz</span>
                </div>
             </div>

             {/* HARVEY */}
             <div className={`flex flex-col items-center transition-all duration-300 ${buzzerWinner === 'HARVEY' ? 'scale-110 -translate-y-4' : 'opacity-70 hover:opacity-100'}`}>
                <div className={`relative p-1 rounded-full ${buzzerWinner === 'HARVEY' ? 'bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.6)]' : 'bg-transparent'}`}>
                    <HostAvatar mood={speakingActor === 'HARVEY' ? 'speaking' : 'neutral'} type="harvey" variant="header" />
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 px-6 py-2 rounded-xl mt-3 text-center min-w-[120px] shadow-lg">
                   <span className="block text-amber-400 font-mono font-bold text-2xl drop-shadow-md">${scores.HARVEY}</span>
                   <span className="block text-[10px] text-amber-300/70 font-black tracking-[0.2em] uppercase mt-1">Prof. Harvey</span>
                </div>
             </div>

             {/* POLIS */}
             <div className={`flex flex-col items-center transition-all duration-300 ${buzzerWinner === 'POLIS' ? 'scale-110 -translate-y-4' : 'opacity-70 hover:opacity-100'}`}>
                <div className={`relative p-1 rounded-full ${buzzerWinner === 'POLIS' ? 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.6)]' : 'bg-transparent'}`}>
                    <HostAvatar mood={speakingActor === 'POLIS' ? 'speaking' : 'neutral'} type="polis" variant="header" />
                </div>
                <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 px-6 py-2 rounded-xl mt-3 text-center min-w-[120px] shadow-lg">
                   <span className="block text-emerald-400 font-mono font-bold text-2xl drop-shadow-md">${scores.POLIS}</span>
                   <span className="block text-[10px] text-emerald-300/70 font-black tracking-[0.2em] uppercase mt-1">Polis Prime</span>
                </div>
             </div>

          </div>
      </div>

      {/* --- CINEMATIC CAPTION BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 p-6 z-50 flex items-center justify-center min-h-[100px]">
         <div className="max-w-4xl w-full flex items-center space-x-6">
            {/* Speaker Indicator */}
            <div className="shrink-0">
               {speakingActor === 'HOST' && <HostAvatar mood="speaking" type="echo" variant="header" />}
               {speakingActor === 'HERTZ' && <HostAvatar mood="speaking" type="hertz" variant="header" />}
               {speakingActor === 'HARVEY' && <HostAvatar mood="speaking" type="harvey" variant="header" />}
               {speakingActor === 'POLIS' && <HostAvatar mood="speaking" type="polis" variant="header" />}
            </div>
            
            {/* Text */}
            <div className="flex-1">
               <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                  {speakingActor === 'HOST' ? 'The Guide' : 
                   speakingActor === 'HERTZ' ? 'Dr. Hertz' :
                   speakingActor === 'HARVEY' ? 'Prof. Harvey' : 'Polis Prime'}
               </div>
               <p className="text-xl md:text-2xl font-cinzel text-white leading-relaxed drop-shadow-sm">
                  {subtitle}
               </p>
            </div>
         </div>
      </div>


      {/* Skip Button */}
      <div className="absolute top-6 right-8 z-30">
         <button 
           onClick={onComplete}
           className="group flex items-center space-x-2 text-slate-500 hover:text-white transition-all bg-black/20 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-transparent hover:border-white/20"
         >
            <span className="uppercase tracking-widest text-[10px] font-bold">Skip Sim</span>
            <SkipForward size={14} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>

    </div>
  );
};

export default DemoGame;