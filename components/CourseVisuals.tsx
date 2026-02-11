import React, { useState, useEffect, useRef } from 'react';
import { Activity, Move, Maximize, Sliders, Play, Pause, RotateCcw, Info } from 'lucide-react';

// --- SHARED COMPONENTS ---

const VisualContainer: React.FC<{ title: string, children: React.ReactNode, controls?: React.ReactNode, info?: string }> = ({ title, children, controls, info }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col h-full min-h-[400px] shadow-2xl relative group">
      {/* Glass Reflection Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-50"></div>

      <div className="bg-white/5 p-3 border-b border-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Activity size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
        </div>
        {info && (
           <button 
             onMouseEnter={() => setShowInfo(true)}
             onMouseLeave={() => setShowInfo(false)}
             className="text-slate-500 hover:text-white transition-colors"
           >
             <Info size={16} />
           </button>
        )}
      </div>
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
            {children}
        </div>
        
        {/* Info Overlay */}
        {showInfo && info && (
           <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-8 z-50 animate-in fade-in duration-200">
              <div className="max-w-md text-center bg-black/60 p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl transform transition-all hover:scale-105">
                 <Info size={32} className="text-cyan-400 mx-auto mb-4" />
                 <p className="text-sm text-slate-200 leading-relaxed font-medium">{info}</p>
              </div>
           </div>
        )}
      </div>
      {controls && (
        <div className="bg-white/5 p-4 border-t border-white/5 space-y-4 backdrop-blur-sm relative z-10">
          {controls}
        </div>
      )}
    </div>
  );
};

