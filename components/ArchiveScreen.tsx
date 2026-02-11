
import React from 'react';
import { MissionHistory } from '../types';
import { ChevronLeft, Database, Award, History, Activity, BarChart2, Sparkles, TrendingUp, Calendar, Zap } from 'lucide-react';

interface ArchiveScreenProps {
  history: MissionHistory[];
  careerScore: number;
  onBack: () => void;
}

const ArchiveScreen: React.FC<ArchiveScreenProps> = ({ history, careerScore, onBack }) => {
  const getRank = (score: number) => {
    if (score > 100000) return { name: "Arch-Physicist", color: "text-purple-400" };
    if (score > 50000) return { name: "Senior Analyst", color: "text-blue-400" };
    if (score > 25000) return { name: "System Operator", color: "text-emerald-400" };
    if (score > 10000) return { name: "Technician", color: "text-yellow-400" };
    return { name: "Cadet Analyst", color: "text-slate-400" };
  };

  const rank = getRank(careerScore);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-2 sm:px-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 md:pb-6 pt-4 md:pt-0">
        <div className="flex items-center space-x-3 md:space-x-4">
          <Database size={20} className="text-cyan-500 md:w-6 md:h-6" />
          <h2 className="text-lg md:text-4xl font-cinzel font-black tracking-[0.1em] md:tracking-[0.2em] text-white uppercase">Neural Archive</h2>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/0 rounded-xl blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
           <div className="bg-slate-900/80 border border-white/10 p-6 rounded-xl relative overflow-hidden backdrop-blur-md h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity"><Award size={64} /></div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Standing</p>
              <p className={`text-xl md:text-2xl font-cinzel font-black uppercase ${rank.color} truncate shadow-glow`}>{rank.name}</p>
           </div>
        </div>

        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/0 rounded-xl blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
           <div className="bg-slate-900/80 border border-white/10 p-6 rounded-xl relative overflow-hidden backdrop-blur-md h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity"><Activity size={64} /></div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Total Yield</p>
              <p className="text-xl md:text-2xl font-mono font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">${careerScore.toLocaleString()}</p>
           </div>
        </div>

        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/0 rounded-xl blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
           <div className="bg-slate-900/80 border border-white/10 p-6 rounded-xl relative overflow-hidden backdrop-blur-md h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity"><History size={64} /></div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Sync Count</p>
              <p className="text-xl md:text-2xl font-mono font-black text-white">{history.length}</p>
           </div>
        </div>

        <div className="relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/0 rounded-xl blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
           <div className="bg-slate-900/80 border border-white/10 p-6 rounded-xl relative overflow-hidden backdrop-blur-md h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity"><TrendingUp size={64} /></div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Max Streak</p>
              <p className="text-xl md:text-2xl font-mono font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                {history.length > 0 ? Math.max(...(history.map(m => m.maxStreak || 0))) : 0}x
              </p>
           </div>
        </div>
      </div>

      {/* History List/Table */}
      <div className="glass-panel rounded-2xl md:rounded-3xl border border-white/5 overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="md:hidden flex flex-col divide-y divide-white/5">
            {history.length === 0 ? (
                <div className="p-12 text-center text-slate-600 font-mono text-[10px] italic uppercase tracking-widest">No mission data.</div>
            ) : (
                history.slice().reverse().map((mission) => (
                    <div key={mission.id} className="p-4 flex flex-col space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-500 font-bold uppercase flex items-center"><Calendar size={10} className="mr-1"/> {mission.date}</span>
                                <span className={`mt-1 inline-block w-fit px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${
                                    mission.difficulty === 'HARD' ? 'bg-purple-500/10 text-purple-400' :
                                    mission.difficulty === 'MEDIUM' ? 'bg-blue-500/10 text-blue-400' :
                                    'bg-emerald-500/10 text-emerald-400'
                                }`}>{mission.difficulty}</span>
                            </div>
                            <div className={`text-right font-mono font-bold text-sm ${mission.score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {mission.score >= 0 ? '+' : ''}{mission.score.toLocaleString()}
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/[0.03]">
                            <div className="flex items-center space-x-3">
                                <div className="flex flex-col">
                                    <span className="text-[7px] text-slate-600 font-black uppercase tracking-tighter">Efficiency</span>
                                    <span className="text-[10px] text-slate-300 font-mono">{mission.efficiency}%</span>
                                </div>
                                <div className="flex flex-col border-l border-white/5 pl-3">
                                    <span className="text-[7px] text-slate-600 font-black uppercase tracking-tighter">Resonance</span>
                                    <span className="text-[10px] text-purple-400 font-mono">{mission.maxStreak || 0}x</span>
                                </div>
                            </div>
                            <Zap size={14} className="text-yellow-500/20" />
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[9px] uppercase tracking-widest text-slate-500 font-black">
                <th className="p-6">Date</th>
                <th className="p-6">Difficulty</th>
                <th className="p-6">Efficiency</th>
                <th className="p-6">Streak</th>
                <th className="p-6 text-right">Data Gain</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-300">
              {history.length > 0 && (
                history.slice().reverse().map((mission) => (
                  <tr key={mission.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 font-mono">{mission.date}</td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                        mission.difficulty === 'HARD' ? 'bg-purple-500/10 text-purple-400' :
                        mission.difficulty === 'MEDIUM' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>{mission.difficulty}</span>
                    </td>
                    <td className="p-6 font-mono">{mission.efficiency}%</td>
                    <td className="p-6 font-mono text-purple-400">{mission.maxStreak || 0}x</td>
                    <td className={`p-6 text-right font-mono font-bold ${mission.score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {mission.score >= 0 ? '+' : ''}{mission.score.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArchiveScreen;
