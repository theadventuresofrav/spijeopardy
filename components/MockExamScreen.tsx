import React, { useState, useEffect, useRef } from 'react';
import { ExamQuestion, ExamAttempt, UserProfile } from '../types';
import { MOCK_EXAM_QUESTIONS } from '../data/mockExamQuestions';
import { 
  Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, 
  Flag, LayoutGrid, CheckSquare, Save, RotateCcw, Award 
} from 'lucide-react';

interface MockExamScreenProps {
  onExit: () => void;
  onComplete: (result: ExamAttempt) => void;
}

type ExamState = 'INTRO' | 'ACTIVE' | 'REVIEW';

const EXAM_DURATION_SECONDS = 2 * 60 * 60; // 2 hours

const MockExamScreen: React.FC<MockExamScreenProps> = ({ onExit, onComplete }) => {
  const [examState, setExamState] = useState<ExamState>('INTRO');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [showGrid, setShowGrid] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (examState === 'ACTIVE') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setExamState('ACTIVE');
    setTimeLeft(EXAM_DURATION_SECONDS);
    setAnswers({});
    setFlaggedQuestions(new Set());
    setCurrentQuestionIndex(0);
  };

  const handleSelectAnswer = (optionIndex: number) => {
    if (examState !== 'ACTIVE') return;
    const qId = MOCK_EXAM_QUESTIONS[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const toggleFlag = () => {
    const qId = MOCK_EXAM_QUESTIONS[currentQuestionIndex].id;
    setFlaggedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSubmitExam = () => {
    if (examState !== 'ACTIVE') return;
    
    // Calculate Score
    let score = 0;
    let correctCount = 0;
    
    MOCK_EXAM_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswerIndex) {
        score++;
        correctCount++;
      }
    });

    const attempt: ExamAttempt = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: correctCount,
      timeSpentSeconds: EXAM_DURATION_SECONDS - timeLeft,
      answers: answers
    };

    if (timerRef.current) clearInterval(timerRef.current);
    setExamState('REVIEW');
    onComplete(attempt);
  };

  const getQuestionStatus = (qId: string) => {
    if (examState === 'REVIEW') {
      const q = MOCK_EXAM_QUESTIONS.find(mq => mq.id === qId);
      if (!q) return 'neutral';
      const selected = answers[qId];
      if (selected === undefined) return 'skipped';
      return selected === q.correctAnswerIndex ? 'correct' : 'incorrect';
    }
    // Active State
    if (flaggedQuestions.has(qId)) return 'flagged';
    if (answers[qId] !== undefined) return 'answered';
    return 'unanswered';
  };

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center p-6 animate-in zoom-in duration-500 relative z-10">
      <div className="relative mb-10 group">
        <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div className="w-32 h-32 bg-slate-950/80 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative z-10">
          <CheckSquare size={64} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        </div>
        <div className="absolute -inset-2 border border-cyan-500/20 rounded-[2rem] animate-pulse-slow pointer-events-none"></div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-6 tracking-tight font-cinzel">
        SPI SIMULATION
      </h1>
      <p className="text-cyan-100/60 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-light">
        Initiating registry certification protocol. <span className="text-cyan-400 font-bold">110 Physics Questions</span> across all domains. 
        Detailed telemetry and analysis available upon completion.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
        {[
            { val: "110", label: "Questions", sub: "Full Battery" },
            { val: "120", label: "Minutes", sub: "Timed Mode" },
            { val: "PASS", label: "Goal: 70%+", sub: "Certification" }
        ].map((item, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 flex flex-col items-center group hover:bg-slate-800/40 transition-colors relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className={`text-4xl font-black mb-1 ${item.val === 'PASS' ? 'text-emerald-400' : 'text-white'}`}>{item.val}</span>
                <span className="text-xs text-cyan-500/70 uppercase tracking-widest font-bold mb-1">{item.label}</span>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{item.sub}</span>
            </div>
        ))}
      </div>

      <button 
        onClick={handleStartExam}
        className="group relative px-16 py-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(8,145,178,0.4)] hover:shadow-[0_0_50px_rgba(8,145,178,0.6)] flex items-center space-x-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <span className="text-xl tracking-widest">INITIATE EXAM</span>
        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  const renderActive = () => {
    const question = MOCK_EXAM_QUESTIONS[currentQuestionIndex];
    const isFlagged = flaggedQuestions.has(question.id);
    const selectedOption = answers[question.id];

    return (
      <div className="flex flex-col h-full max-w-6xl mx-auto w-full relative z-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-slate-950/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 mb-8 sticky top-0 z-50 shadow-2xl">
          <div className="flex items-center space-x-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-cyan-500/60 uppercase tracking-widest font-bold">Active Protocol</span>
              <span className="text-xl font-mono text-white font-bold tracking-tight">Q-{currentQuestionIndex + 1} <span className="text-slate-600 text-sm">/ {MOCK_EXAM_QUESTIONS.length}</span></span>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <button 
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2.5 rounded-xl transition-all duration-300 border ${showGrid ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'}`}
              title="Toggle Tactical Grid"
            >
              <LayoutGrid size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
             <div className={`flex items-center space-x-3 px-5 py-2.5 rounded-xl border transition-all ${timeLeft < 300 ? 'bg-red-950/50 border-red-500/50 animate-pulse' : 'bg-slate-900/50 border-white/10'}`}>
                <Clock size={18} className={timeLeft < 300 ? 'text-red-500' : 'text-cyan-500'} />
                <span className={`font-mono text-xl font-bold tracking-widest ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
             </div>

             <button 
               onClick={() => {
                   if(window.confirm("Confirm protocol termination? Answers will be locked.")) {
                       handleSubmitExam();
                   }
               }}
               className="hidden sm:flex px-5 py-2.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all font-bold text-sm items-center space-x-2 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
             >
               <Save size={18} />
               <span>Submit Protocol</span>
             </button>
          </div>
        </div>

        {/* Question Grid Overlay */}
        {showGrid && (
          <div className="mb-8 p-6 bg-slate-950/95 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-cyan-400 text-xs font-black uppercase tracking-widest">Tactical Map</h3>
                <div className="flex space-x-4 text-[10px] uppercase font-bold tracking-wider">
                    <span className="flex items-center"><div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>Answered</span>
                    <span className="flex items-center"><div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>Flagged</span>
                    <span className="flex items-center"><div className="w-2 h-2 bg-slate-700 rounded-full mr-2"></div>Pending</span>
                </div>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
              {MOCK_EXAM_QUESTIONS.map((q, idx) => {
                const status = getQuestionStatus(q.id);
                let colorClass = 'bg-slate-800/50 text-slate-500 border-transparent hover:bg-slate-700';
                if (status === 'answered') colorClass = 'bg-cyan-900/40 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]';
                if (status === 'flagged') colorClass = 'bg-amber-900/40 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
                if (idx === currentQuestionIndex) colorClass += ' ring-2 ring-white ring-offset-2 ring-offset-slate-900';
                
                return (
                  <button
                    key={q.id}
                    onClick={() => { setCurrentQuestionIndex(idx); setShowGrid(false); }}
                    className={`p-2 rounded-lg border text-xs font-mono font-bold transition-all relative ${colorClass}`}
                  >
                    {idx + 1}
                    {status === 'flagged' && <div className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full -mt-0.5 -mr-0.5 animate-pulse"></div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
           <div className="bg-slate-900/60 backdrop-blur-md p-8 md:p-10 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group">
              {/* Holographic Effects */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 via-purple-500 to-cyan-500 opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed max-w-4xl tracking-tight">
                  {question.question}
                </h2>
                <button 
                  onClick={toggleFlag}
                  className={`p-3.5 rounded-xl border transition-all duration-300 ${isFlagged ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-transparent text-slate-500 hover:text-amber-400 hover:bg-white/10'}`}
                  title="Flag for Review"
                >
                  <Flag size={22} fill={isFlagged ? "currentColor" : "none"} />
                </button>
              </div>

              {question.imageUrl && (
                  <div className="mb-8 rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-inner relative group/img">
                      <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none"></div>
                      <img src={question.imageUrl} alt="Question Diagram" className="max-w-full h-auto mx-auto" />
                  </div>
              )}

              <div className="space-y-4 relative z-10">
                {question.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full text-left p-5 md:p-6 rounded-2xl border transition-all duration-300 flex items-center group
                        ${isSelected 
                          ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-500/50 text-cyan-50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'
                        }
                      `}
                    >
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mr-5 flex-shrink-0 transition-all duration-300
                        ${isSelected ? 'border-cyan-400 bg-cyan-400 scale-110' : 'border-slate-600 group-hover:border-slate-400'}
                      `}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />}
                      </div>
                      <span className="text-lg md:text-xl font-light tracking-wide">{option}</span>
                    </button>
                  );
                })}
              </div>
           </div>
        </div>

        {/* Footer Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-50">
           <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
              <button 
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-white/10 backdrop-blur-md border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold flex items-center space-x-3 transition-all hover:-translate-x-1"
              >
                <ChevronLeft size={22} />
                <span>Previous</span>
              </button>

              <button 
                onClick={() => setCurrentQuestionIndex(Math.min(MOCK_EXAM_QUESTIONS.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === MOCK_EXAM_QUESTIONS.length - 1}
                className="px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold flex items-center space-x-3 transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:translate-x-1"
              >
                <span>Next Question</span>
                <ChevronRight size={22} />
              </button>
           </div>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    const question = MOCK_EXAM_QUESTIONS[currentQuestionIndex];
    const userAnsIdx = answers[question.id];
    const isCorrect = userAnsIdx === question.correctAnswerIndex;
    const isSkipped = userAnsIdx === undefined;

    // Calculate stats
    const correctCount = MOCK_EXAM_QUESTIONS.filter(q => answers[q.id] === q.correctAnswerIndex).length;
    const scorePercentage = Math.round((correctCount / MOCK_EXAM_QUESTIONS.length) * 100);

    return (
      <div className="flex flex-col h-full max-w-7xl mx-auto w-full relative z-10">
         <div className="flex items-center justify-between mb-8 bg-slate-950/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center space-x-8">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">ANALYSIS REPORT</h2>
                    <div className="flex items-center space-x-2 mt-1">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-xs text-emerald-500 font-mono uppercase tracking-widest">Completed</span>
                    </div>
                </div>
                <div className="h-12 w-px bg-white/10 hidden md:block"></div>
                <div className="hidden md:flex items-center space-x-6">
                    <div>
                        <div className={`text-3xl font-black ${scorePercentage >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {scorePercentage}%
                        </div>
                        <div className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Accuracy</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-white">
                            {correctCount} <span className="text-lg text-slate-600">/ {MOCK_EXAM_QUESTIONS.length}</span>
                        </div>
                        <div className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Score</div>
                    </div>
                </div>
            </div>
            
            <div className="flex space-x-3">
                <button onClick={onExit} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-white/5 transition-colors">Exit Review</button>
                <button onClick={() => { handleStartExam(); }} className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center space-x-2 shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] transition-all">
                    <RotateCcw size={18} /> <span>Re-Initialize</span>
                </button>
            </div>
         </div>

         <div className="flex flex-1 overflow-hidden gap-8">
            {/* Sidebar List */}
            <div className="w-1/3 max-w-xs bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-xl">
                <div className="p-4 border-b border-white/5 bg-white/5 font-bold text-slate-300 text-xs uppercase tracking-widest flex justify-between items-center">
                    <span>Question Log</span>
                    <span className="text-slate-600">{MOCK_EXAM_QUESTIONS.length} items</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {MOCK_EXAM_QUESTIONS.map((q, idx) => {
                        const s = getQuestionStatus(q.id);
                        return (
                            <button 
                                key={q.id}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`w-full flex items-center p-3 rounded-lg text-sm transition-all group ${idx === currentQuestionIndex ? 'bg-cyan-900/30 ring-1 ring-cyan-500/50' : 'hover:bg-white/5'}`}
                            >
                                <span className={`w-6 font-mono font-bold mr-2 ${idx === currentQuestionIndex ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400'}`}>{idx + 1}</span>
                                <span className="flex-1 truncate text-left text-slate-300 opacity-80">{q.question}</span>
                                <div className="ml-2">
                                    {s === 'correct' && <CheckCircle size={14} className="text-emerald-500" />}
                                    {s === 'incorrect' && <XCircle size={14} className="text-red-500" />}
                                    {s === 'skipped' && <AlertCircle size={14} className="text-amber-500" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Detail View */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 relative shadow-2xl overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1.5 h-full opacity-100 ${isCorrect ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : isSkipped ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}></div>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                    
                    <div className="mb-8 relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1}</span>
                            {isCorrect && <span className="flex items-center bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded border border-emerald-500/20 uppercase tracking-wider"><CheckCircle size={12} className="mr-1.5"/> Correct</span>}
                            {!isCorrect && !isSkipped && <span className="flex items-center bg-red-500/10 text-red-400 text-xs font-bold px-3 py-1 rounded border border-red-500/20 uppercase tracking-wider"><XCircle size={12} className="mr-1.5"/> Incorrect</span>}
                            {isSkipped && <span className="flex items-center bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1 rounded border border-amber-500/20 uppercase tracking-wider"><AlertCircle size={12} className="mr-1.5"/> Skipped</span>}
                        </div>
                        <h3 className="text-2xl font-bold text-white leading-relaxed tracking-tight">{question.question}</h3>
                    </div>

                    <div className="space-y-4 mb-10 relative z-10">
                        {question.options.map((opt, idx) => {
                            const isOptCorrect = idx === question.correctAnswerIndex;
                            const isOptSelected = idx === userAnsIdx;
                            
                            let style = "bg-slate-950/30 border-white/5 text-slate-400 opacity-60";
                            let icon = null;

                            if (isOptCorrect) {
                                style = "bg-emerald-500/10 border-emerald-500/50 text-emerald-300 opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                                icon = <CheckCircle size={20} className="text-emerald-400" />;
                            } else if (isOptSelected) {
                                style = "bg-red-500/10 border-red-500/50 text-red-300 opacity-100 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                                icon = <XCircle size={20} className="text-red-400" />;
                            }

                            return (
                                <div key={idx} className={`p-5 rounded-xl border flex items-center justify-between transition-all ${style}`}>
                                    <span className="font-medium text-lg">{opt}</span>
                                    {icon}
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Award size={100} />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-blue-400 font-bold mb-4 flex items-center uppercase tracking-widest text-sm">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                                Expert Analysis
                            </h4>
                            <p className="text-slate-200 leading-relaxed text-base md:text-lg font-light">
                                {question.explanation}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#030305] z-50 flex flex-col overflow-hidden font-sans">
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#030305] to-black pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>
        
        {/* Simplified Header for Exam Mode */}
        <div className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0 relative z-20">
             <div className="flex items-center space-x-4">
                 <div className="w-9 h-9 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                     <CheckSquare size={18} className="text-cyan-400" />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-black text-slate-200 tracking-widest text-sm uppercase">SPI Certification</span>
                    <span className="text-[10px] text-cyan-500/60 font-mono uppercase tracking-widest">Simulation Protocol v2.0</span>
                 </div>
             </div>
             <button 
                onClick={onExit} 
                className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all text-slate-400 text-xs font-bold uppercase tracking-widest"
             >
                 <span>Abort Simulation</span>
                 <div className="w-1.5 h-1.5 bg-slate-500 rounded-full group-hover:bg-red-500 transition-colors"></div>
             </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 custom-scrollbar">
            {examState === 'INTRO' && renderIntro()}
            {examState === 'ACTIVE' && renderActive()}
            {examState === 'REVIEW' && renderReview()}
        </div>
    </div>
  );
};

export default MockExamScreen;
