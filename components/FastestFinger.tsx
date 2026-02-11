
import React, { useState, useEffect, useRef } from 'react';
import { Clue } from '../types';
import { generateSingleClue } from '../services/geminiService';
import { playSfx } from '../services/soundEffects';
import { Timer, Zap, AlertCircle, Fingerprint, Activity, CheckCircle, RotateCcw, Mic, MicOff } from 'lucide-react';

interface FastestFingerProps {
  onComplete: (scoreDelta: number) => void;
  onExit: () => void;
  currentScore: number;
}

const FastestFinger: React.FC<FastestFingerProps> = ({ onComplete, onExit, currentScore }) => {
  const [clue, setClue] = useState<Clue | null>(null);
  const [status, setStatus] = useState<'LOADING' | 'READY' | 'ACTIVE' | 'BUZZED_USER' | 'BUZZED_AI' | 'ANSWERING' | 'SUCCESS'>('LOADING');
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const opponentProgress = useRef(0);
  const opponentRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const aiReactionTime = useRef(Math.random() * 2000 + 3000);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    loadClue();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('').toLowerCase();
        
        // Custom "Voice Buzz" logic
        if (status === 'ACTIVE' && (transcript.includes('freeze') || transcript.includes('buzz') || transcript.includes('stop'))) {
          handleUserBuzz();
        } else if (status === 'ANSWERING') {
          setInputValue(transcript);
        }
      };
      recognitionRef.current.onend = () => { if (isListening) recognitionRef.current?.start(); };
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      recognitionRef.current?.stop();
    };
  }, [status]);

  const toggleGlobalListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      playSfx('click');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const loadClue = async () => {
    setStatus('LOADING');
    setInputValue('');
    try {
      const newClue = await generateSingleClue();
      setClue(newClue);
      setStatus('READY');
      setTimeout(() => {
        playSfx('start');
        startRound();
      }, 1500);
    } catch (e) {
      console.error(e);
      onExit();
    }
  };

  const startRound = () => {
    setStatus('ACTIVE');
    const startTime = Date.now();
    opponentProgress.current = 0;
    aiReactionTime.current = Math.random() * 2500 + 2500;
    
    const loop = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / aiReactionTime.current) * 100, 100);
      opponentProgress.current = progress;
      if (opponentRef.current) {
         opponentRef.current.style.width = `${progress}%`;
      }
      
      if (elapsed >= aiReactionTime.current) handleAiBuzz();
      else animationFrameRef.current = requestAnimationFrame(loop);
    };
    loop();
  };

  const handleAiBuzz = () => {
    playSfx('incorrect');
    setStatus('BUZZED_AI');
    cancelAnimationFrame(animationFrameRef.current);
    setTimeout(() => { onComplete(0); loadClue(); }, 2500);
  };

  const handleUserBuzz = () => {
    if (status !== 'ACTIVE') return;
    cancelAnimationFrame(animationFrameRef.current);
    playSfx('click');
    setStatus('ANSWERING');
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      playSfx('submit');
      setStatus('SUCCESS');
      onComplete(1); 
      setTimeout(() => loadClue(), 1500);
    }
  };

  const handleSkip = () => { playSfx('click'); loadClue(); };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl shadow-2xl relative overflow-hidden border border-red-900/30 min-h-[450px] md:min-h-[500px] flex flex-col">
      <div className="absolute inset-0 bg-slate-950">
         <div className="scan-line" style={{ animationDuration: '3s' }}></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(153,27,27,0.15)_0%,_rgba(0,0,0,0)_80%)]"></div>
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative z-10 p-4 md:p-12 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4 md:mb-12 border-b border-red-500/20 pb-3 md:pb-4">
            <div className="flex items-center space-x-2 text-red-500 animate-pulse">
              <Activity size={16} />
              <span className="font-cinzel font-black tracking-widest uppercase text-[8px] md:text-sm">Reflex Loop</span>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={toggleGlobalListening} className={`p-2 rounded-lg border transition-all ${isListening ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <div className="text-red-100 font-cinzel text-sm md:text-2xl font-black">WINS: {currentScore}</div>
            </div>
            <button type="button" onClick={onExit} className="text-red-800 hover:text-red-400 text-[8px] md:text-[10px] uppercase font-black px-2 py-1 transition-colors">X</button>
        </div>

        {status === 'LOADING' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 md:space-y-8">
              <div className="relative"><div className="w-16 h-16 border-4 border-red-900/30 rounded-full"></div><div className="absolute inset-0 w-16 h-16 border-t-4 border-red-500 rounded-full animate-spin"></div></div>
              <p className="text-red-500 font-cinzel tracking-[0.2em] text-[10px] md:text-lg animate-pulse font-black uppercase">Syncing Reflex</p>
            </div>
        )}

        {status === 'READY' && <div className="flex-1 flex flex-col items-center justify-center"><div className="text-4xl md:text-9xl font-black font-cinzel text-white animate-pulse opacity-60">READY</div></div>}

        {(status === 'ACTIVE' || status === 'BUZZED_AI' || status === 'ANSWERING' || status === 'SUCCESS') && clue && (
            <div className="flex-1 flex flex-col space-y-4 md:space-y-12">
                <div className="bg-slate-900/80 p-5 md:p-12 rounded-xl border border-red-500/20 min-h-[100px] md:min-h-[200px] flex items-center justify-center text-center shadow-inner relative overflow-hidden">
                    <p className="text-base md:text-5xl font-cinzel font-black text-red-50 uppercase leading-snug drop-shadow-lg relative z-10">{clue.clueText}</p>
                </div>

                <div className="relative h-10 md:h-20 bg-black/60 rounded-lg border border-red-900/50 overflow-hidden shadow-inner">
                    <div 
                      ref={opponentRef}
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-900/0 to-red-600 border-r-2 border-white/50"
                      style={{ width: '0%' }}
                    ></div>
                    {(status === 'ANSWERING' || status === 'SUCCESS') && (
                      <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm z-30 animate-in fade-in duration-200 ${status === 'SUCCESS' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                          <span className={`font-black tracking-widest text-[10px] md:text-lg uppercase px-4 py-2 rounded-lg border-2 ${status === 'SUCCESS' ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400 border-red-500/30'}`}>
                              {status === 'SUCCESS' ? 'SIGNAL VERIFIED' : 'SIGNAL LOCKED'}
                          </span>
                      </div>
                    )}
                </div>

                {status === 'ACTIVE' && (
                <button 
                    onClick={handleUserBuzz}
                    className="w-full flex-1 py-10 bg-red-900/10 active:bg-red-900/40 rounded-xl border border-red-500/30 flex flex-col items-center justify-center group"
                >
                    <div className="text-5xl md:text-7xl font-black text-red-100 transition-transform flex items-center justify-center">
                        <Fingerprint size={48} className="mr-4 opacity-60" />
                        <span className="font-cinzel tracking-widest">FREEZE</span>
                    </div>
                    {isListening && <p className="mt-4 text-[9px] text-red-500/60 font-bold uppercase tracking-widest animate-pulse">Voice Command Enabled: Speak "FREEZE"</p>}
                </button>
                )}

                {status === 'ANSWERING' && (
                <div className="animate-in slide-in-from-bottom-5 fade-in duration-300 bg-slate-900/80 p-4 md:p-10 rounded-xl border border-white/10 shadow-2xl">
                    <p className="text-emerald-400 mb-4 font-black text-[8px] md:text-xs uppercase tracking-widest">Transmit Answer Stream...</p>
                    <form onSubmit={handleAnswerSubmit} className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                        <input 
                        type="text" 
                        autoFocus
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 bg-black border border-emerald-500/30 text-emerald-50 p-4 rounded-xl text-lg md:text-2xl uppercase font-mono tracking-wide outline-none shadow-inner"
                        placeholder={isListening ? "LISTENING..." : "ANSWER..."}
                        autoComplete="off"
                        />
                        <button type="submit" disabled={!inputValue.trim()} className="bg-emerald-600 active:bg-emerald-500 text-white px-12 rounded-xl font-black uppercase text-sm">Transmit</button>
                    </form>
                </div>
                )}
                
                {status === 'SUCCESS' && (
                   <div className="flex-1 flex items-center justify-center animate-in zoom-in duration-500">
                      <div className="flex flex-col items-center text-emerald-400 space-y-4">
                          <CheckCircle size={80} className="md:w-32 md:h-32 shadow-2xl" />
                          <span className="font-cinzel font-black text-xl md:text-4xl tracking-widest uppercase">Verified</span>
                      </div>
                   </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default FastestFinger;
