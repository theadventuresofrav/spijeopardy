import React, { useEffect, useState } from 'react';
import { Module, UserProfile } from '../types';
import { PlayCircle, Terminal, Cpu, Box, GraduationCap, Sparkles, CheckCircle2, Lock, Crown, X } from 'lucide-react';

interface CourseScreenProps {
  modules: Module[];
  profile: UserProfile;
  onSelectTopic: (topicId: string, topicTitle: string) => void;
  onUpgrade?: () => void;
}

const CourseScreen: React.FC<CourseScreenProps> = ({ modules, profile, onSelectTopic, onUpgrade }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalTopics = modules.reduce((acc, m) => acc + m.topics.length, 0);
  const completedCount = profile.completedTopicIds.length;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 md:space-y-16 animate-scan-down pb-24 md:pb-32 px-3 md:px-4 font-sans relative">
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowUpgradeModal(false)}></div>
           <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-8 md:p-12 text-center overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-50 pointer-events-none"></div>
              
              {/* Close Button */}
              <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white">
                <X size={24} />
              </button>

              <Crown size={64} className="mx-auto text-amber-500 mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              
              <h2 className="text-3xl md:text-5xl font-cinzel font-black text-white mb-4">Upgrade to Pro</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Unlock the full SPI Physics curriculum, including advanced modules on Doppler, Artifacts, and Bioeffects.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8 text-left max-w-lg mx-auto">
                 <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <CheckCircle2 size={16} className="text-emerald-500 mb-2" />
                    <div className="text-xs text-slate-300">11 Full Modules</div>
                 </div>
                 <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <CheckCircle2 size={16} className="text-emerald-500 mb-2" />
                    <div className="text-xs text-slate-300">Interactive Visuals</div>
                 </div>
                 <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <CheckCircle2 size={16} className="text-emerald-500 mb-2" />
                    <div className="text-xs text-slate-300">AI Tutor Access</div>
                 </div>
                 <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <CheckCircle2 size={16} className="text-emerald-500 mb-2" />
                    <div className="text-xs text-slate-300">Exam Simulator</div>
                 </div>
              </div>

              <button 
                onClick={() => {
                   onUpgrade?.();
                   setShowUpgradeModal(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black uppercase tracking-[0.2em] rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
              >
                Unlock Lifetime Access ($14.99)
              </button>
              <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">One-time payment • Secure checkout</p>
           </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 pt-4 md:pt-8 relative">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative group">
           <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
           <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-1 md:mb-2 shadow-[0_0_30px_rgba(8,145,178,0.2)] relative z-10">
              <GraduationCap size={32} className="md:w-12 md:h-12" />
           </div>
           {progressPercent === 100 && (
              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-yellow-500 text-black p-1.5 rounded-full animate-bounce shadow-[0_0_20px_rgba(234,179,8,0.5)] z-20">
                 <CheckCircle2 size={14} className="md:w-5 md:h-5" />
              </div>
           )}
        </div>
        
        <div className="space-y-1 md:space-y-2 relative z-10">
           <h2 className="text-[9px] md:text-xs font-black text-cyan-500 tracking-[0.6em] md:tracking-[1em] uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Curriculum Hub</h2>
           <h3 className="text-3xl md:text-8xl font-cinzel font-black text-white uppercase tracking-tighter md:tracking-normal drop-shadow-2xl">SPI Mastery</h3>
           
           {/* Global Progress Bar */}
           <div className="max-w-xs md:max-w-xl mx-auto w-full mt-6 md:mt-10 space-y-2 px-2">
              <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                 <span>Sync Progress</span>
                 <span className="text-cyan-400">{progressPercent}% Mastery</span>
              </div>
              <div className="h-1.5 md:h-2 w-full bg-slate-900/80 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm relative">
                 <div className="absolute inset-0 w-full h-full grid grid-cols-[repeat(50,1fr)] opacity-20 pointer-events-none">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="border-r border-white/20 h-full"></div>
                    ))}
                 </div>
                 <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all duration-1000 relative"
                    style={{ width: `${progressPercent}%` }}
                 >
                    <div className="absolute top-0 right-0 h-full w-1 bg-white/50 blur-[1px]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-12">
        {modules.length === 0 ? (
          <div className="col-span-full py-24 md:py-32 text-center text-slate-500 font-mono text-[10px] md:text-xs uppercase animate-pulse tracking-widest">Establishing Satellite Link...</div>
        ) : (
          modules.map((module, mIdx) => {
            const moduleCompletedCount = module.topics.filter(t => profile.completedTopicIds.includes(t.id)).length;
            const modulePercent = Math.round((moduleCompletedCount / module.topics.length) * 100);
            const isLocked = !profile.isPro && mIdx > 0;

            return (
              <div 
                key={module.id} 
                className={`bg-slate-900/60 backdrop-blur-xl border rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 transition-all group relative overflow-hidden shadow-2xl ${isLocked ? 'border-amber-500/20' : 'border-white/10 hover:border-cyan-500/30'}`}
              >
                {isLocked && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-[2px] transition-all duration-500">
                        <div className="p-6 bg-slate-900 rounded-full border border-amber-500/30 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            <Lock size={32} className="text-amber-500" />
                        </div>
                        <h3 className="text-xl font-cinzel font-black text-white mb-2">PRO MODULE</h3>
                        <p className="text-xs text-slate-400 mb-6 tracking-widest uppercase">Upgrade to Access</p>
                        <button 
                            onClick={() => setShowUpgradeModal(true)}
                            className="px-8 py-3 bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                        >
                            Unlock
                        </button>
                    </div>
                )}

                <div className={`transition-all duration-500 ${isLocked ? 'blur-sm grayscale opacity-20 pointer-events-none' : ''}`}>
                    <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all transform group-hover:scale-110 pointer-events-none duration-700">
                    <Cpu size={150} className="md:w-[250px] md:h-[250px]" />
                    </div>
                    
                    {/* Decorative corner accents */}
                    <div className="absolute top-6 right-6 w-20 h-20 border-t border-r border-white/5 rounded-tr-[2rem] pointer-events-none"></div>
                    <div className="absolute bottom-6 left-6 w-20 h-20 border-b border-l border-white/5 rounded-bl-[2rem] pointer-events-none"></div>

                    <div className="flex items-start justify-between mb-8 md:mb-12 relative z-10">
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-800/50 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10 text-cyan-400 shadow-inner group-hover:text-cyan-300 transition-colors">
                        <Box size={24} className="md:w-8 md:h-8" />
                        </div>
                        <div>
                        <div className="flex items-center space-x-2 md:space-x-3 mb-1">
                            <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">M_0{mIdx + 1}</span>
                            <span className={`text-[7px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${modulePercent === 100 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-white/5'}`}>
                                {modulePercent}% Synced
                            </span>
                        </div>
                        <h4 className="text-xl md:text-3xl font-cinzel font-black text-white tracking-tight group-hover:text-cyan-100 transition-colors">{module.title}</h4>
                        </div>
                    </div>
                    </div>

                    <div className="space-y-3 md:space-y-4 relative z-10">
                    {module.topics.map((topic, tIdx) => {
                        const isCompleted = profile.completedTopicIds.includes(topic.id);
                        return (
                        <button 
                            key={topic.id}
                            onClick={() => onSelectTopic(topic.id, topic.title)}
                            className={`w-full border rounded-xl md:rounded-2xl p-4 md:p-6 text-left transition-all flex items-center group/item relative overflow-hidden
                            ${isCompleted 
                                ? 'bg-emerald-900/10 border-emerald-500/20 hover:bg-emerald-900/20' 
                                : 'bg-black/20 border-white/5 hover:border-cyan-500/40 hover:bg-white/5'
                            }`}
                        >
                            {/* Hover glow effect */}
                            <div className={`absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${isCompleted ? 'from-emerald-500/5' : 'from-cyan-500/5'} to-transparent`}></div>

                            <div className="flex-1 min-w-0 pr-4 md:pr-6 relative z-10">
                            <div className="flex items-center space-x-2 mb-1">
                                <span className={`text-[8px] font-black uppercase font-mono tracking-wider ${isCompleted ? 'text-emerald-500/70' : 'text-slate-600'}`}>T_{tIdx+1}</span>
                                {isCompleted && <span className="text-emerald-500"><CheckCircle2 size={12}/></span>}
                            </div>
                            <h5 className={`text-sm md:text-lg font-bold transition-colors truncate ${isCompleted ? 'text-emerald-100' : 'text-slate-200 group-hover/item:text-cyan-200'}`}>{topic.title}</h5>
                            <p className="text-[9px] md:text-[11px] text-slate-500 line-clamp-1 uppercase tracking-wider mt-0.5 group-hover/item:text-slate-400 transition-colors">{topic.description}</p>
                            </div>
                            
                            <div className={`relative z-10 p-2 md:p-3 rounded-xl transition-all duration-300 ${
                            isCompleted 
                                ? 'text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                : 'text-slate-600 bg-white/5 group-hover/item:text-cyan-400 group-hover/item:bg-cyan-500/20 group-hover/item:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                            }`}>
                            <PlayCircle size={22} className="md:w-6 md:h-6" />
                            </div>
                        </button>
                        );
                    })}
                    </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CourseScreen;