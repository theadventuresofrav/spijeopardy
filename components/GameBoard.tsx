import React, { useEffect, useState } from 'react';
import { GameBoardData } from '../types';
import { playSfx } from '../services/soundEffects';
import { Lock, Sparkles, ChevronRight, ChevronLeft, Scan, Hash } from 'lucide-react';

interface GameBoardProps {
  data: GameBoardData;
  onClueClick: (categoryIndex: number, clueIndex: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ data, onClueClick }) => {
  const [revealedCategories, setRevealedCategories] = useState<number[]>([]);
  const [hoveredClue, setHoveredClue] = useState<{c: number, r: number} | null>(null);
  
  useEffect(() => {
    // Staggered reveal of categories
    data.categories.forEach((_, idx) => {
      setTimeout(() => {
        setRevealedCategories(prev => [...prev, idx]);
        if (idx % 2 === 0) playSfx('click');
      }, idx * 100);
    });
  }, [data.categories]);

  const handleClueClick = (catIndex: number, rowIndex: number) => {
    onClueClick(catIndex, rowIndex);
  };

  return (
    <div className="w-full max-w-7xl mx-auto relative group">
       {/* Cinematic Border Frame */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
      
      <div className="w-full bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl overflow-hidden relative shadow-2xl">
        {/* Decorative Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg z-20"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg z-20"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg z-20"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg z-20"></div>

        {/* Background Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        
        <div className="overflow-x-auto overflow-y-hidden custom-scrollbar snap-x snap-mandatory relative z-10">
          <div className="min-w-[600px] sm:min-w-[800px] md:min-w-0">
            {/* Categories Header */}
            <div className="grid grid-cols-6 gap-[1px] bg-white/5 border-b border-white/10">
              {data.categories.map((cat, idx) => {
                const isRevealed = revealedCategories.includes(idx);
                return (
                  <div 
                    key={cat.id} 
                    className={`
                      bg-slate-900/90 aspect-[4/3] md:aspect-[21/9] flex flex-col items-center justify-center p-2 md:p-4 text-center group/cat transition-all duration-700 
                      relative overflow-hidden snap-center
                      ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}
                    `}
                  >
                    {/* Header Scanline */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover/cat:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="mb-1 md:mb-2 opacity-50 group-hover/cat:opacity-100 transition-opacity">
                       <Hash className="w-3 h-3 md:w-4 md:h-4 text-cyan-500/40" />
                    </div>

                    <span className="text-cyan-100/90 font-cinzel font-black uppercase tracking-[0.05em] md:tracking-[0.15em] leading-tight text-[8px] xs:text-[10px] sm:text-xs md:text-sm drop-shadow-md group-hover/cat:text-cyan-300 transition-colors duration-300 w-full px-1 line-clamp-3 relative z-10">
                      {cat.title}
                    </span>
                    
                    {/* Tech Decorations */}
                    <div className="absolute bottom-1 right-1 flex space-x-0.5 opacity-30">
                       <div className="w-0.5 h-0.5 bg-cyan-500 rounded-full"></div>
                       <div className="w-0.5 h-0.5 bg-cyan-500 rounded-full"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clues Grid */}
            <div className="grid grid-cols-6 gap-[1px] bg-white/5">
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  {data.categories.map((cat, catIndex) => {
                    const clue = cat.clues[rowIndex];
                    const isCatRevealed = revealedCategories.includes(catIndex);
                    const isHovered = hoveredClue?.c === catIndex && hoveredClue?.r === rowIndex;
                    
                    return (
                      <button
                        key={clue.id}
                        disabled={clue.isAnswered || !isCatRevealed}
                        onClick={() => handleClueClick(catIndex, rowIndex)}
                        onMouseEnter={() => setHoveredClue({c: catIndex, r: rowIndex})}
                        onMouseLeave={() => setHoveredClue(null)}
                        style={{ transitionDelay: `${(rowIndex * 50) + (catIndex * 30)}ms` }}
                        className={`
                          w-full aspect-[4/3] md:aspect-[16/9] flex flex-col items-center justify-center snap-center
                          text-lg sm:text-2xl md:text-4xl lg:text-5xl font-cinzel font-black
                          transition-all duration-500 relative overflow-hidden group backdrop-blur-sm
                          ${!isCatRevealed ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}
                          ${clue.isAnswered 
                            ? 'bg-slate-950/60 cursor-default' 
                            : 'bg-slate-900/20 hover:bg-cyan-950/30 cursor-pointer'
                          }
                        `}
                      >
                        {!clue.isAnswered ? (
                          <>
                            {/* Interactive Hover Effects */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}></div>
                            <div className={`absolute inset-0 border border-cyan-500/30 scale-95 opacity-0 transition-all duration-300 ${isHovered ? 'scale-100 opacity-100' : ''}`}></div>
                            
                            {/* Value Display */}
                            <div className="relative z-10 flex flex-col items-center transform transition-transform duration-300 group-hover:scale-110">
                              <span className={`text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-lg transition-all duration-300 ${isHovered ? 'from-cyan-200 to-cyan-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]' : ''}`}>
                                ${clue.value}
                              </span>
                            </div>

                            {/* Scanline Effect on Hover */}
                            {isHovered && (
                               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-[200%] w-full animate-scanline pointer-events-none"></div>
                            )}
                          </>
                        ) : (
                          /* Answered State */
                          <div className={`flex flex-col items-center space-y-2 ${clue.isCorrect ? 'opacity-50' : 'opacity-30'}`}>
                            {clue.isCorrect ? (
                               <div className="relative">
                                 <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20"></div>
                                 <Sparkles className="w-6 h-6 md:w-10 md:h-10 text-emerald-400" />
                               </div>
                            ) : (
                               <Lock className="w-6 h-6 md:w-10 md:h-10 text-slate-700" />
                            )}
                            <div className="flex items-center space-x-1">
                               <div className={`w-1 h-1 rounded-full ${clue.isCorrect ? 'bg-emerald-500' : 'bg-red-900'}`}></div>
                               <span className="text-[6px] md:text-[8px] font-mono tracking-[0.2em] text-slate-500 uppercase font-bold">
                                 {clue.isCorrect ? 'DATA_SECURED' : 'ACCESS_DENIED'}
                               </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Corner Marker */}
                        <div className="absolute top-2 left-2 w-1 h-1 bg-white/10 rounded-full group-hover:bg-cyan-500/50 transition-colors"></div>
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Hint */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950/95 border-t border-white/5 backdrop-blur-xl">
           <div className="flex items-center space-x-2 text-slate-500">
              <Scan className="w-3 h-3" />
              <span className="text-[9px] font-black tracking-widest uppercase">Grid Navigation</span>
           </div>
           <div className="flex items-center space-x-1.5 animate-pulse">
              <span className="text-[9px] text-cyan-500 font-black tracking-widest uppercase">Swipe</span>
              <ChevronRight className="w-3 h-3 text-cyan-400" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;