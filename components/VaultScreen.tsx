
import React, { useState } from 'react';
import { MissionHistory, TranscribedInteraction } from '../types';
import { BookOpen, ChevronRight, Microscope, Terminal, HeartPulse, Search, Info, CheckCircle } from 'lucide-react';

interface VaultScreenProps {
  history: MissionHistory[];
  onBack: () => void;
}

const VaultScreen: React.FC<VaultScreenProps> = ({ history, onBack }) => {
  const [selectedMission, setSelectedMission] = useState<MissionHistory | null>(history[history.length - 1] || null);
  const [searchTerm, setSearchTerm] = useState('');

  const lessons = selectedMission?.lessons || [];
  const filteredLessons = lessons.filter(l => 
    l.clueText.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.correctAnswer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 animate-in fade-in duration-700 h-[80vh]">
      {/* Mission Sidebar */}
      <div className="w-full md:w-80 flex flex-col overflow-hidden">
        <div className="tech-border-container p-0.5 rounded-3xl h-full flex flex-col bg-slate-950/80">
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center space-x-3">
            <Terminal size={18} className="text-cyan-400" />
            <h2 className="font-cinzel font-black uppercase tracking-widest text-sm text-white">Session Logs</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {history.length === 0 ? (
                <div className="text-center py-12 text-slate-700 text-xs italic">No scripts vaulted.</div>
            ) : (
                history.slice().reverse().map(m => (
                <button 
                    key={m.id} 
                    onClick={() => setSelectedMission(m)}
                    className={`w-full p-4 rounded-xl text-left border transition-all relative overflow-hidden group ${selectedMission?.id === m.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                    {selectedMission?.id === m.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>}
                    <div className="text-[10px] text-slate-500 mb-1 font-mono">{m.date}</div>
                    <div className={`text-xs font-black uppercase tracking-wider ${selectedMission?.id === m.id ? 'text-cyan-100' : 'text-slate-400 group-hover:text-white'}`}>{m.difficulty} Session</div>
                    <div className="text-[9px] text-cyan-400 font-mono mt-1">${m.score.toLocaleString()} accumulated</div>
                </button>
                ))
            )}
            </div>
        </div>
      </div>

      {/* Script Review Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="tech-border-container p-0.5 rounded-3xl h-full flex flex-col bg-slate-950/80 backdrop-blur-3xl relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            
            <div className="relative z-10 p-6 border-b border-white/10 bg-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <BookOpen size={24} className="text-yellow-400" />
                </div>
                <div>
                <h3 className="font-cinzel font-black uppercase tracking-[0.2em] text-lg text-white">Script Vault</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Reviewing data: {selectedMission?.date || 'N/A'}</p>
                </div>
            </div>
            <div className="relative w-full md:w-72 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-yellow-400 transition-colors" size={14} />
                <input 
                type="text" 
                placeholder="SEARCH ARCHIVES..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-yellow-500/50 focus:bg-black/60 transition-all font-mono uppercase placeholder:text-slate-700"
                />
            </div>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {filteredLessons.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-30">
                <Info size={64} className="mb-6 text-slate-500" />
                <p className="font-cinzel text-lg uppercase tracking-[0.3em] text-slate-500">No Data Found</p>
                </div>
            ) : (
                filteredLessons.map((l, i) => (
                <div key={i} className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-8 border-b border-white/5 last:border-0" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-start justify-between">
                    <div className="flex-1 pr-8">
                        <div className="flex items-center space-x-3 mb-2">
                            <span className="text-[9px] text-yellow-500 font-black uppercase tracking-widest px-2 py-1 bg-yellow-500/10 rounded">Inquiry {i + 1}</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${l.isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {l.isCorrect ? 'Validated' : 'Rejected'}
                            </span>
                        </div>
                        <p className="text-lg md:text-xl font-cinzel text-white leading-relaxed">{l.clueText}</p>
                    </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-cyan-950/20 border border-cyan-500/20 p-5 rounded-2xl relative group hover:bg-cyan-950/30 transition-colors">
                        <div className="flex items-center space-x-2 text-cyan-400 mb-3 opacity-70 group-hover:opacity-100"><Terminal size={14}/> <span className="text-[9px] font-black uppercase tracking-widest">Echo.OS</span></div>
                        <p className="text-xs text-cyan-100/80 italic leading-relaxed font-mono">"{l.scripts.echo}"</p>
                    </div>
                    <div className="bg-red-950/20 border border-red-500/20 p-5 rounded-2xl relative group hover:bg-red-950/30 transition-colors">
                        <div className="flex items-center space-x-2 text-red-400 mb-3 opacity-70 group-hover:opacity-100"><Microscope size={14}/> <span className="text-[9px] font-black uppercase tracking-widest">Dr. Hertz</span></div>
                        <p className="text-xs text-red-100/80 italic leading-relaxed font-serif">"{l.scripts.hertz}"</p>
                    </div>
                    <div className="bg-amber-950/20 border border-amber-500/20 p-5 rounded-2xl relative group hover:bg-amber-950/30 transition-colors">
                        <div className="flex items-center space-x-2 text-amber-400 mb-3 opacity-70 group-hover:opacity-100"><HeartPulse size={14}/> <span className="text-[9px] font-black uppercase tracking-widest">Prof. Harvey</span></div>
                        <p className="text-xs text-amber-100/80 italic leading-relaxed font-medium">"{l.scripts.harvey}"</p>
                    </div>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between group hover:bg-emerald-500/10 transition-colors cursor-default">
                    <div className="flex items-center space-x-3">
                        <CheckCircle size={16} className="text-emerald-500" />
                        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Verified Answer Matrix:</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-100 group-hover:text-white transition-colors">{l.correctAnswer}</span>
                    </div>
                </div>
                ))
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VaultScreen;
