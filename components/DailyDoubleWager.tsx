
import React, { useState } from 'react';
import { Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { playSfx } from '../services/soundEffects';

interface DailyDoubleWagerProps {
  currentScore: number;
  categoryTitle: string;
  onWagerConfirm: (wager: number) => void;
}

const DailyDoubleWager: React.FC<DailyDoubleWagerProps> = ({ currentScore, categoryTitle, onWagerConfirm }) => {
  const minWager = 5;
  const maxWager = Math.max(currentScore, 1000); 
  const [wager, setWager] = useState(Math.min(maxWager, 500));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSfx('start');
    onWagerConfirm(wager);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030305]/95 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="hud-grid absolute inset-0 opacity-10"></div>
      
      <div className="relative w-full max-w-2xl mx-auto tech-border-container p-0.5 rounded-3xl animate-in zoom-in-95 duration-500">
        <div className="tech-corner tl accent-yellow"></div>
        <div className="tech-corner tr accent-yellow"></div>
        <div className="tech-corner bl accent-yellow"></div>
        <div className="tech-corner br accent-yellow"></div>

        <div className="bg-slate-950/80 p-8 md:p-16 rounded-3xl border border-yellow-500/20 shadow-[0_0_80px_rgba(234,179,8,0.2)] flex flex-col items-center text-center">
          <div className="mb-8 p-4 bg-yellow-500/10 rounded-full animate-pulse-ring">
            <Zap className="text-yellow-500 w-12 h-12" strokeWidth={2} />
          </div>

          <h2 className="text-3xl md:text-5xl font-cinzel font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-50 via-yellow-400 to-yellow-600 tracking-wider mb-4 uppercase">DAILY DOUBLE</h2>
          
          <div className="mb-10 text-slate-400">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase mb-2">Sector Detected</p>
            <p className="text-xl md:text-2xl font-cinzel text-white uppercase tracking-widest">{categoryTitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-8">
            <div className="space-y-4">
               <div className="flex justify-between text-[10px] font-black tracking-widest text-slate-600 uppercase">
                  <span>Min: ${minWager}</span>
                  <span>Max: ${maxWager.toLocaleString()}</span>
               </div>
               
               <input type="range" min={minWager} max={maxWager} value={wager} onChange={(e) => setWager(parseInt(e.target.value))} className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-yellow-500" />

               <div className="relative group">
                  <input 
                    type="number"
                    autoFocus
                    value={wager}
                    onChange={(e) => setWager(Math.min(Math.max(parseInt(e.target.value) || 0, minWager), maxWager))}
                    className="relative w-full bg-slate-950 border border-yellow-500/30 rounded-xl py-4 md:py-6 text-3xl md:text-5xl font-mono text-center text-yellow-100 outline-none focus:border-yellow-500 transition-all shadow-2xl"
                  />
               </div>
            </div>

            <button type="submit" className="w-full py-4 md:py-6 bg-yellow-600/10 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-200 font-black rounded-xl md:rounded-2xl transition-all tracking-[0.4em] uppercase text-xs md:text-lg active:scale-95 group flex items-center justify-center space-x-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <span>Transmit Wager</span>
              <TrendingUp size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-[8px] md:text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              <AlertCircle size={12} />
              <span>Standard Resonance Betting Rules Applied</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DailyDoubleWager;
