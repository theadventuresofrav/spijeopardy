import React, { useState, useEffect } from 'react';
import { Search, Calculator, ChevronRight, X, FunctionSquare, Zap, Activity, AlertTriangle, Scan, Brain, BookOpen, GraduationCap } from 'lucide-react';
import { generateExplanation } from '../services/geminiService';
import { 
  WaveParametersVisual, 
  PulseEchoPrincipleVisual, 
  DopplerPrincipleVisual, 
  AxialResolutionVisual, 
  LateralResolutionVisual, 
  BioeffectMechanismsVisual,
  FlowPatternsVisual
} from './CourseVisuals';

interface Formula {
  name: string;
  equation: string;
  variables: { symbol: string; meaning: string }[];
  description: string;
  category: 'General Physics' | 'Doppler' | 'Resolution' | 'Hemodynamics' | 'Bioeffects' | 'Attenuation' | 'Transducers';
  mnemonic?: string;
  visual?: React.ReactNode;
  interactive?: {
    inputs: { symbol: string; label: string; unit: string; defaultValue: number }[];
    output: { symbol: string; label: string; unit: string };
    calculate: (values: Record<string, number>) => number;
  };
}

const FORMULA_DATA: Formula[] = [
  {
    name: "Frequency & Period",
    equation: "P = 1 / f  OR  f = 1 / P",
    variables: [
      { symbol: "P", meaning: "Period (seconds)" },
      { symbol: "f", meaning: "Frequency (Hz)" }
    ],
    description: "Frequency and Period are reciprocals. As frequency increases, period decreases.",
    category: "General Physics",
    visual: <WaveParametersVisual />,
    interactive: {
      inputs: [{ symbol: 'f', label: 'Frequency', unit: 'MHz', defaultValue: 5 }],
      output: { symbol: 'P', label: 'Period', unit: 'µs' },
      calculate: (vals) => 1 / vals['f']
    }
  },
  {
    name: "Propagation Speed",
    equation: "c = f × λ",
    variables: [
      { symbol: "c", meaning: "Propagation Speed (m/s)" },
      { symbol: "f", meaning: "Frequency (Hz)" },
      { symbol: "λ", meaning: "Wavelength (m)" }
    ],
    description: "Speed is determined by the medium (stiffness and density). In soft tissue, average speed is 1,540 m/s.",
    category: "General Physics",
    visual: (
      <div className="w-full h-24 bg-slate-900/50 rounded-lg border border-white/10 flex items-end justify-around p-4">
        <div className="flex flex-col items-center gap-2 group">
           <div className="w-8 bg-cyan-500/30 rounded-t-lg transition-all group-hover:bg-cyan-500/50" style={{ height: '30%' }}></div>
           <span className="text-[10px] text-slate-400">Lung (Slow)</span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
           <div className="w-8 bg-cyan-500/60 rounded-t-lg transition-all group-hover:bg-cyan-500/80" style={{ height: '60%' }}></div>
           <span className="text-[10px] text-slate-400">Tissue (Avg)</span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
           <div className="w-8 bg-cyan-500 rounded-t-lg transition-all group-hover:bg-cyan-400" style={{ height: '90%' }}></div>
           <span className="text-[10px] text-slate-400">Bone (Fast)</span>
        </div>
      </div>
    ),
    interactive: {
      inputs: [
        { symbol: 'f', label: 'Frequency', unit: 'Hz', defaultValue: 1000 },
        { symbol: 'λ', label: 'Wavelength', unit: 'm', defaultValue: 1.54 }
      ],
      output: { symbol: 'c', label: 'Speed', unit: 'm/s' },
      calculate: (vals) => vals['f'] * vals['λ']
    }
  },
  {
    name: "Wavelength",
    equation: "λ = c / f",
    variables: [
      { symbol: "λ", meaning: "Wavelength (mm)" },
      { symbol: "c", meaning: "Propagation Speed (mm/µs)" },
      { symbol: "f", meaning: "Frequency (MHz)" }
    ],
    description: "In soft tissue (c = 1.54 mm/µs), λ = 1.54 / f.",
    category: "General Physics",
    visual: <WaveParametersVisual />,
    interactive: {
      inputs: [
        { symbol: 'c', label: 'Speed', unit: 'mm/µs', defaultValue: 1.54 },
        { symbol: 'f', label: 'Frequency', unit: 'MHz', defaultValue: 5 }
      ],
      output: { symbol: 'λ', label: 'Wavelength', unit: 'mm' },
      calculate: (vals) => vals['c'] / vals['f']
    }
  },
  {
    name: "Impedance",
    equation: "Z = ρ × c",
    variables: [
      { symbol: "Z", meaning: "Impedance (Rayls)" },
      { symbol: "ρ", meaning: "Density (kg/m³)" },
      { symbol: "c", meaning: "Propagation Speed (m/s)" }
    ],
    description: "Impedance is the acoustic resistance to sound traveling in a medium.",
    category: "General Physics",
    visual: (
      <div className="w-full h-32 bg-slate-900/50 rounded-lg border border-white/10 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Medium 1 */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-cyan-900/20 border-r border-white/20 flex items-center justify-center">
           <span className="text-[10px] text-cyan-300 font-mono">Medium 1 (Z1)</span>
        </div>
        {/* Medium 2 */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-emerald-900/20 flex items-center justify-center">
           <span className="text-[10px] text-emerald-300 font-mono">Medium 2 (Z2)</span>
        </div>
        
        {/* Incident Wave */}
        <div className="absolute top-1/2 left-4 w-1/3 h-0.5 bg-yellow-400 -translate-y-1/2">
           <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-yellow-400 rotate-45"></div>
        </div>
        
        {/* Reflection Point Animation */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/50 rounded-full animate-ping"></div>
        
        {/* Reflected Wave (Smaller) */}
        <div className="absolute top-[60%] left-1/4 w-1/4 h-0.5 bg-red-400 -translate-y-1/2 rotate-180 opacity-60">
           <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-red-400 rotate-45"></div>
        </div>
         {/* Transmitted Wave (Continued) */}
        <div className="absolute top-1/2 right-4 w-1/3 h-0.5 bg-yellow-400 -translate-y-1/2 opacity-80">
           <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-yellow-400 rotate-45"></div>
        </div>
      </div>
    )
  },
  {
    name: "Pulse Repetition Frequency & Depth",
    equation: "PRF × Depth_max = 77,000 cm/s",
    variables: [
      { symbol: "PRF", meaning: "Pulse Repetition Frequency (Hz)" },
      { symbol: "Depth_max", meaning: "Maximum Imaging Depth (cm)" }
    ],
    description: "PRF and Depth are inversely related. Deeper imaging requires a lower PRF.",
    category: "General Physics",
    visual: <PulseEchoPrincipleVisual />
  },
  {
    name: "Duty Factor",
    equation: "DF = (PD / PRP) × 100",
    variables: [
      { symbol: "DF", meaning: "Duty Factor (%)" },
      { symbol: "PD", meaning: "Pulse Duration (µs)" },
      { symbol: "PRP", meaning: "Pulse Repetition Period (µs)" }
    ],
    description: "The percentage of time the system is transmitting sound. For clinical imaging, DF is < 1%.",
    category: "General Physics",
    visual: (
      <div className="w-full h-24 bg-slate-900/50 rounded-lg border border-white/10 flex items-center justify-center p-4">
        <div className="w-full h-1 bg-slate-700 relative">
          <div className="absolute left-0 w-[1%] h-4 -top-1.5 bg-cyan-500 rounded-sm"></div>
          <div className="absolute left-0 top-6 text-[10px] text-cyan-400 font-mono">PD (On)</div>
          <div className="absolute left-[10%] top-6 text-[10px] text-slate-500 font-mono">Listening (Off)</div>
        </div>
      </div>
    )
  },
  {
    name: "Axial Resolution",
    equation: "LARRD = SPL / 2",
    variables: [
      { symbol: "LARRD", meaning: "Longitudinal, Axial, Range, Radial, Depth Resolution (mm)" },
      { symbol: "SPL", meaning: "Spatial Pulse Length (mm)" }
    ],
    description: "Shorter pulses provide better axial resolution. High frequency and damping improve this.",
    category: "Resolution",
    visual: <AxialResolutionVisual />
  },
  {
    name: "Spatial Pulse Length",
    equation: "SPL = n × λ",
    variables: [
      { symbol: "SPL", meaning: "Spatial Pulse Length (mm)" },
      { symbol: "n", meaning: "Number of cycles in a pulse" },
      { symbol: "λ", meaning: "Wavelength (mm)" }
    ],
    description: "SPL determines axial resolution.",
    category: "Resolution",
    visual: (
       <div className="w-full h-24 bg-slate-900/50 rounded-lg border border-white/10 flex items-center justify-center p-4">
         <div className="flex items-center">
            <svg viewBox="0 0 200 50" className="w-48 h-12">
               <path d="M0 25 Q 10 5 20 25 T 40 25 T 60 25" fill="none" stroke="#06b6d4" strokeWidth="2" />
               <line x1="0" y1="40" x2="60" y2="40" stroke="#cbd5e1" strokeWidth="1" />
               <text x="30" y="48" fill="#cbd5e1" fontSize="10" textAnchor="middle">SPL</text>
            </svg>
         </div>
       </div>
    )
  },
  {
    name: "Lateral Resolution",
    equation: "LATA = Beam Diameter",
    variables: [
      { symbol: "LATA", meaning: "Lateral, Angular, Transverse, Azimuthal Resolution (mm)" }
    ],
    description: "Lateral resolution is best at the focus where the beam is narrowest.",
    category: "Resolution",
    visual: <LateralResolutionVisual />
  },
  {
    name: "Doppler Shift",
    equation: "fD = (2 × f0 × v × cosθ) / c",
    variables: [
      { symbol: "fD", meaning: "Doppler Shift (Hz)" },
      { symbol: "f0", meaning: "Operating Frequency (Hz)" },
      { symbol: "v", meaning: "Velocity of blood (m/s)" },
      { symbol: "cosθ", meaning: "Cosine of the insonation angle" },
      { symbol: "c", meaning: "Propagation Speed (m/s)" }
    ],
    description: "The change in frequency due to motion. Angle θ is critical; cos(90°) = 0 (no Doppler shift).",
    category: "Doppler",
    visual: <DopplerPrincipleVisual />
  },
  {
    name: "Nyquist Limit",
    equation: "Nyquist = PRF / 2",
    variables: [
      { symbol: "Nyquist", meaning: "Nyquist Limit (Hz)" },
      { symbol: "PRF", meaning: "Pulse Repetition Frequency (Hz)" }
    ],
    description: "The highest Doppler frequency that can be measured without aliasing.",
    category: "Doppler",
    visual: <DopplerPrincipleVisual />
  },
  {
    name: "Resistive Index (RI)",
    equation: "RI = (PSV - EDV) / PSV",
    variables: [
      { symbol: "RI", meaning: "Resistive Index (unitless)" },
      { symbol: "PSV", meaning: "Peak Systolic Velocity" },
      { symbol: "EDV", meaning: "End Diastolic Velocity" }
    ],
    description: "Used to evaluate vascular resistance.",
    category: "Hemodynamics",
    visual: (
       <div className="w-full h-32 bg-slate-900/50 rounded-lg border border-white/10 flex items-end justify-between p-4 px-8 relative overflow-hidden">
          {/* Waveform */}
          <svg viewBox="0 0 100 50" className="w-full h-full absolute inset-0" preserveAspectRatio="none">
             <path d="M0,50 L10,10 L15,20 L25,50 L35,10 L40,20 L50,50 L60,10 L65,20 L75,50 L85,10 L90,20 L100,50" fill="none" stroke="#ef4444" strokeWidth="1" className="opacity-50" />
             <path d="M0,50 L10,10 L15,20 L25,50" fill="url(#grad1)" stroke="#ef4444" strokeWidth="2" />
             <defs>
               <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                 <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
               </linearGradient>
             </defs>
          </svg>
          {/* Labels */}
          <div className="absolute top-[20%] left-[10%] text-[8px] text-white bg-red-600 px-1 rounded">PSV</div>
          <div className="absolute bottom-[5%] left-[25%] text-[8px] text-white bg-blue-600 px-1 rounded">EDV</div>
          {/* Arrow */}
          <div className="absolute right-4 top-4 text-[10px] text-slate-400 font-mono w-24">
             High Resistance = Low EDV
          </div>
       </div>
    )
  },
  {
    name: "Pulsatility Index (PI)",
    equation: "PI = (PSV - EDV) / Mean Velocity",
    variables: [
      { symbol: "PI", meaning: "Pulsatility Index (unitless)" },
      { symbol: "PSV", meaning: "Peak Systolic Velocity" },
      { symbol: "EDV", meaning: "End Diastolic Velocity" }
    ],
    description: "Another measure of vascular resistance/pulsatility.",
    category: "Hemodynamics"
  },
  {
    name: "Bernoulli Equation (Simplified)",
    equation: "ΔP = 4 × v²",
    variables: [
      { symbol: "ΔP", meaning: "Pressure Gradient (mmHg)" },
      { symbol: "v", meaning: "Maximum Velocity (m/s)" }
    ],
    description: "Used to estimate pressure gradients across stenotic valves.",
    category: "Hemodynamics"
  },
  {
    name: "Continuity Equation",
    equation: "A1 × v1 = A2 × v2",
    variables: [
      { symbol: "A", meaning: "Area" },
      { symbol: "v", meaning: "Velocity" }
    ],
    description: "Flow rate is constant. If area decreases (stenosis), velocity must increase.",
    category: "Hemodynamics",
    visual: (
       <div className="w-full h-32 bg-slate-900/50 rounded-lg border border-white/10 flex items-center justify-center p-4">
          <svg viewBox="0 0 300 100" className="w-full h-full opacity-80">
             {/* Pipe */}
             <path d="M0 20 L 100 20 L 150 40 L 300 40" stroke="#475569" strokeWidth="2" fill="none" />
             <path d="M0 80 L 100 80 L 150 60 L 300 60" stroke="#475569" strokeWidth="2" fill="none" />
             
             {/* Flow arrows */}
             <line x1="20" y1="50" x2="80" y2="50" stroke="#06b6d4" strokeWidth="2" />
             <polygon points="80,50 75,47 75,53" fill="#06b6d4" />
             <text x="50" y="40" fill="#06b6d4" fontSize="12" textAnchor="middle">v1</text>
             
             <line x1="170" y1="50" x2="280" y2="50" stroke="#ef4444" strokeWidth="2" />
             <polygon points="280,50 275,47 275,53" fill="#ef4444" />
             <text x="225" y="40" fill="#ef4444" fontSize="12" textAnchor="middle">v2 (Fast)</text>
          </svg>
       </div>
    )
  },
  {
    name: "Mechanical Index (MI)",
    equation: "MI = Peak Rarefactional Pressure / √f",
    variables: [
      { symbol: "MI", meaning: "Mechanical Index" },
      { symbol: "f", meaning: "Frequency (MHz)" }
    ],
    description: "Predicts the likelihood of cavitation (bioeffects). Lower frequency and higher pressure increase MI.",
    category: "Bioeffects",
    visual: (
       <div className="w-full h-24 bg-slate-900/50 rounded-lg border border-white/10 flex items-center justify-center p-4 gap-4">
          {/* Gauge */}
          <div className="relative w-20 h-10 overflow-hidden">
             <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-[6px] border-slate-700 border-b-0 border-l-0 -rotate-45"></div>
             <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-[6px] border-transparent border-t-emerald-500 rotate-[45deg]"></div>
             <div className="absolute bottom-0 left-1/2 w-1 h-10 bg-white origin-bottom rotate-[-30deg] transition-transform animate-[wiggle_2s_infinite]"></div>
          </div>
          <div className="flex flex-col">
             <span className="text-xs font-bold text-white">Safety Zone</span>
             <span className="text-[10px] text-slate-400">Keep MI &lt; 1.9</span>
          </div>
       </div>
    )
  },
  {
    name: "Thermal Index (TI)",
    equation: "TI = Output Power / Power to raise temp 1°C",
    variables: [
      { symbol: "TI", meaning: "Thermal Index" }
    ],
    description: "Predicts the potential for tissue heating. TIS (Soft Tissue), TIB (Bone), TIC (Cranial Bone).",
    category: "Bioeffects",
    visual: (
       <div className="w-full h-24 bg-slate-900/50 rounded-lg border border-white/10 flex items-center justify-center p-4 gap-4">
          <div className="flex flex-col items-center gap-1">
             <div className="w-8 h-12 bg-slate-800 rounded-full border border-slate-600 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-600 to-yellow-500 h-[60%] animate-pulse"></div>
             </div>
             <span className="text-[10px] text-slate-400">Temp</span>
          </div>
          <div className="text-xs text-slate-300 max-w-[150px]">
             Max rise &lt; 2°C is generally safe.
             <div className="w-full h-1 bg-slate-700 mt-1 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-yellow-500"></div>
             </div>
          </div>
       </div>
    )
  },
  {
    name: "Attenuation Coefficient",
    equation: "att coeff (dB/cm) = f (MHz) / 2",
    variables: [
      { symbol: "att coeff", meaning: "Attenuation Coefficient (dB/cm)" },
      { symbol: "f", meaning: "Frequency (MHz)" }
    ],
    description: "The amount of attenuation per centimeter of tissue. In soft tissue, it is approximately 0.5 dB/cm/MHz.",
    category: "Attenuation",
    interactive: {
      inputs: [
        { symbol: "f", label: "Frequency", unit: "MHz", defaultValue: 5 }
      ],
      output: { symbol: "att coeff", label: "Atten. Coeff", unit: "dB/cm" },
      calculate: (vals) => vals.f / 2
    }
  },
  {
    name: "Total Attenuation",
    equation: "Total Att (dB) = att coeff × distance",
    variables: [
      { symbol: "Total Att", meaning: "Total Attenuation (dB)" },
      { symbol: "att coeff", meaning: "Attenuation Coefficient (dB/cm)" },
      { symbol: "distance", meaning: "Path Length (cm)" }
    ],
    description: "The total loss of sound intensity as it travels through tissue.",
    category: "Attenuation",
    interactive: {
      inputs: [
        { symbol: "ac", label: "Atten. Coeff.", unit: "dB/cm", defaultValue: 2.5 },
        { symbol: "d", label: "Distance", unit: "cm", defaultValue: 10 }
      ],
      output: { symbol: "Total Att", label: "Total Atten.", unit: "dB" },
      calculate: (vals) => vals.ac * vals.d
    }
  },
  {
    name: "Half Value Layer (HVL)",
    equation: "HVL = 3 / att coeff",
    variables: [
      { symbol: "HVL", meaning: "Half Value Layer (cm)" },
      { symbol: "att coeff", meaning: "Attenuation Coefficient (dB/cm)" }
    ],
    description: "The depth at which intensity is reduced to half (-3dB).",
    category: "Attenuation",
    interactive: {
      inputs: [
        { symbol: "ac", label: "Atten. Coeff.", unit: "dB/cm", defaultValue: 2.5 }
      ],
      output: { symbol: "HVL", label: "HVL", unit: "cm" },
      calculate: (vals) => 3 / vals.ac
    }
  },
  {
    name: "Q Factor",
    equation: "Q = Main Freq / Bandwidth",
    variables: [
      { symbol: "Q", meaning: "Quality Factor (unitless)" },
      { symbol: "Main Freq", meaning: "Resonant Frequency (MHz)" },
      { symbol: "Bandwidth", meaning: "Range of Frequencies (MHz)" }
    ],
    description: "Describes the purity of the beam. Imaging probes have Low Q (wide bandwidth) for short pulses.",
    category: "Transducers",
    interactive: {
      inputs: [
        { symbol: "f", label: "Frequency", unit: "MHz", defaultValue: 5 },
        { symbol: "bw", label: "Bandwidth", unit: "MHz", defaultValue: 4 }
      ],
      output: { symbol: "Q", label: "Q Factor", unit: "" },
      calculate: (vals) => vals.f / vals.bw
    }
  }
];

interface FormulaHubScreenProps {
  onBack?: () => void;
}

const FormulaHubScreen: React.FC<FormulaHubScreenProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [calcValues, setCalcValues] = useState<Record<string, number>>({});
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanationMode, setExplanationMode] = useState<'explain' | 'problem'>('explain');

  useEffect(() => {
    setAiExplanation(null);
    if (selectedFormula?.interactive) {
      const defaults: Record<string, number> = {};
      selectedFormula.interactive.inputs.forEach(inp => {
        defaults[inp.symbol] = inp.defaultValue;
      });
      setCalcValues(defaults);
    }
  }, [selectedFormula]);

  const handleCalcChange = (symbol: string, val: string) => {
    const num = parseFloat(val);
    setCalcValues(prev => ({ ...prev, [symbol]: isNaN(num) ? 0 : num }));
  };

  const handleAiAction = async (mode: 'explain' | 'problem') => {
    if (!selectedFormula) return;
    setIsGenerating(true);
    setExplanationMode(mode);
    setAiExplanation(null);
    try {
      const text = await generateExplanation(selectedFormula.name, selectedFormula.description, mode);
      setAiExplanation(text);
    } catch (e) {
      setAiExplanation("Error connecting to Neural Uplink.");
    } finally {
      setIsGenerating(false);
    }
  };

  const categories = Array.from(new Set(FORMULA_DATA.map(item => item.category)));

  const filteredFormulas = FORMULA_DATA.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 md:p-8 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl z-20 sticky top-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <FunctionSquare className="text-cyan-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-cinzel font-black text-white tracking-widest uppercase">Formula Hub</h1>
              <p className="text-xs text-cyan-500/60 font-mono uppercase tracking-widest">Physics & Instrumentation Math</p>
            </div>
          </div>
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
              <X size={24} className="text-slate-400 group-hover:text-white transition-colors" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search equations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${!selectedCategory ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative z-10">
        {/* Formula List - Now a Grid */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar ${selectedFormula ? 'hidden md:block md:w-1/3 md:flex-none' : 'block'}`}>
          {filteredFormulas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 opacity-50">
               <Calculator size={48} className="mb-4" />
               <p className="text-sm font-mono uppercase tracking-widest">No matching formulas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredFormulas.map((item, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedFormula(item)}
                  className={`group relative text-left p-4 md:p-5 rounded-xl border transition-all duration-300 ${selectedFormula?.name === item.name ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'bg-slate-900/40 border-white/5 hover:border-cyan-500/30 hover:bg-white/5'}`}
                >
                   {/* Tech Decorators */}
                   <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${selectedFormula?.name === item.name ? 'bg-cyan-500' : 'bg-transparent group-hover:bg-cyan-500/50'}`}></div>
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={14} className="text-cyan-500" />
                   </div>

                   <div className="pl-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-widest py-0.5 px-2 rounded-full border ${
                          item.category === 'General Physics' ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' :
                          item.category === 'Doppler' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                          item.category === 'Hemodynamics' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                          'text-amber-400 border-amber-500/20 bg-amber-500/10'
                        }`}>
                          {item.category}
                        </span>
                        {item.visual && <Zap size={10} className="text-cyan-400 animate-pulse" />}
                      </div>
                      <h3 className={`font-cinzel font-bold text-lg md:text-xl transition-colors ${selectedFormula?.name === item.name ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{item.name}</h3>
                      <div className="font-mono text-xs text-slate-500 mt-2 bg-black/40 inline-block px-2 py-1 rounded border border-white/5">{item.equation}</div>
                   </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail View */}
        <div className={`flex-[2] bg-slate-900/80 backdrop-blur-xl border-l border-white/10 flex flex-col relative overflow-hidden transition-all duration-500 ${selectedFormula ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute inset-0 md:relative md:translate-x-0 md:opacity-100'}`}>
           {selectedFormula ? (
             <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
                {/* Detail Header */}
                <div className="p-6 md:p-10 border-b border-white/10 bg-black/20 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,211,238,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]"></div>
                   
                   <button onClick={() => setSelectedFormula(null)} className="md:hidden absolute top-4 left-4 p-2 bg-white/5 rounded-full text-slate-400 hover:text-white z-20">
                      <ChevronRight className="rotate-180" size={20} />
                   </button>

                   <div className="relative z-10 mt-8 md:mt-0">
                      <div className="flex items-center space-x-3 mb-4">
                         <span className="text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded border border-cyan-500/30 text-cyan-400">
                           {selectedFormula.category}
                         </span>
                         <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-cinzel font-black text-white mb-6 leading-tight drop-shadow-lg">{selectedFormula.name}</h2>
                      
                      {/* Equation Display */}
                      <div className="bg-black/60 rounded-xl border border-cyan-500/30 p-6 md:p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)] relative overflow-hidden group">
                         <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                         <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg"></div>
                         <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg"></div>
                         <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg"></div>
                         <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg"></div>
                         
                         <p className="text-2xl md:text-4xl font-mono text-center text-cyan-300 tracking-wider font-bold relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{selectedFormula.equation}</p>
                      </div>
                   </div>
                </div>

                {/* Detail Body */}
                <div className="p-6 md:p-10 space-y-8 flex-1">
                   {/* Visual / Simulation */}
                   {selectedFormula.visual ? (
                     <div className="w-full bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative group">
                        <div className="absolute top-3 left-3 z-10 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                           <Activity size={12} className="text-emerald-400 animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Simulation</span>
                        </div>
                        <div className="p-8 md:p-12 flex items-center justify-center min-h-[250px]">
                           {selectedFormula.visual}
                        </div>
                     </div>
                   ) : (
                     <div className="w-full h-48 rounded-2xl border border-white/5 bg-black/40 flex flex-col items-center justify-center">
                        <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">No Visual Data Available</p>
                     </div>
                   )}

                   {/* Calculator */}
                   {selectedFormula.interactive && (
                    <div className="bg-slate-900/60 rounded-2xl border border-emerald-500/20 p-6 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-20">
                          <Calculator size={64} className="text-emerald-500" />
                      </div>
                      
                      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4 relative z-10">
                        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                           <Calculator className="text-emerald-400" size={18} />
                        </div>
                        <div>
                           <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Interactive Calculator</h3>
                           <p className="text-[10px] text-slate-500 font-mono">Input values to simulate clinical scenarios</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
                        {selectedFormula.interactive.inputs.map(inp => (
                          <div key={inp.symbol} className="flex flex-col gap-2 group">
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">{inp.label} ({inp.symbol})</label>
                            <div className="relative">
                              <input 
                                type="number" 
                                value={calcValues[inp.symbol] || ''} 
                                onChange={(e) => handleCalcChange(inp.symbol, e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white font-mono text-sm focus:border-emerald-500/50 outline-none focus:bg-emerald-500/5 transition-all focus:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">{inp.unit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between relative z-10">
                         <span className="text-emerald-200/60 text-xs font-bold uppercase tracking-widest">Calculated Result</span>
                         <div className="text-3xl font-mono font-bold text-emerald-400 flex items-baseline drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                           {selectedFormula.interactive.calculate(calcValues).toLocaleString(undefined, { maximumFractionDigits: 4 })} 
                           <span className="text-sm text-emerald-600 ml-2 font-bold">{selectedFormula.interactive.output.unit}</span>
                         </div>
                      </div>
                    </div>
                   )}
                   
                   {/* Description & Variables */}
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 prose prose-invert prose-sm max-w-none">
                         <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                            <Scan size={14} />
                            Concept Definition
                         </h4>
                         <p className="text-slate-300 leading-relaxed text-lg">{selectedFormula.description}</p>
                         
                         {selectedFormula.mnemonic && (
                           <div className="mt-6 flex items-start space-x-4 bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
                              <Zap className="text-yellow-500 mt-1 shrink-0" size={18} />
                              <div>
                                 <h5 className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-1">Mnemonic</h5>
                                 <p className="text-yellow-100/80 italic">"{selectedFormula.mnemonic}"</p>
                              </div>
                           </div>
                         )}

                         {/* Neural Uplink Section */}
                         <div className="mt-8 pt-8 border-t border-white/10">
                            <h4 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
                               <Brain size={14} />
                               Neural Uplink
                            </h4>
                            
                            <div className="flex gap-3 mb-4">
                               <button 
                                 onClick={() => handleAiAction('explain')}
                                 disabled={isGenerating}
                                 className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-500/20 transition-all disabled:opacity-50"
                               >
                                  <BookOpen size={14} />
                                  Explain Concept
                               </button>
                               <button 
                                 onClick={() => handleAiAction('problem')}
                                 disabled={isGenerating}
                                 className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-xs font-bold uppercase tracking-wider text-purple-300 hover:bg-purple-500/20 transition-all disabled:opacity-50"
                               >
                                  <GraduationCap size={14} />
                                  Practice Problem
                               </button>
                            </div>

                            {isGenerating && (
                               <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-center gap-3 animate-pulse">
                                  <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-xs font-mono text-cyan-400">Accessing Neural Archive...</span>
                               </div>
                            )}

                            {aiExplanation && !isGenerating && (
                               <div className={`p-6 rounded-xl border relative overflow-hidden ${explanationMode === 'explain' ? 'bg-cyan-950/20 border-cyan-500/20' : 'bg-purple-950/20 border-purple-500/20'}`}>
                                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>
                                  <h5 className={`text-xs font-black uppercase tracking-widest mb-3 ${explanationMode === 'explain' ? 'text-cyan-400' : 'text-purple-400'}`}>
                                     {explanationMode === 'explain' ? 'Simplified Explanation' : 'Generated Problem'}
                                  </h5>
                                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-line">
                                     {aiExplanation}
                                  </div>
                               </div>
                            )}
                         </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-xl border border-white/5 p-6 h-fit backdrop-blur-sm">
                         <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 pb-2 border-b border-white/10">Variables</h4>
                         <div className="space-y-3">
                            {selectedFormula.variables.map((v, idx) => (
                                <div key={idx} className="flex items-baseline space-x-3 text-sm group">
                                    <span className="font-mono text-cyan-400 font-bold min-w-[30px] text-right group-hover:text-cyan-300 transition-colors drop-shadow-sm">{v.symbol}</span>
                                    <span className="text-slate-600">=</span>
                                    <span className="text-slate-300 leading-tight">{v.meaning}</span>
                                </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="hidden md:flex flex-col items-center justify-center h-full text-slate-600 opacity-30 select-none">
                <FunctionSquare size={120} strokeWidth={0.5} />
                <h3 className="mt-8 text-2xl font-cinzel font-black uppercase tracking-[0.5em]">Select Formula</h3>
                <p className="mt-2 font-mono text-xs">Waiting for operator input...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default FormulaHubScreen;