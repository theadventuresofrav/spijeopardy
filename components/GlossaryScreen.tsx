import React, { useState, useMemo } from 'react';
import { Search, Book, ChevronRight, X, Play, Filter, Cpu, Database, Activity, Zap, Layers, Brain, Stethoscope } from 'lucide-react';
import { GLOSSARY_DATA, GlossaryTerm } from '../data/glossaryData';
import { generateExplanation } from '../services/geminiService';

interface GlossaryScreenProps {
  onBack?: () => void;
}

const GlossaryScreen: React.FC<GlossaryScreenProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanationMode, setExplanationMode] = useState<'explain' | 'clinical'>('explain');

  const handleAiAction = async (mode: 'explain' | 'clinical') => {
    if (!selectedTerm) return;
    setIsGenerating(true);
    setExplanationMode(mode);
    setAiExplanation(null);
    try {
      const text = await generateExplanation(selectedTerm.term, selectedTerm.definition, mode);
      setAiExplanation(text);
    } catch (e) {
      setAiExplanation("Error connecting to Neural Uplink.");
    } finally {
      setIsGenerating(false);
    }
  };

  const categories = Array.from(new Set(GLOSSARY_DATA.map(item => item.category)));
  const letters = Array.from(new Set(GLOSSARY_DATA.map(item => item.term[0].toUpperCase()))).sort();

  const filteredTerms = useMemo(() => {
    return GLOSSARY_DATA.filter(item => {
      const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesLetter = selectedLetter ? item.term.toUpperCase().startsWith(selectedLetter) : true;
      return matchesSearch && matchesCategory && matchesLetter;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedCategory, selectedLetter]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      {/* Header */}
      <div className="p-4 md:p-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl z-20 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Book className="text-cyan-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-cinzel font-black text-white tracking-widest uppercase">Data Glossary</h1>
              <p className="text-[10px] md:text-xs text-cyan-500/60 font-mono uppercase tracking-widest">Ultrasound Physics Compendium</p>
            </div>
          </div>
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
              <X size={24} className="text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search data nodes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 focus:bg-black/60"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 custom-scrollbar">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${!selectedCategory ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
            >
              All Systems
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex relative z-10">
        {/* A-Z Sidebar */}
        <div className="hidden md:flex flex-col w-12 border-r border-white/5 bg-slate-900/30 overflow-y-auto custom-scrollbar py-4 items-center gap-2">
          <button 
             onClick={() => setSelectedLetter(null)}
             className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${!selectedLetter ? 'bg-cyan-500 text-black' : 'text-slate-500 hover:text-white hover:bg-white/10'}`}
          >
            ALL
          </button>
          <div className="w-4 h-[1px] bg-white/10 my-1"></div>
          {letters.map(letter => (
            <button 
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${selectedLetter === letter ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-500 hover:text-white hover:bg-white/10'}`}
            >
              {letter}
            </button>
          ))}
        </div>

          {/* Term Grid */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 border-r border-white/5 bg-slate-900/20 ${selectedTerm ? 'hidden md:block md:w-80 md:flex-none' : 'block'}`}>
          {filteredTerms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 opacity-50">
               <div className="p-4 bg-white/5 rounded-full mb-4">
                 <Search size={32} />
               </div>
               <p className="text-sm font-mono uppercase tracking-widest">No data nodes found</p>
               <button onClick={() => { setSearchTerm(''); setSelectedCategory(null); setSelectedLetter(null); }} className="mt-4 text-cyan-400 hover:underline text-xs">Reset Filters</button>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredTerms.map((item, idx) => {
                const isActive = selectedTerm?.term === item.term;
                const catColor = item.category === 'Physics' ? 'bg-blue-500' :
                                 item.category === 'Artifacts' ? 'bg-red-500' :
                                 item.category === 'Instrumentation' ? 'bg-amber-500' :
                                 'bg-emerald-500';
                
                return (
                  <button 
                    key={idx}
                    onClick={() => setSelectedTerm(item)}
                    className={`group relative text-left p-3 border-b border-white/5 transition-all duration-200 hover:bg-white/5 flex items-center gap-3 ${isActive ? 'bg-white/5' : ''}`}
                  >
                     {/* Active Indicator */}
                     {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>}
                     
                     {/* Category Color Bar */}
                     <div className={`w-1 h-8 rounded-full opacity-50 group-hover:opacity-100 transition-opacity ${catColor}`}></div>

                     <div className="flex-1 min-w-0">
                        <h3 className={`font-cinzel font-bold text-sm truncate transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white'}`}>
                          {item.term}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 truncate">
                            {item.category}
                          </span>
                          {item.visual && <Activity size={10} className="text-cyan-500/70" />}
                        </div>
                     </div>
                     
                     <ChevronRight size={14} className={`text-slate-600 transition-all ${isActive ? 'text-cyan-500 opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

          {/* Detail View Panel */}
        <div className={`flex-[2] bg-slate-900/90 backdrop-blur-2xl flex flex-col relative overflow-hidden transition-all duration-500 ${selectedTerm ? 'translate-x-0 opacity-100 absolute inset-0 md:relative md:translate-x-0' : 'translate-x-full opacity-0 absolute inset-0 md:relative md:translate-x-0 md:opacity-50'}`}>
           {selectedTerm ? (
             <div className="h-full flex flex-col overflow-y-auto custom-scrollbar relative">
                {/* Background Tech Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-5">
                   <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>
                   <div className="absolute bottom-0 left-0 w-full h-full bg-grid-pattern opacity-20"></div>
                </div>

                {/* Mobile Back Button */}
                <div className="md:hidden p-4 border-b border-white/10 flex items-center z-10 bg-slate-900/80 backdrop-blur-md sticky top-0">
                  <button onClick={() => setSelectedTerm(null)} className="flex items-center text-slate-400 hover:text-white">
                    <ChevronRight className="rotate-180 mr-1" size={16} />
                    <span className="text-xs uppercase font-bold tracking-widest">Back to List</span>
                  </button>
                </div>

                <div className="p-6 md:p-10 relative z-10 max-w-4xl mx-auto w-full">
                  {/* Hero Section */}
                  <div className="flex flex-col gap-6 mb-8 border-b border-white/5 pb-8">
                     <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              selectedTerm.category === 'Physics' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                              selectedTerm.category === 'Artifacts' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                              selectedTerm.category === 'Instrumentation' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                              'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            }`}>
                            {selectedTerm.category} Module
                          </span>
                        </div>
                     </div>
                     
                     <h2 className="text-4xl md:text-5xl font-cinzel font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 leading-tight">
                       {selectedTerm.term}
                     </h2>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Definition & Uplink */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                       {/* Definition Card */}
                       <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                         <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                            selectedTerm.category === 'Physics' ? 'bg-blue-500' :
                            selectedTerm.category === 'Artifacts' ? 'bg-red-500' :
                            selectedTerm.category === 'Instrumentation' ? 'bg-amber-500' :
                            'bg-emerald-500'
                         }`}></div>
                         
                         <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                           <Database size={14} /> Core Definition
                         </h3>
                         <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light">
                           {selectedTerm.definition}
                         </p>
                       </div>

                       {/* Neural Uplink */}
                       <div className="bg-slate-900/50 border border-purple-500/20 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-mono uppercase tracking-widest text-purple-400 flex items-center gap-2">
                              <Brain size={14} /> Neural Uplink Analysis
                            </h3>
                            {isGenerating && <span className="text-[10px] text-purple-400 animate-pulse">SYNTHESIZING...</span>}
                          </div>

                          <div className="flex gap-2 mb-4">
                             <button
                               onClick={() => handleAiAction('explain')}
                               disabled={isGenerating}
                               className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${explanationMode === 'explain' && aiExplanation ? 'bg-purple-500 text-black border-purple-500' : 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20'}`}
                             >
                               Concept Deep Dive
                             </button>
                             <button
                               onClick={() => handleAiAction('clinical')}
                               disabled={isGenerating}
                               className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${explanationMode === 'clinical' && aiExplanation ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'}`}
                             >
                               Clinical Application
                             </button>
                          </div>

                          {(aiExplanation || isGenerating) && (
                            <div className="bg-black/40 rounded-xl p-4 min-h-[100px] relative">
                               {isGenerating ? (
                                 <div className="flex flex-col items-center justify-center h-24 gap-2">
                                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    <div className="text-[10px] font-mono text-purple-400">Processing Query...</div>
                                 </div>
                               ) : (
                                 <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                   {aiExplanation}
                                 </div>
                               )}
                            </div>
                          )}
                       </div>
                    </div>

                    {/* Right Column: Visuals & Related */}
                    <div className="flex flex-col gap-6">
                       {selectedTerm.visual ? (
                         <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                            <div className="p-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
                               <span className="text-[10px] font-mono uppercase text-slate-400">Visual Data</span>
                               <Activity size={12} className="text-cyan-400" />
                            </div>
                            <div className="p-6 flex items-center justify-center min-h-[200px] bg-grid-pattern">
                               {selectedTerm.visual}
                            </div>
                         </div>
                       ) : (
                         <div className="bg-white/5 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2 min-h-[200px]">
                            <Activity size={32} className="text-slate-600 opacity-50" />
                            <span className="text-xs font-mono uppercase text-slate-600">No Visual Data Available</span>
                         </div>
                       )}

                       {/* Related Concepts */}
                       <div className="border-t border-white/5 pt-6">
                          <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-3">Linked Nodes</h3>
                          <div className="flex flex-wrap gap-2">
                            {GLOSSARY_DATA.filter(t => t.category === selectedTerm.category && t.term !== selectedTerm.term).slice(0, 5).map(rel => (
                              <button 
                                key={rel.term}
                                onClick={() => setSelectedTerm(rel)}
                                className="px-2 py-1 rounded text-[10px] font-bold border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all truncate max-w-full"
                              >
                                {rel.term}
                              </button>
                            ))}
                          </div>
                       </div>
                    </div>
                  
                  </div>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8">
               <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                 <Database size={48} className="text-slate-600" />
               </div>
               <h3 className="text-xl font-cinzel font-bold text-slate-400 mb-2">Select a Data Node</h3>
               <p className="text-sm font-mono text-center max-w-md text-slate-600">
                 Access the centralized ultrasound physics database. Select a term from the list or use the search filter to retrieve definition parameters.
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default GlossaryScreen;
