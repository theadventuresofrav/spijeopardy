
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { startStudyBuddyChat } from '../services/geminiService';
import { Send, Mic, MicOff, BookOpen, Terminal, Sparkles, User, Brain, HeartPulse } from 'lucide-react';
import { playSfx } from '../services/soundEffects';

interface StudyBuddyScreenProps {
  playerName: string;
  onSpeak: (text: string) => void;
}

const StudyBuddyScreen: React.FC<StudyBuddyScreenProps> = ({ playerName, onSpeak }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Good day to you, ${playerName}. I am Professor Harvey. How may I assist your SPI studies today? We might discuss Doppler effects, transducer physics, or perhaps the curiosities of acoustic impedance?` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const SUGGESTED_TOPICS = [
    "Explain Aliasing",
    "Quiz me on Artifacts",
    "Mnemonic for Resolution",
    "Doppler Shift Formula",
    "Explain Snell's Law"
  ];

  useEffect(() => {
    chatRef.current = startStudyBuddyChat('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInputValue(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const textToSend = textOverride || inputValue.trim();
    if (!textToSend || isLoading) return;

    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);
    playSfx('submit');

    try {
      const result = await chatRef.current.sendMessage({ message: textToSend });
      const modelText = result.text;
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
      onSpeak(modelText);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Forgive me, dear student, my neural link seems to have flickered. Shall we try that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      playSfx('click');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[80vh] flex flex-col relative group">
      {/* Cinematic Border & Glow */}
      <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/20 via-purple-500/20 to-cyan-500/20 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
      
      <div className="relative flex-1 flex flex-col bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Background Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-amber-900/10 to-transparent flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20 rounded-full animate-pulse"></div>
              <div className="w-14 h-14 rounded-2xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 relative z-10 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                 <HeartPulse size={28} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
            </div>
            <div>
               <h3 className="font-cinzel font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 text-lg drop-shadow-sm">Professor Harvey</h3>
               <div className="flex items-center space-x-2 mt-1">
                 <span className="text-[10px] text-amber-500/60 font-mono uppercase tracking-widest border border-amber-500/20 px-1.5 py-0.5 rounded">AI Tutor v4.2</span>
                 <span className="text-[10px] text-emerald-400/80 font-mono uppercase tracking-widest flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                    Online
                 </span>
               </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-amber-500/30">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Connection</span>
                <div className="flex space-x-0.5 mt-1">
                   <div className="w-1 h-3 bg-amber-500/80 rounded-sm"></div>
                   <div className="w-1 h-3 bg-amber-500/80 rounded-sm"></div>
                   <div className="w-1 h-3 bg-amber-500/60 rounded-sm"></div>
                   <div className="w-1 h-3 bg-amber-500/40 rounded-sm"></div>
                </div>
             </div>
             <div className="h-8 w-px bg-white/10"></div>
             <Brain size={24} className="opacity-50" />
          </div>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10"
        >
          {messages.map((m, i) => (
            <div 
              key={i} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}
            >
              <div className={`max-w-[85%] flex space-x-4 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                {/* Avatar Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-lg backdrop-blur-md ${m.role === 'user' ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-400' : 'bg-amber-950/30 border-amber-500/30 text-amber-400'}`}>
                  {m.role === 'user' ? <User size={20}/> : <HeartPulse size={20}/>}
                </div>
                
                {/* Message Bubble */}
                <div className="flex flex-col">
                    <span className={`text-[10px] font-mono uppercase tracking-wider mb-1 opacity-50 ${m.role === 'user' ? 'text-right text-cyan-300' : 'text-left text-amber-300'}`}>
                        {m.role === 'user' ? 'Cadet Input' : 'System Response'}
                    </span>
                    <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm border ${
                        m.role === 'user' 
                        ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/20 text-cyan-50 rounded-tr-none' 
                        : 'bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-500/20 text-amber-50 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="bg-amber-950/30 border border-amber-500/20 p-4 rounded-2xl rounded-tl-none flex items-center space-x-3 ml-14 backdrop-blur-sm">
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce delay-150"></div>
                </div>
                <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest animate-pulse">Processing Query...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Topics Chips */}
        <div className="px-6 pb-4 flex flex-wrap gap-2 justify-center relative z-10">
          {SUGGESTED_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(undefined, topic)}
              className="group px-4 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-[10px] text-amber-400/80 font-mono font-bold uppercase tracking-wide hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-300 hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity">Wait</span>
              {topic}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-xl relative z-10">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
            <button 
              type="button"
              onClick={toggleListening}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                  isListening 
                  ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                  : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-white/10'
              }`}
            >
              {isListening ? <MicOff size={20}/> : <Mic size={20}/>}
            </button>
            
            <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-purple-500/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
              <input 
                type="text" 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Enter query or voice command..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-4 px-6 text-sm text-white placeholder:text-slate-600 outline-none focus:border-amber-500/50 focus:bg-slate-900 transition-all shadow-inner relative z-10 font-mono"
              />
            </div>
            
            <button 
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 active:scale-95 border border-white/10"
            >
              <Send size={20}/>
            </button>
          </form>
          
          <div className="mt-4 flex items-center justify-between text-[9px] text-slate-600 font-mono uppercase tracking-widest px-2">
             <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-1.5"><Sparkles size={10} className="text-amber-500/40"/> <span>Socratic AI Engine</span></div>
                 <div className="flex items-center space-x-1.5"><Terminal size={10} className="text-amber-500/40"/> <span>v4.2.0 Stable</span></div>
             </div>
             <div className="text-amber-900/40">SECURE UPLINK ESTABLISHED</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyBuddyScreen;
