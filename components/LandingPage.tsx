import React, { useState } from 'react';
import { 
  Cpu, Zap, Database, Brain, ChevronRight, Activity, Shield, 
  Layers, Radio, Globe, CheckCircle2, XCircle, Terminal, 
  BarChart3, User, BookOpen, AlertTriangle, ArrowRight, Play
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

interface LandingPageProps {
  onStart: () => void;
  onDemo?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onDemo }) => {
  const [activeModule, setActiveModule] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#030305] text-white overflow-y-auto overflow-x-hidden relative font-sans selection:bg-cyan-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#030305] to-black opacity-80"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto border-b border-white/5 bg-[#030305]/80 backdrop-blur-md sticky top-0">
        <div className="flex items-center space-x-2">
          <Activity className="text-cyan-500" />
          <span className="font-cinzel font-black text-xl tracking-widest">ECHO<span className="text-cyan-500">JEOPARDY</span></span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-slate-400">
           <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
           <a href="#curriculum" className="hover:text-cyan-400 transition-colors">Curriculum</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-5 py-2 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)]">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <button 
              onClick={onStart}
              className="hidden md:flex items-center space-x-2 px-6 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-full transition-all text-xs font-bold uppercase tracking-widest mr-4"
            >
              <span>System Online</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            </button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Zap size={12} />
          <span>AI-Powered Ultrasound Education</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-cinzel font-black tracking-tighter mb-8 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Master Physics. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Defeat the Machine.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          The ultimate SPI Registry prep tool. Immerse yourself in a cyberpunk Jeopardy simulation hosted by adaptive AI personalities. 
          <span className="block mt-4 text-slate-500 text-base">Forget boring textbooks. Welcome to the future of sonography.</span>
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_40px_rgba(8,145,178,0.4)] hover:shadow-[0_0_60px_rgba(8,145,178,0.6)] w-full md:w-auto overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>Initialize Matrix</span>
              <ChevronRight size={16} />
            </span>
          </button>

          {onDemo && (
            <button 
              onClick={onDemo}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm uppercase tracking-[0.2em] rounded-xl transition-all w-full md:w-auto flex items-center justify-center space-x-2 hover:border-cyan-500/50 hover:text-cyan-400 group"
            >
              <div className="relative">
                 <Brain size={16} className="text-cyan-500 group-hover:animate-pulse" />
                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
              </div>
              <span>Watch AI Simulation</span>
            </button>
          )}
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="relative z-10 py-24 bg-slate-900/30 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-cinzel font-black mb-4">Why Traditional Study Fails</h2>
               <p className="text-slate-400">Stop memorizing. Start understanding.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* The Old Way */}
               <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/10 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-red-500/20">
                     <XCircle size={100} />
                  </div>
                  <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center">
                     <XCircle className="mr-3" size={24} />
                     The Old Way
                  </h3>
                  <ul className="space-y-4 text-slate-400">
                     <li className="flex items-start">
                        <span className="mr-3 text-red-500/50">×</span>
                        Passive reading of dry textbooks
                     </li>
                     <li className="flex items-start">
                        <span className="mr-3 text-red-500/50">×</span>
                        Rote memorization of formulas without context
                     </li>
                     <li className="flex items-start">
                        <span className="mr-3 text-red-500/50">×</span>
                        Static diagrams that don't explain motion
                     </li>
                     <li className="flex items-start">
                        <span className="mr-3 text-red-500/50">×</span>
                        Zero feedback on *why* you got it wrong
                     </li>
                  </ul>
               </div>

               {/* The Echo Way */}
               <div className="p-8 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-cyan-500/20">
                     <CheckCircle2 size={100} />
                  </div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center">
                     <CheckCircle2 className="mr-3" size={24} />
                     The Echo Way
                  </h3>
                  <ul className="space-y-4 text-slate-300">
                     <li className="flex items-start">
                        <span className="mr-3 text-cyan-500">✓</span>
                        Gamified "Jeopardy" style active recall
                     </li>
                     <li className="flex items-start">
                        <span className="mr-3 text-cyan-500">✓</span>
                        Interactive physics simulators (Snell's Law, Doppler)
                     </li>
                     <li className="flex items-start">
                        <span className="mr-3 text-cyan-500">✓</span>
                        AI Personalities that adapt to your weakness
                     </li>
                     <li className="flex items-start">
                        <span className="mr-3 text-cyan-500">✓</span>
                        "Holy Sh*t" insights that connect the dots
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-cinzel font-black mb-4">System Capabilities</h2>
             <div className="h-1 w-20 bg-cyan-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="text-purple-500" size={32} />}
              title="Adaptive AI Host"
              description="Echo adapts to your skill level, offering personalized feedback and 'sassy' commentary based on your performance."
            />
            <FeatureCard 
              icon={<Database className="text-emerald-500" size={32} />}
              title="Infinite Content"
              description="Never play the same game twice. Our Neural Core generates unique boards, clues, and categories instantly."
            />
            <FeatureCard 
              icon={<Shield className="text-amber-500" size={32} />}
              title="Formula Hub"
              description="Interactive visualizers for Doppler, Hemodynamics, and Resolution physics. Don't just memorize—understand."
            />
             <FeatureCard 
              icon={<Terminal className="text-pink-500" size={32} />}
              title="Command Line Interface"
              description="Navigate the matrix with a developer-grade terminal experience. Fast, efficient, and keyboard-first."
            />
             <FeatureCard 
              icon={<BarChart3 className="text-blue-500" size={32} />}
              title="Performance Analytics"
              description="Track your mastery across all 11 SPI domains. Identify weak points and target them with surgical precision."
            />
             <FeatureCard 
              icon={<Globe className="text-orange-500" size={32} />}
              title="Real-World Scenarios"
              description="Applied physics questions that mirror the actual clinical environment, not just the textbook definitions."
            />
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="relative z-10 py-24 bg-black/40 border-y border-white/5">
         <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
               <div>
                  <h2 className="text-3xl md:text-4xl font-cinzel font-black mb-2">The Curriculum</h2>
                  <p className="text-slate-400">11 Modules. 100% SPI Coverage.</p>
               </div>
               <button onClick={onStart} className="hidden md:flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-widest text-xs mt-4 md:mt-0">
                  <span>View Full Syllabus</span>
                  <ArrowRight size={16} />
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {[
                  "Ultrasound Physics Basics",
                  "Transducers & Sound Beams",
                  "Pulse Echo Instrumentation",
                  "Doppler Hemodynamics",
                  "Artifacts & Corrections",
                  "Bioeffects & Safety",
                  "Quality Assurance",
                  "Fluid Dynamics",
                  "Hemodynamics",
                  "Harmonics & Contrast",
                  "New Technologies"
               ].map((module, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center space-x-4 hover:bg-white/10 transition-colors cursor-default">
                     <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xs font-mono">
                        {(i + 1).toString().padStart(2, '0')}
                     </div>
                     <span className="font-bold text-slate-200 text-sm">{module}</span>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24">
         <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-center text-3xl font-cinzel font-black mb-16">User Transmissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <TestimonialCard 
                  name="Sarah Jenkins"
                  role="Student - Class of 2025"
                  quote="I thought I knew physics. Echo humbled me. The 'Holy Sh*t' insights actually make sense of the math. 10/10 would fail again."
               />
               <TestimonialCard 
                  name="Marcus Thorne"
                  role="Sonographer - 5 Years Exp"
                  quote="Finally, a tool that visualizes Snell's Law. I've been scanning for years and never understood the refraction angle until I played with the slider."
               />
               <TestimonialCard 
                  name="Elena Rodriguez"
                  role="Registry Prepper"
                  quote="The Doppler simulations are a game changer. Seeing the spectral waveform change in real-time saved my grade."
               />
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 text-center px-6">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-cinzel font-black mb-8">Ready to Jack In?</h2>
            <p className="text-xl text-slate-400 mb-12">The simulation is waiting. Your future as a sonographer begins now.</p>
            <button 
              onClick={onStart}
              className="px-12 py-6 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg uppercase tracking-[0.2em] rounded-full shadow-[0_0_60px_rgba(8,145,178,0.6)] hover:shadow-[0_0_100px_rgba(8,145,178,0.8)] transition-all transform hover:scale-105"
            >
              Start Free Trial
            </button>
         </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-6 md:px-12 border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem value="100%" label="Registry Pass Rate" />
          <StatItem value="50k+" label="Clues Generated" />
          <StatItem value="24/7" label="AI Availability" />
          <StatItem value="v4.2" label="Matrix Version" />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center text-slate-600 text-xs uppercase tracking-widest font-mono">
        <p>&copy; 2026 Echo Jeopardy System. All Rights Reserved.</p>
        <p className="mt-2">Powered by Gemini Neural Engine</p>
        <div className="mt-4">
           <a href="mailto:info@spiphysic.com" className="text-slate-500 hover:text-cyan-400 transition-colors">Support: info@spiphysic.com</a>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
    <div className="mb-6 p-4 rounded-xl bg-black/40 w-fit group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-cinzel font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, quote }: { name: string, role: string, quote: string }) => (
   <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 relative">
      <div className="absolute -top-4 -left-4 text-6xl text-cyan-500/20 font-serif">"</div>
      <p className="text-slate-300 italic mb-6 leading-relaxed relative z-10">{quote}</p>
      <div className="flex items-center space-x-3">
         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white">
            {name[0]}
         </div>
         <div>
            <div className="font-bold text-white text-sm">{name}</div>
            <div className="text-xs text-cyan-500 uppercase tracking-wider">{role}</div>
         </div>
      </div>
   </div>
);

const StatItem = ({ value, label }: { value: string, label: string }) => (
  <div>
    <div className="text-4xl md:text-5xl font-black text-white mb-2">{value}</div>
    <div className="text-cyan-500 text-[10px] font-black uppercase tracking-widest">{label}</div>
  </div>
);

export default LandingPage;