const SliderControl: React.FC<{ label: string, value: number, min: number, max: number, onChange: (val: number) => void, unit?: string }> = ({ label, value, min, max, onChange, unit }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
      <span>{label}</span>
      <span className="text-cyan-400">{value} {unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={(max-min)/100}
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
    />
  </div>
);

// --- VISUALIZERS ---

// Topic 1-1: Longitudinal Wave
export const LongitudinalWaveVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: {x: number, y: number, basePath: number}[] = [];
    for(let i=0; i<300; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        basePath: Math.random() * canvas.width
      });
    }

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.05;
      
      // Draw Particles
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#22d3ee';
      ctx.fillStyle = '#22d3ee';
      
      particles.forEach(p => {
        const displacement = Math.sin((p.basePath * 0.05) - time) * 25;
        const x = p.basePath + displacement;
        const alpha = 0.3 + (Math.cos((p.basePath * 0.05) - time) + 1) / 4; // Higher density = brighter
        
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw Labels for Compression/Rarefaction
      ctx.shadowBlur = 0;
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      
      for(let x=0; x<canvas.width; x+= 125) { // 125 is approx wavelength (2pi / 0.05)
         const phase = (x * 0.05) - time;
         // cos(phase) peaks at compression in this model? 
         // Actually displacement = sin. Slope = cos. Max negative slope = compression?
         // Let's just track the sine wave visual.
         
         const y = canvas.height - 20;
         // Draw simplified sine wave at bottom
         const waveY = canvas.height - 40 + Math.sin(phase) * 10;
         ctx.fillRect(x, waveY, 2, 2);
      }
      
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
      ctx.beginPath();
      for(let x=0; x<canvas.width; x++) {
        const y = canvas.height/2 + Math.sin((x * 0.05) - time) * 80;
        if(x===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <VisualContainer title="Longitudinal Wave Propagation">
      <canvas ref={canvasRef} width={600} height={300} className="w-full h-full object-contain" />
    </VisualContainer>
  );
};

// Topic 1-2: Wave Parameters
export const WaveParametersVisual: React.FC = () => {
  const [freq, setFreq] = useState(2);
  const [amp, setAmp] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.05;

      ctx.beginPath();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;
      
      for(let x=0; x<canvas.width; x++) {
        // y = A * sin(B * (x - C)) + D
        // B relates to frequency/period
        const y = canvas.height/2 + Math.sin((x * 0.01 * freq) - time * freq) * amp;
        if(x===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Period Line
      const periodPixels = (2 * Math.PI) / (0.01 * freq);
      ctx.strokeStyle = '#f472b6';
      ctx.beginPath();
      ctx.moveTo(50, 50);
      ctx.lineTo(50 + periodPixels, 50);
      ctx.stroke();
      ctx.fillStyle = '#f472b6';
      ctx.fillText(`Wavelength / Period`, 50, 40);

      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [freq, amp]);

  return (
    <VisualContainer 
      title="Wave Parameters"
      controls={
        <>
          <SliderControl label="Frequency" value={freq} min={1} max={10} onChange={setFreq} unit="MHz" />
          <SliderControl label="Amplitude" value={amp} min={10} max={100} onChange={setAmp} unit="dB" />
        </>
      }
    >
      <canvas ref={canvasRef} width={600} height={300} className="w-full h-full object-contain" />
    </VisualContainer>
  );
};

// Topic 3-1: Pulse Echo Principle
export const PulseEchoPrincipleVisual: React.FC = () => {
  const [depth, setDepth] = useState(10); // cm
  const [isPulsing, setIsPulsing] = useState(true);
  
  // 13us rule: 13us per cm depth (round trip)
  // Animation speed needs to be scaled
  
  return (
    <VisualContainer 
      title="Pulse-Echo Principle (13µs Rule)"
      controls={
        <SliderControl label="Reflector Depth" value={depth} min={1} max={20} onChange={setDepth} unit="cm" />
      }
    >
      <div className="relative w-full h-64 bg-white/5 backdrop-blur-sm border-l-4 border-cyan-500 flex items-center rounded-r-xl">
        {/* Transducer */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-16 bg-slate-700/80 backdrop-blur rounded-r-lg border border-white/20 flex items-center justify-center">
          <Activity className="text-cyan-500 w-4 h-4 animate-pulse" />
        </div>

        {/* Target */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-16 bg-red-500/50 border border-red-500 rounded shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          style={{ left: `${(depth / 20) * 90}%` }}
        >
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-red-400 whitespace-nowrap font-mono">{depth} cm</div>
        </div>

        {/* Pulse Animation */}
        <div className="absolute left-8 right-0 h-1 top-1/2 -translate-y-1/2 overflow-hidden">
           {isPulsing && (
             <div 
                className="w-4 h-4 bg-cyan-400 rounded-full blur-sm absolute"
                style={{
                  animation: `pulse-travel ${depth * 0.2}s linear infinite`
                }}
             />
           )}
        </div>
        
        {/* Time Calculation Display */}
        <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 text-right shadow-xl">
           <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Go-Return Time</div>
           <div className="text-2xl font-mono text-cyan-400 font-bold">{(depth * 13).toFixed(0)} µs</div>
           <div className="text-[8px] text-slate-500 mt-1">13µs × {depth}cm</div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse-travel {
          0% { left: 0; opacity: 1; background: #22d3ee; }
          49% { opacity: 1; }
          50% { left: ${(depth / 20) * 90}%; background: #22d3ee; }
          51% { background: #f472b6; } 
          100% { left: 0; background: #f472b6; }
        }
      `}</style>
    </VisualContainer>
  );
};

// Topic 4-1: Doppler Principle
export const DopplerPrincipleVisual: React.FC = () => {
  const [velocity, setVelocity] = useState(0); // -100 to 100
  const [angle, setAngle] = useState(0); // 0 to 90

  // Calculate Shift: fD = (2 * f0 * v * cos(angle)) / c
  const shift = Math.cos(angle * Math.PI / 180) * velocity;
  const isAliasing = Math.abs(shift) > 80; // Arbitrary limit for visual

  return (
    <VisualContainer 
      title="Doppler Effect & Cosine"
      controls={
        <>
           <SliderControl label="Flow Velocity (towards/away)" value={velocity} min={-100} max={100} onChange={setVelocity} unit="cm/s" />
           <SliderControl label="Insonation Angle" value={angle} min={0} max={90} onChange={setAngle} unit="°" />
        </>
      }
    >
       <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)]"></div>

          {/* Vessel */}
          <div className="w-full h-32 bg-red-950/30 border-y border-red-500/30 relative overflow-hidden flex items-center shadow-[inset_0_0_20px_rgba(220,38,38,0.2)]">
             {/* Flow Animation */}
             <div className="flex space-x-12 animate-[flow_2s_linear_infinite] w-[200%]" style={{ 
                animationDirection: velocity >= 0 ? 'normal' : 'reverse',
                animationDuration: `${100 / (Math.abs(velocity) + 1)}s` 
             }}>
                {[...Array(30)].map((_, i) => (
                   <div key={i} className="relative group">
                      <div className="w-3 h-3 rounded-full bg-red-500 opacity-60 shadow-[0_0_10px_rgba(239,68,68,0.5)] blur-[1px]"></div>
                      <div className="absolute top-0 left-0 w-3 h-3 rounded-full bg-red-400 opacity-30 animate-ping"></div>
                   </div>
                ))}
             </div>
             
             {/* Flow Direction Arrows */}
             <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                {velocity !== 0 && (
                   <div className={`text-[100px] font-black text-red-500 ${velocity > 0 ? '' : 'rotate-180'}`}>
                      »
                   </div>
                )}
             </div>
          </div>

          {/* Transducer & Beam */}
          <div 
             className="absolute h-48 w-2 bg-gradient-to-b from-cyan-400/80 via-cyan-500/20 to-transparent origin-top transition-transform duration-300 ease-out"
             style={{ 
                top: '15%',
                transform: `rotate(${angle}deg)`,
                height: '200px'
             }}
          >
             {/* Transducer Head */}
             <div className="absolute -top-6 -left-3 w-8 h-6 bg-slate-800 border border-cyan-500/50 rounded-b-lg shadow-[0_0_15px_rgba(34,211,238,0.4)] z-20"></div>
             
             {/* Pulse Effect down the beam */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/50 to-transparent animate-[scanDown_1s_linear_infinite] opacity-50"></div>
          </div>

          {/* Angle Arc Indicator */}
          <div className="absolute top-[15%] pointer-events-none">
              <svg width="200" height="200" className="overflow-visible opacity-50">
                 <path d={`M 0 0 L ${Math.sin(angle * Math.PI/180) * 50} ${Math.cos(angle * Math.PI/180) * 50}`} stroke="cyan" strokeDasharray="4 4" />
                 <path d={`M 0 50 A 50 50 0 0 1 ${Math.sin(angle * Math.PI/180) * 50} ${Math.cos(angle * Math.PI/180) * 50}`} fill="none" stroke="white" strokeOpacity="0.3" />
                 <text x="10" y="70" fill="white" fontSize="10" fontFamily="monospace">{angle}°</text>
              </svg>
          </div>

          {/* HUD Readout */}
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-xl p-4 rounded-xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] w-48">
             <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                <span className="text-[10px] text-slate-400 font-bold tracking-widest">DOPPLER_ANALYSIS</span>
                <Activity size={12} className="text-cyan-500 animate-pulse" />
             </div>
             
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <span className="text-[9px] text-slate-500">COS_THETA</span>
                   <span className="font-mono text-xs text-cyan-400 font-bold">{Math.cos(angle * Math.PI / 180).toFixed(3)}</span>
                </div>
                
                <div>
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] text-slate-500">FREQ_SHIFT</span>
                      <span className={`font-mono text-xs font-bold ${shift > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                         {shift > 0 ? '+' : ''}{shift.toFixed(1)} kHz
                      </span>
                   </div>
                   {/* Visual Shift Bar */}
                   <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20"></div>
                      <div 
                        className={`h-full absolute transition-all duration-300 ${shift > 0 ? 'bg-red-500 left-1/2' : 'bg-blue-500 right-1/2'}`}
                        style={{ width: `${Math.min(Math.abs(shift), 100) / 2}%` }} // Scale to fit
                      ></div>
                   </div>
                </div>
             </div>

             {angle === 90 && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded text-[9px] text-red-400 font-bold text-center animate-pulse">
                   CRITICAL: 90° INCIDENCE
                   <div className="text-[8px] opacity-70">No Frequency Shift Detected</div>
                </div>
             )}
          </div>
       </div>
    </VisualContainer>
  );
};

// Topic 2-1: Transducer Anatomy (Piezoelectric Effect)
export const TransducerAnatomyVisual: React.FC = () => {
  const [voltage, setVoltage] = useState(false);
  
  return (
    <VisualContainer 
      title="Piezoelectric Effect"
      controls={
        <button 
          onMouseDown={() => setVoltage(true)} 
          onMouseUp={() => setVoltage(false)}
          onTouchStart={() => setVoltage(true)}
          onTouchEnd={() => setVoltage(false)}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${voltage ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-[0.98]' : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'}`}
        >
          {voltage ? '⚡ VOLTAGE APPLIED ⚡' : 'HOLD TO APPLY VOLTAGE'}
        </button>
      }
    >
      <div className="flex flex-col items-center justify-center h-full space-y-8">
        <div className="relative flex items-center justify-center">
           {/* Wire */}
           <div className="absolute -top-20 w-2 h-20 bg-slate-800 border-x border-slate-600 overflow-hidden">
              {/* Electricity Flow */}
              {voltage && (
                 <div className="absolute inset-0 bg-yellow-400/50 animate-[scanDown_0.2s_linear_infinite]"></div>
              )}
           </div>
           
           {/* PZT Crystal */}
           <div 
             className={`relative z-10 border-4 transition-all duration-75 flex items-center justify-center text-center p-2 rounded-sm
               ${voltage 
                 ? 'bg-cyan-400 border-white w-40 h-24 shadow-[0_0_50px_rgba(34,211,238,0.8)]' // Expanded/Compressed
                : 'bg-slate-700/50 backdrop-blur border-slate-500 w-32 h-32 shadow-none'
              }`}
            >
             <span className={`font-black uppercase tracking-widest text-[10px] ${voltage ? 'text-white' : 'text-slate-900'}`}>
               PZT Crystal
             </span>
             {/* Internal Lattice Structure */}
             <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[size:10px_10px] opacity-50"></div>
           </div>
           
           {/* Sound Wave Emission */}
           {voltage && (
             <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 h-64 pointer-events-none overflow-hidden">
                {[...Array(5)].map((_, i) => (
                   <div 
                      key={i}
                      className="absolute top-0 left-1/2 -translate-x-1/2 border-t-4 border-cyan-400/50 rounded-full"
                      style={{
                         width: `${(i+1)*20}%`,
                         height: `${(i+1)*20}%`,
                         animation: `beamPulse 1s linear infinite`,
                         animationDelay: `${i * 0.1}s`,
                         opacity: 0
                      }}
                   ></div>
                ))}
             </div>
           )}
        </div>
        
        <div className="text-center space-y-2 z-20">
           <div className={`text-xs font-mono uppercase tracking-widest transition-colors ${voltage ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]' : 'text-slate-600'}`}>
             {voltage ? 'ELECTRICAL ENERGY → MECHANICAL ENERGY' : 'RESTING STATE'}
           </div>
           <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
             Reverse Piezoelectric Effect: Voltage causes the crystal to deform (change shape), creating a pressure wave.
           </p>
        </div>
      </div>
    </VisualContainer>
  );
};

// Topic 9-1: Axial Resolution
export const AxialResolutionVisual: React.FC = () => {
  const [frequency, setFrequency] = useState(3); // MHz
  const [damping, setDamping] = useState(50); // %
  
  // SPL ~ Wavelength * #Cycles
  const wavelength = 30 / frequency; // Arbitrary scale
  const cycles = 6 - (damping / 20); 
  const spl = wavelength * cycles;
  const splPixels = spl * 3; // Visual scale

  const targetSeparation = 60; // Fixed pixels

  const isResolved = (splPixels / 2) < targetSeparation;

  return (
    <VisualContainer 
      title="Axial Resolution (LARRD)"
      info="Goal: Make the pulse SHORTER than the gap between targets. Increase Frequency or Damping to shorten the SPL. Shorter Pulse = Better Resolution."
      controls={
        <>
          <SliderControl label="Frequency" value={frequency} min={2} max={10} onChange={setFrequency} unit="MHz" />
          <SliderControl label="Backing Material (Damping)" value={damping} min={0} max={100} onChange={setDamping} unit="%" />
        </>
      }
    >
       <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
          {/* Simulation Viewport */}
          <div className="relative w-full h-40 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden group">
             
             {/* Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

             {/* The Transducer */}
             <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 border-r border-slate-600 z-20 flex items-center justify-center">
                <span className="text-[9px] -rotate-90 text-slate-500 font-bold tracking-widest">TRANSDUCER</span>
             </div>

             {/* The Traveling Pulse (Animation) */}
             <div 
               className="h-16 flex items-center justify-center absolute top-1/2 -translate-y-1/2 animate-[scanRight_2s_linear_infinite]"
               style={{ width: `${splPixels}px` }}
             >
                {/* Pulse Waveform */}
                <svg className="w-full h-full drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" preserveAspectRatio="none">
                  <path d={`M0 32 ${Array.from({length: Math.ceil(cycles * 2)}, (_, i) => `Q ${((i + 0.5) / (cycles * 2)) * 100}% ${i % 2 === 0 ? 0 : 64}, ${((i + 1) / (cycles * 2)) * 100}% 32`).join(' ')}`} fill="none" stroke="#22d3ee" strokeWidth="2" />
                </svg>
                {/* SPL Label */}
                <div className="absolute -top-5 text-[9px] text-cyan-400 whitespace-nowrap font-mono">SPL</div>
             </div>

             {/* Targets */}
             <div className="absolute right-1/3 top-1/2 -translate-y-1/2 flex flex-row items-center">
                {/* Target 1 */}
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_red] z-10 relative">
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-red-400">T1</div>
                </div>
                
                {/* Gap */}
                <div className="h-px bg-white/30 relative" style={{ width: `${targetSeparation}px` }}>
                   <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] text-slate-400 whitespace-nowrap">{targetSeparation/10}mm</div>
                </div>

                {/* Target 2 */}
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_red] z-10 relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-red-400">T2</div>
                </div>
             </div>

             {/* Returning Echoes (Visualized on Screen) */}
             <div className="absolute bottom-2 right-2 flex space-x-1">
                 {/* This represents the A-mode display */}
                 <div className="h-8 w-32 bg-black border border-green-500/30 rounded p-1 flex items-end overflow-hidden relative">
                    {/* Baseline */}
                    <div className="w-full h-px bg-green-900 absolute bottom-1"></div>
                    
                    {/* Echo 1 */}
                    <div className="w-1 bg-green-500 h-4 absolute bottom-1 left-1/3 animate-pulse shadow-[0_0_5px_lime]"></div>
                    
                    {/* Echo 2 (Position depends on resolution) */}
                    <div 
                      className={`w-1 bg-green-500 h-4 absolute bottom-1 transition-all duration-300 animate-pulse shadow-[0_0_5px_lime] ${isResolved ? 'left-2/3' : 'left-[38%]'}`}
                      style={{ opacity: isResolved ? 1 : 0.5 }} // If unresolved, it merges
                    ></div>
                    
                    {!isResolved && (
                       <div className="w-4 h-6 bg-green-500/50 absolute bottom-1 left-[35%] blur-sm"></div> // The "Blob"
                    )}
                 </div>
                 <span className="text-[8px] text-green-500 font-mono self-end">SCREEN</span>
             </div>
          </div>

          <div className={`text-center p-4 rounded-xl border w-full transition-colors duration-500 ${isResolved ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
             <h3 className={`text-xl font-black uppercase tracking-widest ${isResolved ? 'text-emerald-400' : 'text-red-500'}`}>
               {isResolved ? 'RESOLVED' : 'UNRESOLVED'}
             </h3>
             <p className="text-[10px] text-slate-400 mt-2">
               {isResolved 
                 ? "SPL/2 < Distance. Two distinct echoes returned." 
                 : "SPL/2 > Distance. Echoes overlap into one blob."}
             </p>
          </div>
       </div>
       
       <style>{`
         @keyframes scanRight {
           0% { left: 0; opacity: 0; }
           10% { opacity: 1; }
           80% { left: 80%; opacity: 1; }
           100% { left: 90%; opacity: 0; }
         }
       `}</style>
    </VisualContainer>
  );
};

// Topic 9-2: Lateral Resolution
export const LateralResolutionVisual: React.FC = () => {
  const [focusDepth, setFocusDepth] = useState(50); // %
  
  return (
    <VisualContainer 
      title="Lateral Resolution (LATA)"
      controls={
        <SliderControl label="Focal Depth" value={focusDepth} min={10} max={90} onChange={setFocusDepth} unit="%" />
      }
    >
      <div className="relative w-full h-full overflow-hidden flex justify-center">
         {/* Beam Shape */}
         <div 
           className="absolute top-0 w-full h-full bg-cyan-500/5"
           style={{ 
             clipPath: `polygon(0 0, 100% 0, 55% ${focusDepth}%, 100% 100%, 0 100%, 45% ${focusDepth}%)`
           }}
         ></div>
         
         {/* Focal Point Indicator */}
         <div 
           className="absolute w-full border-t border-dashed border-cyan-500/50 flex items-center justify-end px-2"
           style={{ top: `${focusDepth}%` }}
         >
           <span className="text-[9px] text-cyan-400 uppercase tracking-widest">Focal Zone (Best Resolution)</span>
         </div>

         {/* Targets at different depths */}
         <div className="absolute top-[20%] w-full flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="absolute left-4 text-[9px] text-red-500/50">Near Field (Wide Beam)</span>
         </div>

         <div className="absolute w-full flex justify-center space-x-2" style={{ top: `${focusDepth}%` }}>
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_5px_lime]"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_5px_lime]"></div>
            <span className="absolute left-4 text-[9px] text-emerald-500">Focus (Narrow Beam)</span>
         </div>

         <div className="absolute top-[90%] w-full flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="absolute left-4 text-[9px] text-red-500/50">Far Field (Divergence)</span>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic 6-1: Bioeffects (Cavitation)
export const BioeffectMechanismsVisual: React.FC = () => {
  const [mi, setMi] = useState(0.5);
  
  // Stable vs Transient Cavitation
  const isTransient = mi > 1.9;
  const bubbleSize = 20 + (mi * 20);

  return (
    <VisualContainer 
      title="Mechanical Index & Cavitation"
      controls={
        <SliderControl label="Mechanical Index (MI)" value={mi} min={0.1} max={3.0} onChange={setMi} unit="" />
      }
    >
      <div className="flex flex-col items-center justify-center h-full">
         <div className="relative w-64 h-64 border border-white/10 rounded-full flex items-center justify-center bg-blue-900/10">
            {/* The Bubble */}
            <div 
              className={`rounded-full border-2 transition-all duration-75 
                ${isTransient ? 'border-red-500 bg-red-500/20' : 'border-cyan-400 bg-cyan-400/20'}
              `}
              style={{
                width: `${bubbleSize}px`,
                height: `${bubbleSize}px`,
                animation: isTransient ? 'shake 0.1s infinite' : 'pulse 2s infinite'
              }}
            ></div>
            
            {/* Pressure Waves */}
            <div className="absolute inset-0 border border-white/5 rounded-full animate-ping"></div>
         </div>
         
         <div className="mt-8 text-center">
            <h3 className={`text-xl font-black uppercase tracking-widest ${isTransient ? 'text-red-500' : 'text-cyan-400'}`}>
              {isTransient ? 'TRANSIENT CAVITATION' : 'STABLE CAVITATION'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-2 max-w-sm">
              {isTransient 
                ? "DANGER: Bubble bursting. Shock waves and very high temperatures. Occurs at high MI levels." 
                : "Bubble oscillates (expands/contracts) but does not burst. Microstreaming and shear stresses occur."}
            </p>
         </div>

         <style>{`
           @keyframes shake {
             0% { transform: translate(1px, 1px) rotate(0deg); }
             10% { transform: translate(-1px, -2px) rotate(-1deg); }
             20% { transform: translate(-3px, 0px) rotate(1deg); }
             30% { transform: translate(3px, 2px) rotate(0deg); }
             40% { transform: translate(1px, -1px) rotate(1deg); }
             50% { transform: translate(-1px, 2px) rotate(-1deg); }
             60% { transform: translate(-3px, 1px) rotate(0deg); }
             70% { transform: translate(3px, 1px) rotate(-1deg); }
             80% { transform: translate(-1px, -1px) rotate(1deg); }
             90% { transform: translate(1px, 2px) rotate(0deg); }
             100% { transform: translate(1px, -2px) rotate(-1deg); }
           }
         `}</style>
      </div>
    </VisualContainer>
  );
};

// Topic 10-1: Propagation Artifacts (Reverberation)
export const PropagationArtifactsVisual: React.FC = () => {
  const [bounciness, setBounciness] = useState(2); // Number of bounces

  return (
    <VisualContainer
      title="Reverberation Artifact"
      controls={
        <SliderControl label="Reflector Strength (Bounces)" value={bounciness} min={0} max={10} onChange={setBounciness} unit="" />
      }
    >
      <div className="relative w-full h-full overflow-hidden flex flex-col items-center pt-8">
        {/* Transducer */}
        <div className="w-32 h-4 bg-slate-500 rounded-b-lg z-20 shadow-lg"></div>

        {/* True Reflector */}
        <div className="w-full h-1 bg-cyan-500 mt-16 relative z-10 shadow-[0_0_10px_cyan]">
          <span className="absolute right-2 -top-4 text-[9px] text-cyan-400 font-bold uppercase tracking-widest">True Reflector</span>
        </div>

        {/* Artifacts */}
        {[...Array(Math.floor(bounciness))].map((_, i) => (
            <div
                key={i}
                className="w-full h-1 bg-cyan-500 mt-16 relative"
                style={{ 
                  opacity: 1 - ((i+1) * 0.15),
                  filter: `blur(${i}px)`
                }}
            >
                 <span className="absolute right-2 -top-4 text-[9px] text-cyan-500/50 uppercase tracking-widest">Artifact {i+1}</span>
            </div>
        ))}
        
        <div className="absolute bottom-4 text-center max-w-md bg-black/30 p-4 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
             <p className="text-[10px] text-slate-300">
                <strong className="text-cyan-400">REVERBERATION:</strong> Sound bounces back and forth between two strong reflectors (like transducer & bone).
                The machine assumes sound travels directly, so it places these delayed echoes deeper in the image (Ladder Effect).
             </p>
        </div>
      </div>
    </VisualContainer>
  );
};

// Topic 10-2: Attenuation Artifacts (Shadowing vs Enhancement)
export const AttenuationArtifactsVisual: React.FC = () => {
  const [structureType, setStructureType] = useState<'stone' | 'cyst'>('stone');

  return (
    <VisualContainer
      title="Attenuation Artifacts"
      controls={
        <div className="flex space-x-2">
            <button
                onClick={() => setStructureType('stone')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${structureType === 'stone' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
            >
                Stone (High Attenuation)
            </button>
            <button
                onClick={() => setStructureType('cyst')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${structureType === 'cyst' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
            >
                Cyst (Low Attenuation)
            </button>
        </div>
      }
    >
      <div className="relative w-full h-full flex flex-col items-center pt-12 overflow-hidden">
          {/* Background Tissue Texture */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>
          {/* Speckle Noise Simulation */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

          {/* Transducer Beam Source */}
          <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-cyan-500/20 to-transparent"></div>

          {/* Structure */}
          <div className={`
            w-32 h-32 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-500
            ${structureType === 'stone' ? 'bg-slate-100 border-white shadow-[0_0_20px_white]' : 'bg-black/40 border-cyan-500/50 shadow-[inset_0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-md'}
          `}>
             <span className={`text-xs font-black uppercase tracking-widest ${structureType === 'stone' ? 'text-slate-900' : 'text-cyan-500'}`}>
                {structureType === 'stone' ? 'GALLSTONE' : 'FLUID CYST'}
             </span>
          </div>

          {/* The Artifact Area (Behind structure) */}
          <div className={`
             flex-1 w-32 mt-0 transition-all duration-500 flex flex-col items-center
             ${structureType === 'stone' ? 'bg-black/90 shadow-[inset_0_10px_20px_rgba(0,0,0,1)]' : 'bg-white/10 shadow-[0_0_50px_rgba(255,255,255,0.2)]'}
          `}>
             <div className="mt-8 transform rotate-90 whitespace-nowrap">
                 <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${structureType === 'stone' ? 'text-slate-700' : 'text-white'}`}>
                    {structureType === 'stone' ? 'Acoustic Shadow' : 'Posterior Enhancement'}
                 </span>
             </div>
          </div>
          
          <div className="absolute bottom-4 text-center max-w-md bg-black/40 p-4 rounded-xl backdrop-blur-md border border-white/10 z-20 shadow-xl">
             <p className="text-[10px] text-slate-300">
               {structureType === 'stone' 
                 ? <><strong className="text-red-400">SHADOWING:</strong> Sound is absorbed/reflected by the stone. No sound reaches deep tissues → Black Shadow.</>
                 : <><strong className="text-emerald-400">ENHANCEMENT:</strong> Fluid does not attenuate sound. Stronger beam reaches deep tissues → Brighter Image.</>
               }
             </p>
          </div>
      </div>
    </VisualContainer>
  );
};

// Topic 1-3: Tissue Interaction (Reflection & Refraction)
export const TissueInteractionVisual: React.FC = () => {
  const [angle, setAngle] = useState(45);
  const [z2, setZ2] = useState(1.5); // Impedance ratio Z2/Z1
  
  // Snell's Law: sin(t) = sin(i) * (c2/c1)
  // We'll use Z (Impedance) as a proxy for speed diff visualization for simplicity, 
  // or just assume Z diff implies speed diff for refraction visual.
  // Let's assume c2/c1 ratio tracks with Z2/Z1 for this visual demo.
  const transmissionAngleRad = Math.asin(Math.sin(angle * Math.PI / 180) * (1/z2)); // simplified
  const transmissionAngle = isNaN(transmissionAngleRad) ? 90 : transmissionAngleRad * 180 / Math.PI;
  
  // Reflection % (IRC) = [(Z2-Z1)/(Z2+Z1)]^2
  const irc = Math.pow((z2 - 1) / (z2 + 1), 2) * 100;
  
  return (
    <VisualContainer 
      title="Reflection & Refraction (Snell's Law)"
      info="Adjust the Incidence Angle and Impedance Mismatch (Z2/Z1) to see how the beam behaves. Notice that when Z1 = Z2, there is NO reflection. When speeds differ, refraction occurs (bending)."
      controls={
        <>
           <SliderControl label="Incidence Angle" value={angle} min={0} max={80} onChange={setAngle} unit="°" />
           <SliderControl label="Tissue 2 Impedance (vs Tissue 1)" value={z2} min={0.5} max={2.0} onChange={setZ2} unit="x" />
        </>
      }
    >
      <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
         {/* Boundary */}
         <div className="absolute top-1/2 w-full h-px bg-white/30"></div>
         <div className="absolute top-0 left-0 p-2 text-[10px] text-slate-500">TISSUE 1 (Z1)</div>
         <div className="absolute bottom-0 left-0 p-2 text-[10px] text-slate-500">TISSUE 2 (Z2)</div>
         
         {/* Normal Line */}
         <div className="absolute h-full w-px border-l border-dashed border-white/20"></div>

         {/* Incident Beam */}
         <div 
           className="absolute h-[50%] w-1 bg-cyan-400 origin-bottom"
           style={{ 
             top: 0, 
             transform: `rotate(${angle}deg)`,
             opacity: 1
           }}
         >
            <div className="absolute bottom-0 -left-4 text-[9px] text-cyan-400 -rotate-90">Incident</div>
         </div>

         {/* Reflected Beam (Angle of Reflection = Angle of Incidence) */}
         <div 
           className="absolute h-[50%] w-1 bg-red-400 origin-bottom"
           style={{ 
             top: 0, 
             transform: `rotate(-${angle}deg)`,
             opacity: Math.max(0.2, irc/100)
           }}
         >
            <div className="absolute bottom-10 -right-4 text-[9px] text-red-400 rotate-90">Reflected ({irc.toFixed(1)}%)</div>
         </div>

         {/* Transmitted Beam (Refraction) */}
         <div 
           className="absolute h-[50%] w-1 bg-emerald-400 origin-top"
           style={{ 
             top: '50%', 
             transform: `rotate(${180 - transmissionAngle}deg)`,
             opacity: Math.max(0.2, 1 - (irc/100))
           }}
         >
            <div className="absolute top-10 -left-4 text-[9px] text-emerald-400 -rotate-90">
              {transmissionAngle === 90 ? 'CRITICAL ANGLE' : `Transmitted (${(100-irc).toFixed(1)}%)`}
            </div>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic 2-2: Array Types
export const ArrayTypesVisual: React.FC = () => {
  const [type, setType] = useState<'linear' | 'curved' | 'phased'>('linear');

  return (
    <VisualContainer
      title="Transducer Array Types"
      controls={
        <div className="flex space-x-2">
           {['linear', 'curved', 'phased'].map(t => (
             <button 
               key={t}
               onClick={() => setType(t as any)}
               className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all 
                 ${type === t ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
             >
               {t}
             </button>
           ))}
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center h-full pt-8">
         {/* Transducer Body */}
         <div className={`
           h-8 bg-white/20 transition-all duration-500 mb-0 relative z-10 border border-white/30 backdrop-blur-sm
           ${type === 'linear' ? 'w-48 rounded-t-sm' : ''}
           ${type === 'curved' ? 'w-48 rounded-t-[100%] rounded-b-lg' : ''}
           ${type === 'phased' ? 'w-16 rounded-t-lg' : ''}
         `}></div>
         
         {/* Beam Shape */}
         <div className={`
            bg-gradient-to-b from-cyan-500/30 to-transparent transition-all duration-500 origin-top
            ${type === 'linear' ? 'w-48 h-48' : ''} // Rectangular
            ${type === 'curved' ? 'w-64 h-48 [clip-path:polygon(20%_0,80%_0,100%_100%,0%_100%)]' : ''} // Blunted Sector
            ${type === 'phased' ? 'w-64 h-48 [clip-path:polygon(50%_0,100%_100%,0%_100%)]' : ''} // Sector
         `}></div>

         <div className="mt-8 text-center bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <h4 className="text-cyan-400 font-bold uppercase text-xs mb-1">
              {type === 'linear' && 'Linear Sequential Array'}
              {type === 'curved' && 'Curvilinear Array'}
              {type === 'phased' && 'Phased Array'}
            </h4>
            <p className="text-[10px] text-slate-400 max-w-xs">
              {type === 'linear' && 'Rectangular image. Vertical scan lines. Used for vascular, thyroid, testes.'}
              {type === 'curved' && 'Blunted sector image. Curved top. Used for abdominal, OB/GYN.'}
              {type === 'phased' && 'Sector (fan) image. Pointed top. Electronic steering. Used for cardiac.'}
            </p>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic 2-3: Beam Focusing (Phased Array)
export const BeamFocusingVisual: React.FC = () => {
  const [curvature, setCurvature] = useState(0); // 0 = flat (unfocused), 10 = max curve (focused)

  return (
    <VisualContainer
      title="Electronic Focusing (Phased Array)"
      controls={
        <SliderControl label="Time Delay Curvature" value={curvature} min={0} max={20} onChange={setCurvature} unit="ns" />
      }
    >
      <div className="flex flex-col items-center justify-center h-full">
         {/* Crystals with delays */}
         <div className="flex space-x-1 mb-4">
            {[0, 1, 2, 3, 4, 4, 3, 2, 1, 0].map((pos, i) => {
               // Outer crystals fire FIRST (0 delay), Inner crystals fire LAST (max delay) for focusing?
               // Actually: To focus, outer crystals fire EARLIER (less delay), inner fire LATER (more delay)? 
               // Wait: To create a curved wavefront converging at a point:
               // The outer elements must fire EARLIER than the inner elements? 
               // No, if outer fire earlier, the wave travels further. 
               // Let's visualize the "spike" chart.
               // Curve pattern: U shape. Outer spikes are at bottom (early), Inner spikes are at top (late).
               // Or simpler: Just visualize the wavefront.
               
               const delay = (curvature * Math.abs(i - 4.5)) / 2;
               
               return (
                 <div key={i} className="flex flex-col items-center">
                    {/* The Spike (Voltage) */}
                    <div className="w-1 bg-yellow-500 mb-1 transition-all" style={{ height: `${20 - delay}px`, opacity: 0.5 }}></div>
                    {/* The Crystal */}
                    <div className="w-4 h-8 bg-white/20 border border-white/30 backdrop-blur-sm"></div>
                 </div>
               )
            })}
         </div>

         {/* Wavefront */}
         <div className="relative w-64 h-32 overflow-hidden">
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 border-t-4 border-cyan-400 rounded-[50%] transition-all duration-300 opacity-50"
              style={{ 
                width: `${200 - (curvature * 5)}%`, 
                borderRadius: `${curvature * 5}%`,
                marginTop: `${curvature * 2}px`
              }}
            ></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] text-cyan-500 uppercase tracking-widest">
               {curvature > 2 ? 'FOCUSED BEAM' : 'UNFOCUSED BEAM'}
            </div>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic 4-2: Doppler Modes (PW vs CW)
export const DopplerModesVisual: React.FC = () => {
  const [mode, setMode] = useState<'pw' | 'cw'>('pw');
  
  return (
    <VisualContainer
      title="Doppler Modes"
      info="PW uses 1 crystal to talk/listen (Range Resolution but Aliasing). CW uses 2 crystals continuously (No Aliasing but Range Ambiguity)."
      controls={
         <div className="flex space-x-2">
            <button onClick={() => setMode('pw')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'pw' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>
              Pulsed Wave (PW)
            </button>
            <button onClick={() => setMode('cw')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'cw' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>
              Continuous Wave (CW)
            </button>
         </div>
      }
    >
       <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
          <div className="flex items-center space-x-12">
             {/* Probe */}
             <div className="relative w-16 h-24 bg-white/10 backdrop-blur-md rounded-b-xl flex justify-center border border-white/10">
                {mode === 'pw' ? (
                   <div className="absolute bottom-2 w-8 h-2 bg-yellow-400 animate-pulse"></div> // 1 Crystal
                ) : (
                   <div className="absolute bottom-2 flex space-x-2">
                      <div className="w-4 h-2 bg-yellow-400 animate-pulse"></div> // Tx
                      <div className="w-4 h-2 bg-blue-400"></div> // Rx
                   </div>
                )}
                <div className="absolute -top-8 text-[9px] text-slate-400 w-32 text-center">
                  {mode === 'pw' ? '1 Crystal (Talk/Listen)' : '2 Crystals (1 Talk, 1 Listen)'}
                </div>
             </div>

             {/* Sample Volume */}
             <div className="w-48 h-32 relative bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
                {/* Beam */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-8 bg-cyan-500/10"></div>
                
                {/* Gate / Overlap */}
                {mode === 'pw' ? (
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-12 border-x-2 border-yellow-400 flex items-center justify-center">
                      <span className="text-[8px] text-yellow-400 absolute -top-4">GATE</span>
                   </div>
                ) : (
                   <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-32 h-16 bg-red-500/20 rounded-[50%] blur-xl">
                      <span className="text-[8px] text-red-400 absolute top-1/2 left-1/2 -translate-x-1/2">Zone of Overlap</span>
                   </div>
                )}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
             <div className={`p-3 rounded border ${mode === 'pw' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                <div className="text-[9px] font-bold uppercase mb-1">Range Resolution?</div>
                <div className="text-xs">{mode === 'pw' ? 'YES (We know where flow is)' : 'NO (Range Ambiguity)'}</div>
             </div>
             <div className={`p-3 rounded border ${mode === 'pw' ? 'border-red-500/50 bg-red-500/10' : 'border-emerald-500/50 bg-emerald-500/10'}`}>
                <div className="text-[9px] font-bold uppercase mb-1">Aliasing?</div>
                <div className="text-xs">{mode === 'pw' ? 'YES (Nyquist Limit)' : 'NO (Unlimited Velocity)'}</div>
             </div>
          </div>
       </div>
    </VisualContainer>
  );
};

// Topic 4-3: Flow Patterns (Laminar vs Turbulent)
export const FlowPatternsVisual: React.FC = () => {
  const [flowType, setFlowType] = useState<'laminar' | 'turbulent'>('laminar');
  
  return (
    <VisualContainer
      title="Hemodynamics: Flow Patterns"
      controls={
        <div className="flex space-x-2">
           <button onClick={() => setFlowType('laminar')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${flowType === 'laminar' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>Laminar (Plug/Parabolic)</button>
           <button onClick={() => setFlowType('turbulent')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${flowType === 'turbulent' ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>Turbulent (Chaotic)</button>
        </div>
      }
    >
      <div className="w-full h-full flex flex-col justify-center relative bg-black/40 backdrop-blur-md rounded-xl overflow-hidden">
         {/* Vessel Walls */}
         <div className="absolute top-1/4 w-full h-1 bg-pink-500/30"></div>
         <div className="absolute bottom-1/4 w-full h-1 bg-pink-500/30"></div>

         {/* Flow Arrows */}
         <div className="absolute inset-0 flex items-center">
            {flowType === 'laminar' ? (
               <div className="w-full relative h-32">
                  {/* Parabolic Profile */}
                  {[0, 1, 2, 3, 2, 1, 0].map((speed, i) => (
                     <div key={i} className="absolute w-full flex items-center" style={{ top: `${15 + (i * 10)}%` }}>
                        <div className="h-0.5 bg-cyan-400 relative overflow-hidden" style={{ width: '100%' }}>
                           <div className="absolute inset-0 bg-white/50 w-full animate-[flow_linear_infinite]" 
                                style={{ animationDuration: `${2 - (speed * 0.3)}s` }}></div>
                        </div>
                        {/* Arrow Head - simulated by shape or just lines for now */}
                     </div>
                  ))}
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[9px] text-cyan-500 rotate-90">FASTEST IN CENTER</div>
               </div>
            ) : (
               <div className="w-full h-full relative">
                  {[...Array(20)].map((_, i) => (
                     <div 
                        key={i} 
                        className="absolute w-8 h-0.5 bg-red-500"
                        style={{
                           top: `${25 + Math.random() * 50}%`,
                           left: `${Math.random() * 80}%`,
                           transform: `rotate(${Math.random() * 360}deg)`,
                           animation: `spin ${1 + Math.random()}s infinite linear`
                        }}
                     ></div>
                  ))}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-4xl font-black text-red-500/20 uppercase">CHAOS</span>
                  </div>
               </div>
            )}
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic 4-4: Physical Principles (Bernoulli)
export const PhysicalPrinciplesVisual: React.FC = () => {
  const [stenosis, setStenosis] = useState(50); // % Narrowing

  // Continuity Eq: A1 * V1 = A2 * V2
  // If Area decreases (stenosis increases), Velocity increases.
  // Bernoulli: P1 + 0.5pv1^2 = P2 + 0.5pv2^2
  // If Velocity increases, Pressure decreases.
  
  const velocityFactor = 100 / (100 - stenosis); // Speed multiplier
  const pressureDrop = Math.pow(velocityFactor, 2); // Exponential drop

  return (
    <VisualContainer
      title="Bernoulli's Principle (Stenosis)"
      controls={
        <SliderControl label="Stenosis Severity" value={stenosis} min={0} max={80} onChange={setStenosis} unit="%" />
      }
    >
       <div className="flex flex-col items-center w-full h-full justify-center space-y-8">
          {/* The Pipe */}
          <div className="relative w-full h-32 flex items-center">
             {/* Pre-Stenosis */}
             <div className="h-full bg-white/5 border-y border-white/10 flex-1 relative">
                <div className="absolute top-2 left-2 text-[9px] text-slate-400">Low V, High P</div>
                {/* Particles Normal */}
                <div className="absolute inset-0 flex items-center justify-center space-x-8">
                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-[flow_3s_linear_infinite]"></div>
                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-[flow_3s_linear_infinite] delay-75"></div>
                </div>
             </div>

             {/* Stenosis */}
             <div 
               className="h-full bg-white/5 border-y border-white/10 relative transition-all duration-300 flex items-center justify-center overflow-hidden"
               style={{ 
                  height: `${100 - stenosis}%`,
                  borderLeft: '1px solid rgba(255,255,255,0.1)',
                  borderRight: '1px solid rgba(255,255,255,0.1)'
               }}
             >
                {/* Particles Fast */}
                <div className="w-full flex justify-center">
                   <div 
                     className="w-2 h-2 bg-red-500 rounded-full animate-[flow_linear_infinite]"
                     style={{ animationDuration: `${3 / velocityFactor}s` }} // Faster
                   ></div>
                </div>
             </div>

             {/* Post-Stenosis */}
             <div className="h-full bg-white/5 border-y border-white/10 flex-1 relative">
                <div className="absolute top-2 right-2 text-[9px] text-slate-400">Turbulence</div>
                 {/* Particles Turbulence */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-50"></div>
                 </div>
             </div>
          </div>

          {/* Gauges */}
          <div className="flex justify-around w-full">
             <div className="text-center">
                <div className="text-[9px] text-slate-400 uppercase tracking-widest">Velocity</div>
                <div className="text-xl font-mono text-cyan-400">{(100 * velocityFactor).toFixed(0)} cm/s</div>
             </div>
             <div className="text-center">
                <div className="text-[9px] text-slate-400 uppercase tracking-widest">Pressure</div>
                <div className="text-xl font-mono text-red-400">{(100 / pressureDrop).toFixed(0)} mmHg</div>
             </div>
          </div>
       </div>
    </VisualContainer>
  );
};

// Topic 11-1: QA Phantom
export const QaPhantomVisual: React.FC = () => {
  return (
    <VisualContainer title="Tissue Equivalent Phantom">
       <div className="relative w-64 h-64 bg-black/40 backdrop-blur-md border-4 border-white/10 rounded-lg mx-auto shadow-xl">
          <div className="absolute top-0 left-0 bg-white/10 px-2 py-1 text-[8px] text-white">SCAN SURFACE</div>
          
          {/* Dead Zone Pins (Very shallow) */}
          <div className="absolute top-2 left-4 flex flex-col space-y-1">
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <div className="absolute -right-16 top-0 text-[8px] text-red-400">DEAD ZONE</div>
          </div>

          {/* Axial Resolution Pins (Vertical spacing changes) */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center">
             <div className="w-1 h-1 bg-white rounded-full mb-1"></div>
             <div className="w-1 h-1 bg-white rounded-full mb-2"></div>
             <div className="w-1 h-1 bg-white rounded-full mb-4"></div>
             <div className="absolute -right-24 top-0 text-[8px] text-cyan-400 w-20">AXIAL RES (Vertical Spacing)</div>
          </div>

          {/* Lateral Resolution Pins (Horizontal spacing changes) */}
          <div className="absolute top-1/2 right-8 flex items-center">
             <div className="w-1 h-1 bg-white rounded-full mr-1"></div>
             <div className="w-1 h-1 bg-white rounded-full mr-2"></div>
             <div className="w-1 h-1 bg-white rounded-full mr-4"></div>
             <div className="absolute -left-24 top-0 text-[8px] text-emerald-400 w-20 text-right">LATERAL RES (Horiz Spacing)</div>
          </div>

          {/* Horizontal Registration */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <div className="w-1 h-1 bg-white rounded-full"></div>
             <div className="absolute top-4 w-full text-center text-[8px] text-slate-400">HORIZONTAL REGISTRATION</div>
          </div>
       </div>
    </VisualContainer>
  );
};

// Topic 5-1: Non-Linear Propagation
export const NonLinearPropagationVisual: React.FC = () => {
  const [distance, setDistance] = useState(0); // 0 to 100
  
  // Wave shape morphs from Sine to Sawtooth
  // y = sin(x) + (distance * sin(2x) * small_factor)? 
  // Or just manually skew the x-coordinates of the peaks/troughs.
  
  return (
    <VisualContainer
      title="Non-Linear Propagation"
      controls={
        <SliderControl label="Propagation Distance" value={distance} min={0} max={100} onChange={setDistance} unit="cm" />
      }
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
         <div className="w-full h-32 flex items-center bg-black/40 backdrop-blur-md rounded-xl overflow-hidden relative border border-white/10">
            <svg className="w-full h-full" preserveAspectRatio="none">
               <path 
                 d={`M0 64 ${Array.from({length: 100}, (_, i) => {
                    const xBase = (i / 100) * 600;
                    const phase = (i / 100) * Math.PI * 4; // 2 cycles
                    const y = Math.sin(phase) * 50;
                    
                    // Non-linear distortion:
                    // Peaks (positive y) shift RIGHT (faster)
                    // Troughs (negative y) shift LEFT (slower) -- relative to center
                    // Actually, peaks catch up to troughs.
                    const shift = (y / 50) * (distance / 5); 
                    const x = xBase + shift;
                    
                    return `L ${x} ${64 - y}`;
                 }).join(' ')}`}
                 fill="none"
                 stroke={distance > 50 ? '#f472b6' : '#22d3ee'}
                 strokeWidth="3"
               />
            </svg>
            <div className="absolute top-2 right-2 text-[9px] text-slate-400">
               {distance < 20 ? 'Sinusoidal (Linear)' : 'Sawtooth (Non-Linear)'}
            </div>
         </div>
         <div className="mt-4 text-center max-w-sm">
            <p className="text-[10px] text-slate-400">
               Sound travels <strong className="text-white">FASTER</strong> in compressions (peaks) and <strong className="text-white">SLOWER</strong> in rarefactions (troughs). 
               Over distance, this distorts the wave shape, creating <strong className="text-pink-400">HARMONICS</strong>.
            </p>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic 5-2: Harmonic Imaging
export const HarmonicImagingVisual: React.FC = () => {
  const [mode, setMode] = useState<'fundamental' | 'harmonic'>('fundamental');
  
  return (
    <VisualContainer
      title="Tissue Harmonics"
      controls={
        <div className="flex space-x-2">
           <button onClick={() => setMode('fundamental')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'fundamental' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>Fundamental (f0)</button>
           <button onClick={() => setMode('harmonic')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'harmonic' ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}>Harmonic (2f0)</button>
        </div>
      }
    >
      <div className="relative w-full h-full bg-transparent flex justify-center overflow-hidden">
         {/* Skin Line */}
         <div className="absolute top-0 w-full h-1 bg-white/20"></div>
         
         {/* Artifacts in Near Field (Fundamental only) */}
         {mode === 'fundamental' && (
            <div className="absolute top-0 w-full h-16 bg-white/5 backdrop-blur-sm flex items-center justify-center z-20">
               <span className="text-[10px] text-slate-500 uppercase tracking-widest">NEAR FIELD CLUTTER</span>
            </div>
         )}

         {/* The Beam */}
         {mode === 'fundamental' ? (
            // Fundamental: Starts wide, gets somewhat narrow, diverges
            <div className="h-full w-32 bg-cyan-500/20 blur-xl [clip-path:polygon(0_0,100%_0,60%_100%,40%_100%)]"></div>
         ) : (
            // Harmonic: Starts invisible, appears at depth, stays narrow
            <div className="h-full w-16 bg-pink-500/30 blur-md [clip-path:polygon(20%_20%,80%_20%,60%_100%,40%_100%)] mt-8"></div>
         )}

         {/* Explanation */}
         <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] text-slate-300">
               {mode === 'fundamental' 
                 ? "Fundamental Frequency: Created at transducer. Suffers from near-field reverb and side lobes. Image is 'hazy'."
                 : "Harmonic Frequency: Created IN THE TISSUE. Bypasses near-field fat/distortion. Beam is narrower (better lateral res) and cleaner."}
            </p>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic: Instrumentation - Dynamic Range
export const DynamicRangeVisual: React.FC = () => {
  const [compression, setCompression] = useState(50); // 0 (Bistable) to 100 (Wide DR)

  return (
    <VisualContainer 
      title="Dynamic Range (Contrast)" 
      info="Dynamic Range determines the number of gray shades. Low DR (Compression) = High Contrast (Bistable). High DR = Low Contrast (Many Grays)."
      controls={
        <SliderControl label="Compression (dB)" value={compression} min={0} max={100} onChange={setCompression} unit="dB" />
      }
    >
      <div className="flex flex-col items-center gap-4 w-full px-8">
        <div className="w-full h-12 bg-gradient-to-r from-black to-white rounded border border-white/20 relative">
           <span className="absolute -top-6 left-0 text-[10px] text-slate-500">Weakest</span>
           <span className="absolute -top-6 right-0 text-[10px] text-slate-500">Strongest</span>
        </div>
        <div className="text-cyan-500 font-mono text-xs">Processing...</div>
        <div className="w-full h-24 flex">
           {Array.from({ length: 10 }).map((_, i) => {
             const x = i / 9;
             let gray;
             if (compression < 20) {
                gray = x > 0.5 ? 255 : 0;
             } else {
                const factor = (compression - 20) / 80;
                const val = (x - 0.5) * (1 / (factor + 0.1)) + 0.5;
                const clamped = Math.max(0, Math.min(1, val));
                gray = Math.round(clamped * 255);
             }
             return (
               <div key={i} className="flex-1 border-r border-white/20 first:rounded-l last:rounded-r last:border-0" style={{ backgroundColor: `rgb(${gray},${gray},${gray})` }}></div>
             );
           })}
        </div>
        <div className="text-center text-xs font-mono text-white">
           {compression < 20 ? "BISTABLE (High Contrast)" : "GRAYSCALE (Low Contrast)"}
        </div>
      </div>
    </VisualContainer>
  );
};

// Topic: Instrumentation - B-Mode
export const BModeVisual: React.FC = () => {
  return (
    <VisualContainer title="B-Mode (Brightness)" info="Amplitude of reflected echo determines pixel brightness.">
      <div className="relative w-64 h-64 bg-black/40 backdrop-blur-md border border-white/10 rounded-full overflow-hidden flex items-center justify-center">
         <div className="absolute inset-0 origin-bottom animate-[scan_4s_linear_infinite] bg-gradient-to-t from-transparent via-cyan-500/10 to-transparent w-full h-full border-b border-cyan-500/50"></div>
         <div className="absolute top-1/4 left-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] animate-pulse"></div>
         <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-gray-400 rounded-full"></div>
         <div className="absolute top-2/3 left-2/3 w-6 h-6 bg-white/50 rounded-full border border-white"></div>
         <div className="absolute bottom-4 text-center text-[10px] text-cyan-500 font-mono">SCANNING...</div>
      </div>
    </VisualContainer>
  );
};

// Topic: Physics - Decibel
export const DecibelVisual: React.FC = () => {
  const [db, setDb] = useState(3);
  const ratio = Math.pow(10, db/10);
  
  return (
    <VisualContainer 
      title="Decibels (Logarithmic)" 
      info="3dB = x2 Intensity. 10dB = x10 Intensity. -3dB = 1/2 Intensity."
      controls={<SliderControl label="dB Change" value={db} min={-10} max={20} onChange={setDb} unit="dB" />}
    >
      <div className="flex items-center justify-center gap-8 w-full">
         <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-bold text-xs">I₀</div>
            <span className="text-xs text-slate-500">Initial</span>
         </div>
         <div className="text-cyan-500 font-mono">→ {db > 0 ? '+' : ''}{db}dB →</div>
         <div className="flex flex-col items-center gap-2">
            <div 
              className="bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold text-xs transition-all duration-300"
              style={{ width: `${Math.max(20, Math.min(150, 48 * Math.sqrt(ratio)))}px`, height: `${Math.max(20, Math.min(150, 48 * Math.sqrt(ratio)))}px` }}
            >
               {ratio.toFixed(1)}x
            </div>
            <span className="text-xs text-slate-500">Final</span>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic: Instrumentation - TGC
export const TGCVisual: React.FC = () => {
  const [sliders, setSliders] = useState([50, 50, 50, 50, 50]);

  const handleSlide = (i: number, val: number) => {
    const newSliders = [...sliders];
    newSliders[i] = val;
    setSliders(newSliders);
  };

  return (
    <VisualContainer title="Time Gain Compensation (TGC)" info="Compensates for attenuation by increasing amplification at greater depths.">
      <div className="flex items-center justify-center gap-8 w-full h-full">
         <div className="flex flex-col space-y-2 bg-white/5 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
            {sliders.map((val, i) => (
              <div key={i} className="flex items-center space-x-2">
                 <span className="text-[8px] text-slate-400 w-4">D{i+1}</span>
                 <input 
                   type="range" min="0" max="100" value={val} 
                   onChange={(e) => handleSlide(i, parseInt(e.target.value))}
                   className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                 />
              </div>
            ))}
            <div className="text-[8px] text-center text-slate-500 mt-1">SLIDERS</div>
         </div>

         <div className="w-32 h-48 bg-black/40 backdrop-blur-md border border-white/20 relative overflow-hidden flex flex-col">
            {sliders.map((val, i) => (
               <div key={i} className="flex-1 w-full transition-colors duration-200" style={{ backgroundColor: `rgba(255,255,255, ${val / 100})` }}>
                  <div className="w-full h-full opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>
               </div>
            ))}
            <div className="absolute top-0 right-0 bottom-0 w-8 border-l border-white/10 flex flex-col">
               <div className="flex-1 border-b border-white/5"></div>
               <div className="flex-1 border-b border-white/5"></div>
               <div className="flex-1 border-b border-white/5"></div>
               <div className="flex-1 border-b border-white/5"></div>
               <div className="flex-1"></div>
            </div>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic: Instrumentation - M-Mode
export const MModeVisual: React.FC = () => {
  return (
    <VisualContainer title="M-Mode (Motion)" info="Displays motion of structures along a single scan line over time.">
      <div className="flex flex-col w-full h-full gap-2">
         <div className="h-1/3 w-full bg-black/20 backdrop-blur-sm border-b border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-900/30 rounded-full animate-pulse"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-yellow-400 border-x border-black/50"></div>
            <div className="absolute top-2 left-2 text-[8px] text-slate-400">B-MODE REF</div>
         </div>

         <div className="flex-1 w-full bg-black/40 backdrop-blur-md relative overflow-hidden flex items-center">
            <div className="absolute inset-0 flex flex-col justify-center opacity-50">
               <div className="w-[200%] h-full flex items-center animate-[slideLeft_4s_linear_infinite]">
                  {Array.from({length: 20}).map((_, i) => (
                     <div key={i} className="w-[5%] h-full flex flex-col justify-center items-center space-y-4">
                        <div className="w-full h-1 bg-white/50" style={{ transform: `translateY(${Math.sin(i)*20}px)` }}></div>
                        <div className="w-full h-2 bg-white/80" style={{ transform: `translateY(${Math.sin(i + Math.PI)*10}px)` }}></div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="absolute top-2 left-2 text-[8px] text-yellow-400">M-MODE TRACE</div>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic: Physics - Piezoelectric Effect
export const PiezoVisual: React.FC = () => {
  const [state, setState] = useState<'idle' | 'transmit' | 'receive'>('idle');

  useEffect(() => {
     const timer = setInterval(() => {
        setState(prev => prev === 'idle' ? 'transmit' : prev === 'transmit' ? 'receive' : 'idle');
     }, 2000);
     return () => clearInterval(timer);
  }, []);

  return (
    <VisualContainer title="Piezoelectric Effect" info="Conversion of Electrical energy to Sound (Transmit) and Sound to Electrical (Receive).">
      <div className="flex items-center justify-center gap-12 w-full h-full">
         <div className={`w-32 h-2 rounded ${state === 'transmit' ? 'bg-yellow-400 shadow-[0_0_10px_yellow]' : state === 'receive' ? 'bg-blue-400 shadow-[0_0_10px_blue]' : 'bg-white/20'}`}>
            <div className="text-center -mt-6 text-[9px] text-slate-400">
               {state === 'transmit' ? 'ELECTRICAL PULSE' : state === 'receive' ? 'ELECTRICAL SIGNAL' : 'NO SIGNAL'}
            </div>
         </div>

         <div className={`w-16 h-32 border-2 transition-all duration-300 flex items-center justify-center relative
            ${state === 'transmit' ? 'bg-cyan-600 border-cyan-400 scale-x-110 scale-y-90' : 
              state === 'receive' ? 'bg-cyan-600 border-cyan-400 scale-x-90 scale-y-110' : 
              'bg-white/10 border-white/20'}`}>
            <span className="text-[10px] font-bold text-white -rotate-90">CRYSTAL</span>
            
            {state === 'transmit' && <div className="absolute -right-8 text-yellow-400">→</div>}
            {state === 'receive' && <div className="absolute -right-8 text-blue-400">←</div>}
         </div>

         <div className="w-32 flex items-center justify-center">
            {state === 'transmit' && (
               <div className="w-4 h-16 bg-white/50 rounded-full animate-ping"></div>
            )}
            {state === 'receive' && (
               <div className="w-4 h-16 bg-blue-500/50 rounded-full animate-pulse"></div>
            )}
            <div className="text-center -mt-24 text-[9px] text-slate-400 absolute">
               {state === 'transmit' ? 'SOUND WAVE (Pressure)' : state === 'receive' ? 'ECHO (Pressure)' : ''}
            </div>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic 10-3: Mirror Image Artifact
export const MirrorImageArtifactVisual: React.FC = () => {
  const [angle, setAngle] = useState(15);
  
  return (
    <VisualContainer 
      title="Mirror Image Artifact" 
      info="Sound bounces off a strong reflector (Mirror) -> hits object -> back to mirror -> back to transducer. The machine assumes a straight path, placing a duplicate object DEEPER."
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
         {/* Transducer */}
         <div className="absolute top-4 left-1/4 w-16 h-8 bg-slate-600 rounded-b-lg z-20 flex justify-center">
            <Activity className="w-4 h-4 text-cyan-400 mt-2 animate-pulse" />
         </div>

         {/* The Mirror (Strong Reflector like Diaphragm) */}
         <div 
           className="absolute w-64 h-2 bg-white shadow-[0_0_15px_white] z-10"
           style={{ top: '40%', transform: `rotate(${angle}deg)` }}
         >
           <div className="absolute right-0 -top-4 text-[9px] text-white font-bold">STRONG REFLECTOR (MIRROR)</div>
         </div>

         {/* True Object */}
         <div className="absolute top-[30%] left-[40%] w-8 h-8 bg-red-500 rounded-full shadow-[0_0_10px_red] z-20 animate-pulse">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-red-400 whitespace-nowrap">TRUE OBJECT</div>
         </div>

         {/* Path of Sound (The "Ping Pong" effect) */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
            <path 
              d="M 120 40 L 150 150 L 180 120 L 150 150 L 120 40" 
              fill="none" 
              stroke="#fbbf24" 
              strokeWidth="2" 
              strokeDasharray="4"
              className="animate-[dash_2s_linear_infinite]"
            />
         </svg>

         {/* Artifact Object */}
         <div className="absolute top-[60%] left-[60%] w-8 h-8 bg-red-500/30 rounded-full border border-red-500/50 border-dashed z-0 grayscale">
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 whitespace-nowrap">ARTIFACT</div>
         </div>
         
         {/* Explanation Line */}
         <div className="absolute bottom-8 text-center px-4">
             <p className="text-[10px] text-slate-300">
               Artifact appears <strong className="text-white">DEEPER</strong> than the true reflector. It is always located on the other side of the mirror.
             </p>
         </div>
      </div>
    </VisualContainer>
  );
};

// Topic 4-5: Aliasing (Color Doppler)
export const AliasingVisual: React.FC = () => {
  const [velocity, setVelocity] = useState(40); // cm/s
  const nyquistLimit = 60; // cm/s

  const isAliasing = velocity > nyquistLimit;
  
  // Color calculation
  // Normal: 0 -> Red. Max -> Yellow.
  // Aliased: Wraps to Blue/Cyan.
  const getColor = () => {
     if (!isAliasing) {
        // Red scale
        return `rgba(239, 68, 68, ${0.5 + (velocity/nyquistLimit)*0.5})`;
     } else {
        // Wrap around color (Mosaic)
        return `conic-gradient(from 0deg, #ef4444, #fbbf24, #22d3ee, #3b82f6, #ef4444)`;
     }
  };

  return (
    <VisualContainer 
      title="Color Doppler Aliasing"
      info="Aliasing occurs when Velocity > Nyquist Limit (PRF/2). The color wraps around the scale (Red -> Yellow -> Green -> Blue)."
      controls={
        <SliderControl label="Blood Velocity" value={velocity} min={10} max={100} onChange={setVelocity} unit="cm/s" />
      }
    >
       <div className="flex flex-col items-center w-full h-full gap-4">
          <div className="flex items-center gap-4 w-full justify-center">
             {/* Color Scale (The Bar) */}
             <div className="h-48 w-8 rounded bg-gradient-to-b from-red-500 via-black to-blue-500 border border-white/20 relative flex flex-col justify-between p-1">
                <span className="text-[8px] text-white bg-black/50 px-1 rounded">{nyquistLimit}</span>
                <span className="text-[8px] text-white bg-black/50 px-1 rounded">-{nyquistLimit}</span>
                
                {/* Indicator */}
                <div 
                  className="absolute left-0 w-full h-1 bg-white shadow-[0_0_5px_white] transition-all"
                  style={{ 
                     top: isAliasing ? '90%' : `${50 - (velocity/nyquistLimit)*50}%` // Simple mapping
                  }}
                ></div>
             </div>

             {/* Vessel View */}
             <div className="w-64 h-48 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden relative flex items-center justify-center">
                {/* The Vessel */}
                <div className="w-full h-24 bg-slate-800/50 border-y border-slate-600 relative overflow-hidden">
                   {/* Flow */}
                   <div 
                     className="w-full h-full transition-all duration-300"
                     style={{ 
                        background: isAliasing ? getColor() : undefined,
                        backgroundColor: !isAliasing ? getColor() : undefined,
                        opacity: 0.8
                     }}
                   >
                      {isAliasing && (
                         <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-black text-white/80 drop-shadow-md tracking-widest">ALIASING</span>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
          
          <div className={`text-xs font-mono px-4 py-2 rounded ${isAliasing ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'}`}>
             {isAliasing ? 'WRAP AROUND (MOSAIC)' : 'LAMINAR FLOW (CORRECT DIRECTION)'}
          </div>
       </div>
    </VisualContainer>
  );
};

// Topic 10-4: Side Lobes / Grating Lobes
export const SideLobesVisual: React.FC = () => {
  return (
    <VisualContainer 
       title="Side Lobes & Grating Lobes"
       info="Off-axis energy beams generated by the transducer. If they hit a strong reflector, an artifact is placed in the main beam's path."
    >
       <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/40 backdrop-blur-md overflow-hidden">
          {/* Main Beam */}
          <div className="w-16 h-64 bg-cyan-500/20 [clip-path:polygon(20%_0,80%_0,100%_100%,0%_100%)] absolute top-0 blur-sm"></div>
          
          {/* Side Lobes */}
          <div className="w-64 h-48 bg-cyan-500/10 [clip-path:polygon(50%_0,100%_100%,0%_100%)] absolute top-0 rotate-12 origin-top blur-md"></div>
          <div className="w-64 h-48 bg-cyan-500/10 [clip-path:polygon(50%_0,100%_100%,0%_100%)] absolute top-0 -rotate-12 origin-top blur-md"></div>

          {/* Reflector in Side Lobe */}
          <div className="absolute top-1/2 right-12 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white] animate-pulse">
             <div className="absolute -bottom-4 -right-4 text-[8px] text-slate-400 w-24">Strong Reflector (Off-Axis)</div>
          </div>
          
          {/* Artifact in Main Beam */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/30 rounded-full border border-dashed border-white">
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-red-400">Artifact</div>
          </div>
          
          <div className="absolute bottom-4 bg-black/60 px-4 py-2 rounded-xl border border-white/10">
             <p className="text-[10px] text-slate-300 text-center">
                Machine assumes all echoes come from the MAIN beam axis.<br/>
                <span className="text-cyan-400">Apodization</span> reduces this effect.
             </p>
          </div>
       </div>
    </VisualContainer>
  );
};

// Topic: Physics - Snells Law Refraction
export const RefractionVisual: React.FC = () => {
    // A simplified visual for refraction specifically showing the "bent pencil" effect or lateral displacement
    return (
        <VisualContainer title="Refraction (Lateral Displacement)">
            <div className="flex flex-col items-center justify-center h-full relative">
                <div className="absolute top-0 w-full h-1/2 bg-slate-800/50 flex items-center justify-center">
                    <span className="text-slate-500 text-xs">Tissue 1 (c = 1540 m/s)</span>
                </div>
                <div className="absolute bottom-0 w-full h-1/2 bg-slate-700/50 flex items-center justify-center">
                    <span className="text-slate-500 text-xs">Tissue 2 (c = 2000 m/s)</span>
                </div>
                
                {/* The "Real" Structure */}
                <div className="absolute bottom-10 right-1/3 w-4 h-4 bg-green-500 rounded-full"></div>
                
                {/* The Beam Path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M 150 0 L 150 150 L 200 250" stroke="#22d3ee" strokeWidth="2" fill="none" />
                    <path d="M 150 150 L 150 250" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" fill="none" />
                </svg>
                
                {/* The Ghost */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500/50 rounded-full border border-dashed border-red-500">
                     <span className="absolute -bottom-4 text-[8px] text-red-400 whitespace-nowrap">Ghost (Refraction)</span>
                </div>
            </div>
        </VisualContainer>
    )
}

// --- PLACEHOLDER ---
const PlaceholderVisual: React.FC<{ name: string }> = ({ name }) => (
  <VisualContainer title={`${name} (Coming Soon)`}>
    <div className="flex flex-col items-center justify-center h-full space-y-4 text-slate-500">
      <RotateCcw className="animate-spin-slow w-12 h-12 opacity-20" />
      <p className="text-xs uppercase tracking-widest">Simulation Under Construction</p>
    </div>
  </VisualContainer>
);

export const VisualRegistry: Record<string, React.FC> = {
  'LongitudinalWaveVisual': LongitudinalWaveVisual,
  'WaveParametersVisual': WaveParametersVisual,
  'PulseEchoPrincipleVisual': PulseEchoPrincipleVisual,
  'DopplerPrincipleVisual': DopplerPrincipleVisual,
  'TransducerAnatomyVisual': TransducerAnatomyVisual,
  'AxialResolutionVisual': AxialResolutionVisual,
  'LateralResolutionVisual': LateralResolutionVisual,
  'BioeffectMechanismsVisual': BioeffectMechanismsVisual,
  'PropagationArtifactsVisual': PropagationArtifactsVisual,
  'AttenuationArtifactsVisual': AttenuationArtifactsVisual,

  // Newly Implemented
  'TissueInteractionVisual': TissueInteractionVisual,
  'ArrayTypesVisual': ArrayTypesVisual,
  'BeamFocusingVisual': BeamFocusingVisual,
  'DopplerModesVisual': DopplerModesVisual,
  'FlowPatternsVisual': FlowPatternsVisual,
  'PhysicalPrinciplesVisual': PhysicalPrinciplesVisual,
  'QaPhantomVisual': QaPhantomVisual,
  'NonLinearPropagationVisual': NonLinearPropagationVisual,
  'HarmonicImagingVisual': HarmonicImagingVisual,
  'DynamicRangeVisual': DynamicRangeVisual,
  'BModeVisual': BModeVisual,
  'DecibelVisual': DecibelVisual,
  'TGCVisual': TGCVisual,
  'MModeVisual': MModeVisual,
  'PiezoVisual': PiezoVisual,
  
  // Artifacts & New Additions
  'MirrorImageArtifactVisual': MirrorImageArtifactVisual,
  'AliasingVisual': AliasingVisual,
  'SideLobesVisual': SideLobesVisual,
  'RefractionVisual': RefractionVisual,

  // Aliases / Remaining
  'SafetyIndicesVisual': BioeffectMechanismsVisual, // Reuse the MI visual
};
