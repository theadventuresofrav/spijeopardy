
import React, { useEffect, useState, useMemo } from 'react';
import { Activity, Sparkles, Zap, Brain, BrainCircuit, Database, Radio, Cpu, Workflow, BarChart2, BookOpen, Shield } from 'lucide-react';

interface HostAvatarProps {
  mood: 'neutral' | 'speaking' | 'thinking' | 'happy' | 'sassy';
  careerScore?: number;
  variant?: 'header' | 'hero';
  type?: 'echo' | 'hertz' | 'harvey' | 'polis';
}

const SUB_ROUTINES = [
  "DOPPLER_VECTOR_STABLE",
  "PIEZO_DRIVE_ACTIVE",
  "RESISTANCE_OHM_CALC",
  "NYQUIST_LIMIT_SET",
  "ALIAISING_COMPENSATED",
  "CAVITATION_SAFETY_ON",
  "ATTENUATION_COEFF_FIX",
  "HOLOGRAPHIC_OS_V4"
];

const HostAvatar: React.FC<HostAvatarProps> = ({ mood, careerScore = 0, variant = 'header', type }) => {
  const [pulse, setPulse] = useState(false);
  const [glitchTrigger, setGlitchTrigger] = useState(false);
  const [activeRoutine, setActiveRoutine] = useState(0);
  const [neuralLinks, setNeuralLinks] = useState<{x1: number, y1: number, x2: number, y2: number}[]>([]);

  const isHero = variant === 'hero';

  // Routine cycling
  useEffect(() => {
    const int = setInterval(() => {
      setActiveRoutine(p => (p + 1) % SUB_ROUTINES.length);
    }, 4000);
    return () => clearInterval(int);
  }, []);

  // Neural web animation
  useEffect(() => {
    const generateLinks = () => {
      const links = Array.from({ length: isHero ? 16 : 8 }).map(() => ({
        x1: Math.random() * 100,
        y1: Math.random() * 100,
        x2: Math.random() * 100,
        y2: Math.random() * 100
      }));
      setNeuralLinks(links);
    };
    generateLinks();
    const int = setInterval(generateLinks, isHero ? 3000 : 5000);
    return () => clearInterval(int);
  }, [isHero]);

  useEffect(() => {
    if (mood === 'speaking') {
      const interval = setInterval(() => setPulse((p) => !p), 150);
      return () => clearInterval(interval);
    } else {
      setPulse(false);
    }
  }, [mood]);

  useEffect(() => {
    const trigger = () => {
      setGlitchTrigger(true);
      setTimeout(() => setGlitchTrigger(false), 150);
    };
    const timer = setInterval(() => { if (Math.random() > 0.85) trigger(); }, 2500);
    return () => clearInterval(timer);
  }, []);

  const botLevel = useMemo(() => {
    if (careerScore > 100000) return { title: "OMEGA", level: 5, color: "text-purple-400", hex: "#a855f7" };
    if (careerScore > 50000) return { title: "PRIME", level: 4, color: "text-blue-400", hex: "#60a5fa" };
    if (careerScore > 25000) return { title: "ALPHA", level: 3, color: "text-cyan-400", hex: "#22d3ee" };
    if (careerScore > 10000) return { title: "BETA", level: 2, color: "text-emerald-400", hex: "#34d399" };
    return { title: "CORE", level: 1, color: "text-slate-400", hex: "#94a3b8" };
  }, [careerScore]);

  const getStyles = () => {
    const iconSize = isHero ? "w-16 h-16 md:w-32 md:h-32" : "w-6 h-6 md:w-14 md:h-14";
    const iconClass = `${iconSize} transition-all duration-300`; 

    if (type === 'hertz') {
       return {
          icon: <Zap className={`${iconClass} text-purple-100`} />,
          ringColor: 'border-purple-500', glowColor: 'bg-purple-500',
          shadow: 'shadow-[0_0_60px_rgba(168,85,247,0.5)]', status: 'HERTZ_OS'
       };
    }
    if (type === 'harvey') {
       return {
          icon: <BookOpen className={`${iconClass} text-amber-100`} />,
          ringColor: 'border-amber-500', glowColor: 'bg-amber-500',
          shadow: 'shadow-[0_0_60px_rgba(245,158,11,0.5)]', status: 'HARVEY_MENTOR'
       };
    }
    if (type === 'polis') {
       return {
          icon: <Shield className={`${iconClass} text-emerald-100`} />,
          ringColor: 'border-emerald-500', glowColor: 'bg-emerald-500',
          shadow: 'shadow-[0_0_60px_rgba(16,185,129,0.5)]', status: 'POLIS_GUARDIAN'
       };
    }

    switch (mood) {
      case 'happy': 
        return {
          icon: <Sparkles className={`${iconClass} text-yellow-100 scale-125`} />,
          ringColor: 'border-yellow-400', glowColor: 'bg-yellow-400',
          shadow: isHero ? 'shadow-[0_0_100px_rgba(234,179,8,0.8)]' : 'shadow-[0_0_60px_rgba(234,179,8,0.7)]', status: 'SYNCHRONIZED'
        };
      case 'sassy': 
        return {
          icon: <Zap className={`${iconClass} text-red-100 animate-pulse`} />,
          ringColor: 'border-red-500', glowColor: 'bg-red-500',
          shadow: isHero ? 'shadow-[0_0_100px_rgba(239,68,68,0.8)]' : 'shadow-[0_0_60px_rgba(239,68,68,0.7)]', status: 'OVERLOAD'
        };
      case 'thinking': 
        return {
          icon: <Workflow className={`${iconClass} text-yellow-300 animate-spin-slow`} />,
          ringColor: 'border-yellow-500/50', glowColor: 'bg-yellow-500',
          shadow: isHero ? 'shadow-[0_0_80px_rgba(234,179,8,0.5)]' : 'shadow-[0_0_40px_rgba(234,179,8,0.4)]', status: 'ANALYZING'
        };
      case 'speaking': 
        return {
          icon: <Activity className={`${iconClass} text-cyan-50`} />,
          ringColor: 'border-cyan-400', glowColor: 'bg-cyan-400',
          shadow: isHero ? 'shadow-[0_0_100px_rgba(34,211,238,0.6)]' : 'shadow-[0_0_50px_rgba(34,211,238,0.5)]', status: 'UPLINK_LIVE'
        };
      default:
        return {
          icon: <Brain className={`${iconClass} text-slate-100/90`} />,
          ringColor: 'border-slate-600/50', glowColor: 'bg-slate-400',
          shadow: isHero ? 'shadow-[0_0_50px_rgba(148,163,184,0.4)]' : 'shadow-[0_0_20px_rgba(148,163,184,0.2)]', status: 'THE_GUIDE'
        };
    }
  };

  const styles = getStyles();
  const containerSize = isHero ? "w-48 h-48 md:w-80 md:h-80" : "w-24 h-24 md:w-36 md:h-36";

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="bot-glitch-heavy">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.2" numOctaves="2" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={glitchTrigger ? (isHero ? "40" : "20") : "0"} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      
      <div className={`flex ${isHero ? 'flex-col space-y-8 items-center' : 'items-center space-x-8'}`}>
        <div className={`relative ${containerSize} flex items-center justify-center group select-none transition-transform duration-500 hover:scale-105`}>
           
           {/* Dynamic Neural Web Background */}
           <svg className={`absolute inset-0 w-full h-full ${isHero ? 'opacity-20' : 'opacity-10'} pointer-events-none`}>
              {neuralLinks.map((link, i) => (
                <line key={i} x1={`${link.x1}%`} y1={`${link.y1}%`} x2={`${link.x2}%`} y2={`${link.y2}%`} stroke={botLevel.hex} strokeWidth={isHero ? "1" : "0.5"} className="animate-pulse">
                  <animate attributeName="stroke-dasharray" from="0, 100" to="100, 0" dur="3s" repeatCount="indefinite" />
                </line>
              ))}
           </svg>

           {/* Progress Ring */}
           <div className={`absolute inset-0 rounded-full border border-white/5 bg-slate-900/40 backdrop-blur-sm shadow-2xl`}></div>
           <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle cx="50%" cy="50%" r="46%" className={`fill-none stroke-current opacity-10`} strokeWidth="1" strokeDasharray="4 2" />
             <circle 
                cx="50%" cy="50%" r="46%" 
                className={`fill-none stroke-current transition-all duration-1000 ${botLevel.color}`}
                strokeWidth={isHero ? "8" : "5"}
                strokeDasharray="289.02"
                strokeDashoffset={289.02 - (289.02 * (careerScore % 10000) / 10000)}
                strokeLinecap="round"
             />
           </svg>

           {/* Core Glow */}
           <div className={`absolute inset-0 m-auto ${isHero ? 'w-32 h-32 md:w-56 md:h-56' : 'w-16 h-16 md:w-24 md:h-24'} rounded-full ${styles.glowColor} opacity-20 blur-3xl transition-all duration-500 ${pulse ? 'scale-150 opacity-50' : 'scale-100'} ${styles.shadow}`}></div>

           {/* Bot Icon Matrix */}
           <div 
             className={`relative z-10 transition-all duration-500 ${pulse ? 'scale-110' : 'scale-100'} ${mood === 'sassy' ? 'animate-shake-red' : ''}`}
             style={{ filter: 'url(#bot-glitch-heavy)' }}
           >
              {styles.icon}
           </div>

           {/* Orbiting Elements */}
           <div className={`absolute inset-0 border-2 border-dashed border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none`}></div>
           <div className={`absolute inset-4 border border-dotted border-white/10 rounded-full animate-[spin_30s_linear_infinite_reverse] pointer-events-none`}></div>
           
           {/* Level Indicator Overlay */}
           <div className={`absolute ${isHero ? '-bottom-4 right-0' : '-bottom-2 -right-2'} bg-slate-950/90 border border-white/20 backdrop-blur-xl rounded-xl px-4 py-2 flex flex-col items-center shadow-2xl z-20`}>
              <span className={`${isHero ? 'text-[12px]' : 'text-[9px]'} font-black tracking-widest ${botLevel.color}`}>{botLevel.title}</span>
              <div className="flex space-x-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`${isHero ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'} rounded-full ${i < botLevel.level ? botLevel.color.replace('text', 'bg') : 'bg-slate-800'}`}></div>
                ))}
              </div>
           </div>
        </div>

        {/* Real-time Status Readout */}
        <div className={`${isHero ? 'flex flex-col items-center space-y-4' : 'hidden xl:flex flex-col justify-center space-y-2'} font-mono`}>
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${mood === 'neutral' ? 'bg-slate-700' : 'bg-cyan-500 animate-ping'}`}></div>
            <span className={`${isHero ? 'text-sm' : 'text-[11px]'} font-black text-slate-500 uppercase tracking-widest`}>GUIDE_REASONING_CORE</span>
          </div>
          
          <div className={`bg-black/40 border border-white/5 rounded-lg px-4 py-3 ${isHero ? 'min-w-[300px]' : 'min-w-[200px]'} relative overflow-hidden group`}>
             <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-50"></div>
             <div className={`${isHero ? 'text-sm' : 'text-[12px]'} font-bold text-cyan-500 uppercase tracking-wider mb-1`}>{styles.status}</div>
             <div className={`${isHero ? 'text-[11px]' : 'text-[9px]'} text-slate-500 truncate`}>{SUB_ROUTINES[activeRoutine]}</div>
             <div className="mt-2 flex items-center justify-between">
                <div className="flex space-x-0.5">
                   {[...Array(8)].map((_, i) => (
                      <div key={i} className={`w-3 h-1 rounded-full ${i <= activeRoutine ? 'bg-cyan-500/50' : 'bg-slate-800'}`}></div>
                   ))}
                </div>
                <span className="text-[8px] text-slate-700 font-bold">STABILITY: 99.4%</span>
             </div>
          </div>

          {!isHero && (
            <div className="flex space-x-6 px-1">
              <div className="flex items-center space-x-1.5 text-[9px] font-black text-slate-600 uppercase">
                <Cpu size={12} className="text-purple-500"/> <span>LOAD: {(Math.random() * 15 + 2).toFixed(1)}%</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[9px] font-black text-slate-600 uppercase">
                <BarChart2 size={12} className="text-emerald-500"/> <span>RESONANCE: {careerScore > 0 ? "HIGH" : "CALIBRATING"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HostAvatar;
