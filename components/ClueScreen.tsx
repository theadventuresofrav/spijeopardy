import React, { useState, useEffect, useRef } from 'react';
import { Clue } from '../types';
import { Send, Play, Pause, RotateCcw, Terminal, Wifi, X, HeartPulse, Sparkles, Mic, MicOff, ChevronLeft } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { playSfx } from '../services/soundEffects';

interface ClueScreenProps {
  clue: Clue;
  categoryTitle: string;
  onAnswer: (answer: string) => void;
  onClose: () => void;
  onHintRequest: () => Promise<string>;
}

const ClueScreen: React.FC<ClueScreenProps> = ({ clue, categoryTitle, onAnswer, onClose, onHintRequest }) => {
  const [inputValue, setInputValue] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [hint, setHint] = useState<string | null>(clue.hintText || null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    const loadAudio = async () => {
      try {
        const buffer = await generateSpeech(clue.clueText);
        if (mounted) {
          setAudioBuffer(buffer);
          playAudio(buffer);
        }
      } catch (err) {
        console.error("TTS Error:", err);
      }
    };
    loadAudio();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInputValue(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }

    return () => {
      mounted = false;
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [clue.id]);

  const playAudio = (buffer: AudioBuffer) => {
    if (!buffer) return;
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioCtxRef.current = ctx;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    setIsPlaying(true);
    setIsPaused(false);
    source.onended = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    source.start(0);
  };

  const togglePlayback = () => {
    if (!audioCtxRef.current && audioBuffer) {
        playAudio(audioBuffer);
        return;
    }
    if (audioCtxRef.current) {
        if (audioCtxRef.current.state === 'running') {
            audioCtxRef.current.suspend();
            setIsPaused(true);
        } else if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
            setIsPaused(false);
        } else if (audioCtxRef.current.state === 'closed' && audioBuffer) {
            playAudio(audioBuffer);
        }
    }
  };

  const handleConsultancy = async () => {
    if (hint || isHintLoading) return;
    setIsHintLoading(true);
    playSfx('warp');
    try {
      const h = await onHintRequest();
      setHint(h);
      const hintAudio = await generateSpeech(h, 'Charon');
      playAudio(hintAudio);
    } catch (e) {
      console.error(e);
    } finally {
      setIsHintLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      playSfx('click');
      setInputValue('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      playSfx('submit');
      onAnswer(inputValue);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto bg-slate-950/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500 flex flex-col font-sans">
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950/50 to-slate-950"></div>
          <div className="absolute inset-0 hud-grid opacity-20"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        
        <div className="relative w-full max-w-5xl flex flex-col items-center">
           {/* Cinematic Border */}
           <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/20 via-transparent to-cyan-500/20 rounded-[2rem] blur-md"></div>
           
           <div className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-8 md:p-16 rounded-[2rem] relative flex flex-col min-h-[60vh] shadow-[0_0_100px_rgba(0,0,0,0.8)]">
              
              {/* Header / Category */}
              <div className="flex justify-between items-start mb-8 md:mb-16 w-full border-b border-white/5 pb-6">
                  <div className="max-w-[70%]">
                      <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                          <Terminal size={14} />
                          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-black text-cyan-500/70">Analytical Stream_01</span>
                      </div>
                      <h2 className="text-xl md:text-3xl font-cinzel font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] leading-tight">{categoryTitle}</h2>
                  </div>
                  <div className="text-right flex items-center space-x-6">
                      <div className="bg-yellow-500/10 border border-yellow-500/20 px-6 py-2 rounded-xl">
                        <div className="text-yellow-400 font-cinzel font-black text-3xl md:text-5xl drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">${clue.value}</div>
                      </div>
                      <button 
                        onClick={onClose}
                        className="p-3 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                        title="Close Question"
                      >
                        <X size={24} />
                      </button>
                  </div>
              </div>

              {/* Clue Content */}
              <div className="flex-grow flex flex-col items-center justify-center py-4 px-4 text-center">
                  <p className="font-cinzel text-2xl sm:text-4xl md:text-6xl text-slate-100 font-black leading-tight tracking-wide drop-shadow-2xl mb-12 max-w-4xl">
                      {clue.clueText}
                  </p>

                  {hint && (
                    <div className="max-w-2xl bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden w-full backdrop-blur-sm">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                        <p className="text-amber-200 text-sm md:text-xl italic font-medium">"{hint}"</p>
                    </div>
                  )}

                  {/* Audio Controls */}
                  <div className="flex items-center gap-6 mt-4">
                      {!hint && (
                         <button 
                            type="button"
                            onClick={handleConsultancy}
                            disabled={isHintLoading}
                            className="flex items-center gap-3 px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 font-black uppercase tracking-[0.2em] text-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                         >
                            <Sparkles size={14} />
                            <span>{isHintLoading ? 'Syncing...' : 'Request Hint'}</span>
                         </button>
                      )}
                      
                      <div className="flex items-center gap-3 bg-slate-950/50 p-1.5 rounded-full border border-white/5">
                        <button 
                          onClick={() => audioBuffer && playAudio(audioBuffer)} 
                          className="p-3 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <RotateCcw size={18} />
                        </button>
                        <button 
                          onClick={togglePlayback} 
                          className="p-4 bg-cyan-500 hover:bg-cyan-400 rounded-full text-black transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95"
                        >
                            {isPlaying && !isPaused ? <Pause size={20} className="fill-current"/> : <Play size={20} className="fill-current ml-0.5"/>}
                        </button>
                      </div>
                  </div>
              </div>

              {/* Input Area */}
              <div className="mt-auto w-full max-w-3xl mx-auto pt-8">
                  <div className="relative flex flex-col items-center">
                      {isListening && (
                          <div className="flex items-end gap-1 h-8 mb-4 animate-in fade-in duration-300">
                              {[...Array(8)].map((_, i) => (
                                  <div key={i} className="w-1.5 bg-cyan-400 rounded-full animate-music-bar shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ animationDelay: `${i * 0.1}s` }}></div>
                              ))}
                          </div>
                      )}
                      <div className="flex w-full items-stretch gap-4">
                          <button 
                              type="button"
                              onClick={toggleListening}
                              className={`px-6 rounded-2xl border transition-all duration-300 flex items-center justify-center ${isListening ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse' : 'bg-slate-800/50 border-white/10 text-cyan-500 hover:bg-cyan-500/10 hover:border-cyan-500/50'}`}
                              title={isListening ? "Stop Neural Link" : "Engage Neural Link"}
                          >
                              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                          </button>
                          
                          <form onSubmit={handleSubmit} className="flex-1 relative group">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
                              <div className="relative flex items-center bg-slate-950 border border-white/10 rounded-2xl overflow-hidden focus-within:border-cyan-500/50 transition-all shadow-inner">
                                  <input
                                      type="text"
                                      autoFocus
                                      value={inputValue}
                                      onChange={(e) => setInputValue(e.target.value)}
                                      className="w-full bg-transparent border-none focus:ring-0 text-xl md:text-3xl font-mono uppercase tracking-widest placeholder:text-slate-800 py-6 px-6 text-center text-cyan-100 selection:bg-cyan-500/30"
                                      placeholder={isListening ? "LISTENING..." : "ENTER RESPONSE..."}
                                      autoComplete="off"
                                  />
                                  <button type="submit" disabled={!inputValue.trim()} className="pr-6 text-cyan-500 hover:text-white disabled:opacity-20 transition-all hover:scale-110 active:scale-95"><Send size={24} /></button>
                              </div>
                          </form>
                      </div>
                      <div className="mt-3 flex items-center gap-2 opacity-50">
                        <Wifi size={10} className="text-cyan-500 animate-pulse" />
                        <span className="text-[10px] text-cyan-500 font-mono tracking-[0.2em] uppercase">{isListening ? 'Voice Uplink: ACTIVE' : 'Voice Uplink: STANDBY'}</span>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClueScreen;