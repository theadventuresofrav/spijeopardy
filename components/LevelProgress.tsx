import React from 'react';
import { calculateLevel } from '../utils/gamification';
import { Trophy, Star } from 'lucide-react';

interface LevelProgressProps {
  xp: number;
  compact?: boolean;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ xp, compact = false }) => {
  const { currentLevel, nextLevel, progress } = calculateLevel(xp);

  if (compact) {
    return (
      <div className="flex flex-col w-full max-w-[150px]">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold tracking-wider">
          <span>LVL {currentLevel.level}</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 relative overflow-hidden group">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] relative group-hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md animate-pulse"></div>
          <span className="text-2xl md:text-3xl font-black text-cyan-100 font-cinzel relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{currentLevel.level}</span>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-cyan-500/30 px-3 py-0.5 rounded-full text-[9px] font-black text-cyan-400 uppercase whitespace-nowrap shadow-lg tracking-widest z-20">
          {currentLevel.title}
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-[0.2em] font-bold">Current Rank</span>
            <span className="text-sm md:text-base text-white font-black tracking-wide">{currentLevel.title}</span>
          </div>
          <div className="text-right">
             <span className="text-sm md:text-base text-cyan-400 font-black font-mono tracking-tighter shadow-cyan-500/50 drop-shadow-sm">{Math.floor(xp).toLocaleString()} XP</span>
             <span className="text-[9px] md:text-[10px] text-slate-500 block uppercase tracking-widest mt-0.5">Target: {nextLevel.xpRequired.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="h-3 md:h-4 w-full bg-slate-900/80 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
          <div className="absolute inset-0 w-full h-full grid grid-cols-[repeat(20,1fr)] opacity-10 pointer-events-none z-10">
              {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="border-r border-white/30 h-full"></div>
              ))}
          </div>
          <div 
            className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(34,211,238,0.5)] relative"
            style={{ width: `${progress}%` }}
          >
             <div className="absolute top-0 right-0 h-full w-0.5 bg-white/80 blur-[0.5px]"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
