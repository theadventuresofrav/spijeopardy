import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Sparkles, User, Zap, Skull } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { playSfx } from '../services/soundEffects';

interface IntroProps {
  onComplete: () => void;
  userName: string;
}

interface ScriptLine {
  id: number;
  speaker: 'HOST' | 'HERTZ' | 'PLAYER' | 'POLIS';
  text: string;
  voice: string;
  delay: number; // Delay before starting this line
  visualState: 'DARK' | 'LOGO' | 'FACE_OFF' | 'READY';
}

export const CinematicIntro: React.FC<IntroProps> = ({ onComplete, userName }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [displayedText, setDisplayedText] = useState('');
  const [visualState, setVisualState] = useState<'DARK' | 'LOGO' | 'FACE_OFF' | 'READY'>('DARK');
  const [isSkipped, setIsSkipped] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const script: ScriptLine[] = [
    {
      id: 1,
      speaker: 'HOST',
      text: "Welcome... to the Echo Chamber.",
      voice: 'Aoede',
      delay: 1000,
      visualState: 'DARK'
    },
    {
      id: 2,
      speaker: 'HOST',
      text: "Where sound waves determine your fate, and physics is the only law.",
      voice: 'Aoede',
      delay: 500,
      visualState: 'LOGO'
    },
    {
      id: 3,
      speaker: 'HERTZ',
      text: "Hmph. Another rookie? They usually crack under the pressure of the Doppler shift.",
      voice: 'Fenrir',
      delay: 800,
      visualState: 'FACE_OFF'
    },
    {
      id: 4,
      speaker: 'PLAYER',
      text: "I've studied the artifacts. I'm ready for the scan.",
      voice: 'Orion', 
      delay: 800,
      visualState: 'FACE_OFF'
    },
    {
      id: 5,
      speaker: 'POLIS',
      text: "Probability of success: 14%. Proceed with caution.",
      voice: 'Kore',
      delay: 800,
      visualState: 'FACE_OFF'
    },
    {
      id: 6,
      speaker: 'HOST',
      text: "Then let the games... begin.",
      voice: 'Aoede',
      delay: 1000,
      visualState: 'READY'
    }
  ];

  useEffect(() => {
    let stopSfx: (() => void) | undefined;
    const start = async () => {
        await new Promise(r => setTimeout(r, 100));
        stopSfx = runSequence();
    };
    start();
    
    return () => {
      if (stopSfx) stopSfx();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const playAudio = async (text: string, voice: string) => {
    if (isSkipped) return;
    try {
      const buffer = await generateSpeech(text, voice);
      if (isSkipped) return;
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      
      return new Promise<void>((resolve) => {
        source.onended = () => {
          ctx.close();
          resolve();
        };
      });
    } catch (e) {
      console.error("Audio generation failed", e);
      // Fallback delay if audio fails
      return new Promise<void>(r => setTimeout(r, 2000));
    }
  };

  const runSequence = () => {
    
    (async () => {
        for (let i = 0; i < script.length; i++) {
        if (isSkipped) break;
        
        const line = script[i];
        setCurrentLineIndex(i);
        setVisualState(line.visualState);
        setDisplayedText(line.text); 
        
        await new Promise(r => setTimeout(r, line.delay));
        
        if (isSkipped) break;
        await playAudio(line.text, line.voice);
        
        // Extra delay for reading
        await new Promise(r => setTimeout(r, 3000));
        }
        
        if (!isSkipped) {
        setTimeout(onComplete, 1000);
        }
    })();

    return () => {
        // cleanup if needed
    };
  };

  const handleSkip = () => {
    setIsSkipped(true);
    if (audioCtxRef.current) audioCtxRef.current.close();
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden font-mono text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-80" />
      
      {/* Visual State: DARK (Spotlight) */}
      {visualState === 'DARK' && (
        <div className="relative z-10 animate-pulse">
          <div className="w-32 h-32 rounded-full bg-blue-500/10 blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Visual State: LOGO */}
      {visualState === 'LOGO' && (
        <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
           <div className="w-48 h-48 border-4 border-double border-blue-400/30 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)]">
              <Sparkles className="w-24 h-24 text-blue-400 animate-spin-slow" />
           </div>
           <h1 className="mt-8 text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
             ECHO JEOPARDY
           </h1>
        </div>
      )}

      {/* Visual State: FACE_OFF */}
      {visualState === 'FACE_OFF' && (
        <div className="relative z-10 flex items-center justify-center gap-12 w-full max-w-4xl px-8">
           {/* Player */}
           <div className={`flex flex-col items-center transition-all duration-500 ${script[currentLineIndex]?.speaker === 'PLAYER' ? 'scale-110 opacity-100' : 'scale-90 opacity-50 blur-sm'}`}>
              <div className="w-32 h-32 bg-blue-500/20 rounded-full border border-blue-400 flex items-center justify-center mb-4">
                 <User size={64} className="text-blue-300" />
              </div>
              <div className="text-blue-200 font-bold tracking-widest">{userName.toUpperCase()}</div>
           </div>

           {/* VS */}
           <div className="text-6xl font-black text-white/10 italic">VS</div>

           {/* Rival */}
           <div className={`flex flex-col items-center transition-all duration-500 ${script[currentLineIndex]?.speaker === 'HERTZ' ? 'scale-110 opacity-100' : 'scale-90 opacity-50 blur-sm'}`}>
              <div className="w-32 h-32 bg-red-500/20 rounded-full border border-red-400 flex items-center justify-center mb-4">
                 <Skull size={64} className="text-red-300" />
              </div>
              <div className="text-red-200 font-bold tracking-widest">DR. HERTZ</div>
           </div>
        </div>
      )}

      {/* Visual State: READY */}
      {visualState === 'READY' && (
        <div className="relative z-10">
           <Zap size={120} className="text-yellow-400 animate-bounce" />
        </div>
      )}

      {/* Subtitles / Dialogue Box */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20 px-4">
        {currentLineIndex >= 0 && (
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-2 h-2 rounded-full ${
                script[currentLineIndex].speaker === 'HOST' ? 'bg-purple-400' :
                script[currentLineIndex].speaker === 'HERTZ' ? 'bg-red-400' :
                script[currentLineIndex].speaker === 'POLIS' ? 'bg-emerald-400' : 'bg-blue-400'
              }`} />
              <span className={`text-xs font-bold tracking-widest ${
                script[currentLineIndex].speaker === 'HOST' ? 'text-purple-400' :
                script[currentLineIndex].speaker === 'HERTZ' ? 'text-red-400' :
                script[currentLineIndex].speaker === 'POLIS' ? 'text-emerald-400' : 'text-blue-400'
              }`}>
                {script[currentLineIndex].speaker === 'PLAYER' ? userName.toUpperCase() : script[currentLineIndex].speaker}
              </span>
            </div>
            <p className="text-xl md:text-2xl text-white font-light leading-relaxed">
              "{displayedText}"
            </p>
          </div>
        )}
      </div>

      {/* Skip Button */}
      <button 
        onClick={handleSkip}
        className="absolute top-8 right-8 text-white/30 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm transition-all z-50 uppercase tracking-widest"
      >
        Skip Intro
      </button>
    </div>
  );
};
