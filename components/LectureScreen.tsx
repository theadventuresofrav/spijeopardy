import React, { useState, useEffect, useRef } from 'react';
import { LectureScript } from '../types';
import { VisualRegistry } from './CourseVisuals';
import { 
  ChevronLeft, Volume2, Clock, Map, Zap, CheckCircle, Target, 
  ShieldAlert, Workflow, BrainCircuit, Flame, ChevronDown, 
  BookOpen, Eye, Move, CheckCircle2, XCircle, HelpCircle, Scale, Maximize, Minimize,
  Play, Pause, FastForward
} from 'lucide-react';

interface LectureScreenProps {
  lecture: LectureScript;
  onBack: () => void;
  onSpeak: (text: string) => void;
  onComplete: () => void;
}

const LectureScreen: React.FC<LectureScreenProps> = ({ lecture, onBack, onSpeak, onComplete }) => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [revealedStates, setRevealedStates] = useState<Record<number, boolean>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Cinematic Mode States
  const [isCinematicMode, setIsCinematicMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [subtitles, setSubtitles] = useState("");
  const narrativeSegments = useRef<string[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    
    // Split narrative into segments
    narrativeSegments.current = lecture.narrativeScript
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.length > 0);

    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, [lecture]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      document.exitFullscreen().catch(e => console.error(e));
    }
  };

  const startCinematicExperience = async () => {
    setIsCinematicMode(true);
    setIsPlaying(true);
    setCurrentSegment(0);
    
    // Start sequence
    for (let i = 0; i < narrativeSegments.current.length; i++) {
      if (!isPlaying && i > 0) break; // Allow pause logic later (simplified for now)
      
      const segment = narrativeSegments.current[i];
      setCurrentSegment(i);
      setSubtitles(segment);
      
      // Calculate rough duration based on word count (avg 150 wpm = 2.5 words/sec)
      // Or use the onSpeak promise if it returned one. 
      // Since onSpeak is void, we'll estimate or just fire-and-forget for now, 
      // but ideally we'd want onSpeak to return a Promise<void> when audio finishes.
      
      // For this implementation, we will trigger the speech
      onSpeak(segment);
      
      // Artificial delay for reading (approx 300ms per word + 1s buffer)
      const words = segment.split(' ').length;
      const delay = (words * 350) + 1500; 
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    setIsPlaying(false);
    setSubtitles("");
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (revealedStates[qIdx]) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    setRevealedStates(prev => ({ ...prev, [qIdx]: true }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 md:space-y-12 animate-scan-down pb-32 md:pb-48 px-3 md:px-0 font-sans relative">
      
      {/* Cinematic Subtitle Bar (Fixed Bottom) */}
      {isCinematicMode && (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          {/* Gradient Overlay */}
          <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
          
          <div className="relative max-w-4xl mx-auto pb-12 px-6 text-center">
             <div className="inline-flex items-center space-x-2 mb-4 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded-full backdrop-blur-md">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">The Guide</span>
             </div>
             
             <p className="text-xl md:text-3xl font-medium text-white leading-relaxed drop-shadow-lg transition-all duration-300">
               "{subtitles}"
             </p>
             
             {/* Controls */}
             <div className="mt-8 flex items-center justify-center gap-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
               <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10">
                 {isPlaying ? <Pause size={20} /> : <Play size={20} />}
               </button>
               <button onClick={() => setIsCinematicMode(false)} className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-red-500/20">
                 Exit Mode
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 md:pb-6 mt-2 md:mt-0 backdrop-blur-sm sticky top-0 z-40 bg-slate-950/80 px-4 md:px-8 -mx-4 md:-mx-8">
        <button onClick={onBack} className="flex items-center space-x-2 md:space-x-3 text-slate-500 hover:text-white transition-all uppercase text-[8px] md:text-[10px] font-black tracking-widest group">
           <div className="p-1.5 md:p-2 rounded-lg bg-white/5 group-hover:bg-cyan-500/20 transition-colors">
              <ChevronLeft size={14} className="md:w-4 md:h-4" />
           </div>
           <span className="group-hover:text-cyan-400 transition-colors">Curriculum</span>
        </button>
        
        <div className="flex items-center space-x-3">
           <button onClick={toggleFullScreen} className="p-2 rounded-full border border-white/10 hover:bg-white/10 text-slate-500 hover:text-white transition-all">
             {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
          
          <button onClick={startCinematicExperience} className="flex items-center space-x-2 md:space-x-3 text-cyan-400 hover:text-cyan-300 font-bold uppercase text-[8px] md:text-[10px] tracking-widest group bg-cyan-900/10 px-3 py-1.5 rounded-full border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
             <Volume2 size={14} className="md:w-4 md:h-4 group-hover:animate-pulse" /> 
             <span>Cinematic Briefing</span>
          </button>
       </div>
      </div>

      {/* Hero Section */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-[2.5rem] p-6 md:p-20 relative overflow-hidden text-center shadow-2xl">
         <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] pointer-events-none">
            <BrainCircuit size={120} className="md:w-[200px] md:h-[200px]" />
         </div>
         
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
             <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
         </div>

         <div className="flex flex-col items-center space-y-4 md:space-y-6 mb-6 md:mb-12 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
               <Flame size={12} className="md:w-3.5 md:h-3.5 animate-pulse" />
               <span>Synced Masterclass</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-8xl font-cinzel font-black text-white leading-tight px-2 drop-shadow-lg">
               {lecture.topicTitle}
            </h1>
            
            <div className="bg-white/5 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 w-full max-w-xl shadow-lg relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
               <p className="text-[10px] md:text-sm text-slate-300 italic leading-relaxed font-serif">
                  "{lecture.quantifiedEffort}"
               </p>
               <div className="flex items-center justify-center space-x-6 md:space-x-8 mt-4 md:mt-6 border-t border-white/5 pt-3 md:pt-4">
                  <div className="text-center group/stat">
                     <div className="text-cyan-400 font-mono text-base md:text-xl font-black group-hover/stat:scale-110 transition-transform">{lecture.timeSavedHours}h</div>
                     <div className="text-[7px] md:text-[8px] text-slate-500 uppercase font-black tracking-widest">Yield</div>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="text-center group/stat">
                     <div className="text-yellow-400 font-mono text-base md:text-xl font-black group-hover/stat:scale-110 transition-transform">{lecture.learningEffortMinutes}m</div>
                     <div className="text-[7px] md:text-[8px] text-slate-500 uppercase font-black tracking-widest">Duration</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Roadmap */}
      {lecture.roadmap && (
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 px-4">
           {lecture.roadmap.map((step, i) => (
              <div key={i} className="flex items-center gap-3 group">
                 <div className="flex items-center gap-2 text-slate-500 group-hover:text-cyan-400 transition-colors">
                    <span className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-slate-700 group-hover:border-cyan-500/50 flex items-center justify-center text-[10px] font-mono transition-colors">{i+1}</span>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{step}</span>
                 </div>
                 {i < lecture.roadmap.length - 1 && <div className="w-4 md:w-8 h-px bg-slate-800 group-hover:bg-cyan-900/50 transition-colors" />}
              </div>
           ))}
        </div>
      )}

      {/* Narrative Section */}
      <div className="bg-slate-900/40 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-[3rem] p-6 md:p-16 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
         <div className="flex items-center space-x-3 text-cyan-500 mb-6 md:mb-12">
            <BookOpen size={18} className="md:w-5 md:h-5" /> <span className="font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs">Lecture Transcript</span>
         </div>
         <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-lg md:text-xl font-serif leading-relaxed space-y-4 md:space-y-8">
            {lecture.narrativeScript.split('\n').map((para, i) => para && (
               <p key={i} className="first-letter:text-3xl md:first-letter:text-5xl first-letter:font-cinzel first-letter:font-black first-letter:text-cyan-500 first-letter:float-left first-letter:mr-3 first-letter:mt-[-2px]">
                  {para}
               </p>
            ))}
         </div>
      </div>

      {/* Visual & Demo Grid */}
      <div className="space-y-8">
         {lecture.visualId && VisualRegistry[lecture.visualId] && (
           <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 animate-in slide-in-from-bottom-8 shadow-2xl">
              {React.createElement(VisualRegistry[lecture.visualId])}
           </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4 md:space-y-6 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center space-x-3 text-purple-400">
               <Eye size={18} className="md:w-5 md:h-5" /> <span className="font-black uppercase tracking-widest text-[10px]">Visual Interpretation</span>
            </div>
            <div className="space-y-3 md:space-y-4">
               {lecture.visualInterpretation.map((item, i) => (
                  <div key={i} className="p-3 md:p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                     <div className="text-[8px] md:text-[10px] text-purple-400 font-black uppercase mb-1">On-Screen: {item.observation}</div>
                     <p className="text-slate-300 text-[10px] md:text-sm italic">"{item.significance}"</p>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-emerald-500/5 backdrop-blur-md border border-emerald-500/20 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4 md:space-y-6 hover:bg-emerald-500/10 transition-colors">
            <div className="flex items-center space-x-3 text-emerald-400">
               <Move size={18} className="md:w-5 md:h-5" /> <span className="font-black uppercase tracking-widest text-[10px]">Demo Workflow</span>
            </div>
            <div className="space-y-3 md:space-y-4">
               {lecture.clinicalDemo.map((step, i) => (
                  <div key={i} className="flex items-start space-x-3 md:space-x-4 group">
                     <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[8px] md:text-[10px] font-black text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                        {i+1}
                     </div>
                     <div>
                        <div className="text-white font-bold text-xs md:text-sm mb-0.5 group-hover:text-emerald-200 transition-colors">{step.probeMovement}</div>
                        <p className="text-[7px] md:text-[10px] text-slate-500 uppercase tracking-widest">{step.expectedOutcome}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
      </div>

      {/* Strategic Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-yellow-500/5 backdrop-blur-md border border-yellow-500/20 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4 hover:border-yellow-500/40 transition-colors">
            <div className="flex items-center gap-3 text-yellow-400">
               <Zap size={20} />
               <span className="font-black uppercase tracking-widest text-xs">Crucial Insight</span>
            </div>
            <p className="text-slate-200 text-sm md:text-lg leading-relaxed font-medium">
               "{lecture.holyShitInsight}"
            </p>
         </div>

         <div className="bg-red-500/5 backdrop-blur-md border border-red-500/20 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4 hover:border-red-500/40 transition-colors">
            <div className="flex items-center gap-3 text-red-400">
               <ShieldAlert size={20} />
               <span className="font-black uppercase tracking-widest text-xs">Common Pitfall</span>
            </div>
            <p className="text-slate-200 text-sm md:text-lg leading-relaxed font-medium">
               "{lecture.psychologicalBarrier}"
            </p>
         </div>
      </div>

      {lecture.contrastSection && (
        <div className="bg-blue-500/5 backdrop-blur-md border border-blue-500/20 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4 hover:border-blue-500/40 transition-colors">
           <div className="flex items-center gap-3 text-blue-400">
              <Scale size={20} />
              <span className="font-black uppercase tracking-widest text-xs">Concept Contrast</span>
           </div>
           <p className="text-slate-200 text-sm md:text-lg leading-relaxed font-medium">
              {lecture.contrastSection}
           </p>
        </div>
      )}

      {/* Mnemonic & Analogy Card */}
      <div className="bg-amber-500/5 backdrop-blur-md border border-amber-500/20 rounded-2xl md:rounded-[3rem] p-6 md:p-16 flex flex-col md:flex-row items-center gap-6 md:gap-12 text-center md:text-left relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <BrainCircuit size={200} />
         </div>
         <div className="flex-1 space-y-2 md:space-y-4 relative z-10">
            <div className="text-amber-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest">Physics Analogy</div>
            <p className="text-lg md:text-3xl font-cinzel italic text-amber-50 leading-relaxed drop-shadow-md">"{lecture.analogy}"</p>
         </div>
         <div className="w-full md:w-72 p-6 md:p-10 bg-black/40 rounded-2xl md:rounded-3xl border border-white/10 text-center relative z-10 shadow-xl backdrop-blur-xl">
            <div className="text-slate-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-2 md:mb-4">Mnemonic</div>
            <h4 className="text-4xl md:text-6xl font-cinzel font-black text-amber-400 mb-2 md:mb-3 drop-shadow-lg tracking-tight">{lecture.mnemonic.acronym}</h4>
            <p className="text-[9px] md:text-[11px] text-slate-300 uppercase tracking-wider font-bold">{lecture.mnemonic.meaning}</p>
         </div>
      </div>

      {/* Assessment Activation */}
      {!showAssessment ? (
        <div className="text-center py-12 md:py-20 bg-slate-900 border border-white/5 rounded-2xl md:rounded-[3rem] px-4">
           <h3 className="text-lg md:text-2xl font-cinzel font-black text-white mb-4 md:mb-6 uppercase tracking-widest">Verify Knowledge</h3>
           <p className="text-slate-500 text-[8px] md:text-[10px] uppercase tracking-widest mb-8 md:mb-12">Unlock topic synchronization by passing the assessment.</p>
           <button 
              onClick={() => setShowAssessment(true)}
              className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-[0.3em] md:tracking-[0.5em] rounded-xl md:rounded-2xl transition-all shadow-2xl active:scale-95 text-[10px] md:text-xs"
           >
              Begin Assessment
           </button>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-8 animate-in slide-in-from-bottom-8 duration-500 px-1">
           <div className="text-center mb-6 md:mb-12">
              <h3 className="text-xl md:text-4xl font-cinzel font-black text-white uppercase tracking-widest">Verification</h3>
           </div>
           
           <div className="grid grid-cols-1 gap-6 md:gap-8">
              {lecture.assessmentQuestions.map((q, i) => {
                 const hasOptions = q.options && q.options.length > 0;
                 const isRevealed = revealedStates[i];
                 const selectedIdx = userAnswers[i];
                 
                 if (hasOptions) {
                    return (
                        <div key={i} className="bg-slate-900/60 border border-white/5 rounded-xl md:rounded-2xl overflow-hidden p-6 md:p-8 space-y-4">
                           <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">{i + 1}</div>
                              <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">{q.question}</h3>
                           </div>

                           <div className="grid grid-cols-1 gap-3 pl-0 md:pl-12">
                              {q.options.map((opt, optIdx) => {
                                 let stateClass = "bg-white/5 border-white/10 hover:bg-white/10 text-slate-300";
                                 if (isRevealed) {
                                    if (optIdx === q.correctAnswerIndex) stateClass = "bg-emerald-500/20 border-emerald-500 text-emerald-100";
                                    else if (optIdx === selectedIdx) stateClass = "bg-red-500/20 border-red-500 text-red-100";
                                    else stateClass = "bg-white/5 border-white/5 opacity-50";
                                 }
                                 
                                 return (
                                    <button
                                      key={optIdx}
                                      onClick={() => handleOptionSelect(i, optIdx)}
                                      disabled={isRevealed}
                                      className={`text-left p-4 rounded-xl border transition-all text-sm md:text-base ${stateClass}`}
                                    >
                                       <div className="flex items-center justify-between">
                                          <span>{opt}</span>
                                          {isRevealed && optIdx === q.correctAnswerIndex && <CheckCircle2 size={16} className="text-emerald-400" />}
                                          {isRevealed && optIdx === selectedIdx && optIdx !== q.correctAnswerIndex && <XCircle size={16} className="text-red-400" />}
                                       </div>
                                    </button>
                                 );
                              })}
                           </div>

                           {isRevealed && (
                              <div className="ml-0 md:ml-12 p-4 rounded-xl bg-slate-800/50 border border-white/5 animate-in fade-in slide-in-from-top-2">
                                 <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-widest text-slate-500">
                                    <BrainCircuit size={12} />
                                    <span>Explanation</span>
                                 </div>
                                 <p className="text-sm md:text-base text-slate-300 leading-relaxed">{q.explanation}</p>
                              </div>
                           )}
                        </div>
                    );
                 }

                 return (
                 <div key={i} className="bg-slate-900/60 border border-white/5 rounded-xl md:rounded-2xl overflow-hidden">
                    <button 
                       onClick={() => setActiveQuestion(activeQuestion === i ? null : i)}
                       className="w-full p-4 md:p-8 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                       <span className="text-sm md:text-lg font-bold text-white pr-4">{q.question}</span>
                       <ChevronDown size={18} className={`text-slate-600 flex-shrink-0 transition-transform ${activeQuestion === i ? 'rotate-180' : ''}`} />
                    </button>
                    {activeQuestion === i && (
                       <div className="px-4 md:px-8 pb-4 md:pb-8 pt-2 md:pt-4 border-t border-white/5 bg-emerald-500/5 animate-in slide-in-from-top-4">
                          <div className="text-[7px] md:text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 md:mb-2">Verified Answer</div>
                          <p className="text-lg md:text-xl font-cinzel font-black text-emerald-100 mb-2 md:mb-4">{q.answer}</p>
                          <p className="text-xs md:text-sm text-slate-400 italic">"{q.explanation}"</p>
                       </div>
                    )}
                 </div>
              )})}
           </div>

           <div className="pt-8 md:pt-20 text-center">
              <button 
                 onClick={onComplete}
                 className="w-full md:w-auto px-10 md:px-16 py-4 md:py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.3em] md:tracking-[0.6em] rounded-xl md:rounded-2xl transition-all shadow-[0_0_50px_rgba(16,185,129,0.3)] active:scale-95 text-xs md:text-sm"
              >
                 Sync to Profile
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default LectureScreen;