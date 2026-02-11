
import React, { useState, useEffect, useRef } from 'react';
import { Clue, Difficulty } from '../types';
import { generateFinalJeopardyClue } from '../services/geminiService';
import { playSfx } from '../services/soundEffects';
import { ShieldAlert, Zap, Send, TrendingUp, AlertTriangle, Mic, MicOff } from 'lucide-react';

interface FinalJeopardyProps {
  score: number;
  difficulty: Difficulty;
  onAnswer: (answer: string, wager: number) => void;
  onLoadingStart: () => void;
}

const FinalJeopardy: React.FC<FinalJeopardyProps> = ({ score, difficulty, onAnswer, onLoadingStart }) => {
  const [phase, setPhase] = useState<'WAGER' | 'CLUE'>('WAGER');
  const [wager, setWager] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [finalData, setFinalData] = useState<{ category: string, clue: Clue } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await generateFinalJeopardyClue(difficulty);
        setFinalData(data);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    load();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        if (phase === 'WAGER') {
            const num = parseInt(transcript.replace(/[^0-9]/g, ''));
            if (!isNaN(num)) setWager(Math.min(num, Math.max(score, 1000)));
        } else {
            setInputValue(transcript);
        }
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }

    return () => recognitionRef.current?.abort();
  }, [difficulty, phase, score]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      playSfx('click');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const maxWager = Math.max(score, 1000);

  const handleWagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wager >= 0 && wager <= maxWager) {
      // playSfx('start');
      setPhase('CLUE');
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      playSfx('submit');
      onAnswer(inputValue, wager);
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center p-12 md:p-24 space-y-8 animate-in fade-in duration-500">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-red-900/20 rounded-full animate-pulse"></div>
                <ShieldAlert className="absolute inset-0 m-auto text-red-500 w-10 h-10 animate-bounce" />
            </div>
            <p className="text-red-500 font-cinzel font-black tracking-[0.5em] uppercase text-center">Stabilizing Final Matrix</p>
        </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto tech-border-container p-0.5 rounded-3xl animate-in zoom-in-95 duration-700">
      <div className="tech-corner tl accent-red"></div>
      <div className="tech-corner tr accent-red"></div>
      <div className="tech-corner bl accent-red"></div>
      <div className="tech-corner br accent-red"></div>

      <div className="bg-slate-950/80 backdrop-blur-3xl p-6 md:p-16 rounded-3xl border border-red-500/20 shadow-[0_0_100px_rgba(239,68,68,0.15)] flex flex-col items-center text-center">
        
        {phase === 'WAGER' && (
          <div className="space-y-8 md:space-y-12 w-full animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col items-center">
                <div className="p-4 bg-red-500/10 rounded-full mb-6 border border-red-500/30">
                    <AlertTriangle className="text-red-500 w-8 h-8 md:w-12 md:h-12" />
                </div>
                <h2 className="text-xl md:text-3xl font-cinzel font-black text-white tracking-[0.3em] uppercase mb-2">Final Protocol Engaged</h2>
                <div className="text-red-500 text-[10px] md:text-xs font-bold tracking-[0.6em] uppercase">Target Sector: {finalData?.category}</div>
            </div>

            <form onSubmit={handleWagerSubmit} className="space-y-6 md:space-y-10 w-full max-w-lg mx-auto">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex w-full items-center space-x-4 mb-4">
                        <button type="button" onClick={toggleListening} className={`p-4 rounded-xl border transition-all ${isListening ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                        </button>
                        <div className="flex-1 flex flex-col items-center space-y-2">
                             <input 
                                type="range" 
                                min="0" 
                                max={maxWager} 
                                value={wager} 
                                onChange={(e) => setWager(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                            <input 
                                type="number"
                                value={wager}
                                onChange={(e) => setWager(Math.min(parseInt(e.target.value) || 0, maxWager))}
                                className="relative w-full bg-slate-950 border border-red-500/30 rounded-xl py-4 text-2xl font-mono text-center text-red-100 outline-none"
                            />
                        </div>
                    </div>
                </div>
                <button type="submit" className="w-full py-4 bg-red-600/10 hover:bg-red-500/30 border border-red-500/40 text-red-100 font-black rounded-xl md:rounded-2xl transition-all tracking-[0.4em] uppercase text-sm active:scale-95 flex items-center justify-center space-x-4">
                    <span>Lock Wager</span>
                    <TrendingUp size={20} />
                </button>
            </form>
          </div>
        )}

        {phase === 'CLUE' && finalData && (
          <div className="space-y-8 md:space-y-16 w-full animate-in zoom-in-95 duration-500">
             <div className="flex items-center justify-center space-x-4 text-red-500/60 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">
                <Zap size={14} className="animate-pulse" />
                <span>Synchronizing Final Transmission</span>
                <Zap size={14} className="animate-pulse" />
             </div>
             <p className="text-xl md:text-5xl font-cinzel font-black text-white leading-relaxed drop-shadow-2xl">{finalData.clue.clueText}</p>

             <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-6">
                <div className="flex w-full items-center space-x-4">
                    <button type="button" onClick={toggleListening} className={`p-6 rounded-2xl border transition-all ${isListening ? 'bg-red-500/20 border-red-500 text-red-500 shadow-xl animate-pulse' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                        {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                    </button>
                    <form onSubmit={handleAnswerSubmit} className="flex-1 relative group">
                        <div className="absolute -inset-1 bg-red-500/20 rounded-2xl blur-lg opacity-40 group-focus-within:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden focus-within:border-red-500/40 transition-all">
                            <input
                                type="text"
                                autoFocus
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-50 text-xl md:text-3xl font-mono uppercase tracking-wider placeholder:text-slate-800 py-6 outline-none px-8 text-center"
                                placeholder={isListening ? "LISTENING..." : "FINAL ANSWER..."}
                                autoComplete="off"
                            />
                        </div>
                    </form>
                </div>
                <button type="submit" onClick={handleAnswerSubmit} disabled={!inputValue.trim()} className="w-full py-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl tracking-[0.5em] uppercase text-xs md:text-lg transition-all active:scale-95 flex items-center justify-center space-x-4">
                    <span>Final Transmission</span>
                    <Send size={20} />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalJeopardy;
