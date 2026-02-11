import React, { useState } from 'react';
import { Shield, FileText, Lock, AlertTriangle, X, BookOpen, ExternalLink, Mail } from 'lucide-react';

interface LegalScreenProps {
  onBack: () => void;
}

const LegalScreen: React.FC<LegalScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer' | 'references' | 'support'>('privacy');

  return (
    <div className="w-full h-full bg-slate-950 text-slate-300 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <Shield className="text-cyan-400" size={24} />
          <div>
            <h1 className="text-xl font-bold text-white uppercase tracking-widest font-cinzel">Legal Protocols</h1>
            <p className="text-xs text-slate-500 font-mono">Compliance & Liability Matrix</p>
          </div>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-slate-900/30 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 min-w-[120px] py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all ${activeTab === 'privacy' ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:bg-white/5'}`}
        >
          <Lock size={14} />
          <span>Privacy</span>
        </button>
        <button 
          onClick={() => setActiveTab('terms')}
          className={`flex-1 min-w-[120px] py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all ${activeTab === 'terms' ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:bg-white/5'}`}
        >
          <FileText size={14} />
          <span>Terms</span>
        </button>
        <button 
          onClick={() => setActiveTab('disclaimer')}
          className={`flex-1 min-w-[120px] py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all ${activeTab === 'disclaimer' ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:bg-white/5'}`}
        >
          <AlertTriangle size={14} />
          <span>Disclaimer</span>
        </button>
        <button 
          onClick={() => setActiveTab('references')}
          className={`flex-1 min-w-[120px] py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all ${activeTab === 'references' ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:bg-white/5'}`}
        >
          <BookOpen size={14} />
          <span>References</span>
        </button>
        <button 
          onClick={() => setActiveTab('support')}
          className={`flex-1 min-w-[120px] py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all ${activeTab === 'support' ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:bg-white/5'}`}
        >
          <Mail size={14} />
          <span>Support</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto bg-black/40 border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl">
          
          {activeTab === 'privacy' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-4 mb-8">
                 <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                    <Lock className="text-cyan-400 w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
                    <p className="text-sm text-slate-500">Last Updated: February 2025</p>
                 </div>
              </div>

              <Section title="1. Data Collection">
                <p>We collect minimal data necessary for the functionality of the "Echo Jeopardy" application. This includes:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
                   <li><strong>Authentication Data:</strong> User ID and email provided via Clerk authentication services.</li>
                   <li><strong>Performance Metrics:</strong> Quiz scores, progress tracking, and leaderboard rankings stored in our Convex database.</li>
                   <li><strong>Usage Data:</strong> Anonymized interaction data to improve the educational experience.</li>
                </ul>
              </Section>

              <Section title="2. Data Usage">
                <p>Your data is used exclusively for:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
                   <li>Providing personalized study recommendations via "Professor Harvey" (Gemini AI).</li>
                   <li>Maintaing your progress across sessions.</li>
                   <li>Displaying your ranking on the global leaderboard.</li>
                </ul>
              </Section>

              <Section title="3. Third-Party Services">
                <p>We utilize trusted third-party services:</p>
                <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
                   <li><strong>Clerk:</strong> For secure identity management.</li>
                   <li><strong>Convex:</strong> For real-time database functionality.</li>
                   <li><strong>Google Gemini:</strong> For AI-powered tutoring. Note that chat queries are processed by Google's API.</li>
                </ul>
              </Section>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center space-x-4 mb-8">
                 <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/20">
                    <FileText className="text-purple-400 w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
                    <p className="text-sm text-slate-500">Acceptance of Use Protocols</p>
                 </div>
              </div>

              <Section title="1. Educational Purpose">
                 <p>Echo Jeopardy is strictly an educational tool designed for Ultrasound Physics (SPI) registry preparation. It is NOT a medical device and should not be used for clinical decision-making.</p>
              </Section>

              <Section title="2. User Conduct">
                 <p>Users agree to:</p>
                 <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
                    <li>Provide accurate registration information.</li>
                    <li>Maintain the confidentiality of their account credentials.</li>
                    <li>Use the AI "Study Buddy" feature respectfully and for educational queries only.</li>
                 </ul>
              </Section>

              <Section title="3. Intellectual Property">
                 <p>All content, including the "Echo Jeopardy" game mechanics, custom visuals, and curriculum data, is the property of the application developers. Unauthorized reproduction or resale is prohibited.</p>
              </Section>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center space-x-4 mb-8">
                 <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                    <AlertTriangle className="text-yellow-400 w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-white">Medical Disclaimer</h2>
                    <p className="text-sm text-slate-500">Critical Safety Information</p>
                 </div>
              </div>

              <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                 <p className="text-yellow-200 font-bold mb-4">NOT MEDICAL ADVICE</p>
                 <p className="text-slate-300 leading-relaxed">
                    This application contains information regarding medical ultrasound physics. It is intended for <strong>examination preparation only</strong> (ARDMS SPI). 
                 </p>
                 <p className="text-slate-300 leading-relaxed mt-4">
                    Nothing in this application constitutes medical advice, diagnosis, or treatment. Do not use this information to perform ultrasound examinations on patients or to interpret medical images for clinical purposes.
                 </p>
              </div>

              <Section title="Accuracy of Information">
                 <p>While we strive for accuracy in accordance with current ARDMS SPI content outlines, medical physics standards evolve. We do not guarantee that all information is completely up-to-date or error-free.</p>
              </Section>

              <Section title="AI Limitations">
                 <p>"Professor Harvey" is an AI-powered assistant. AI models can occasionally produce incorrect or "hallucinated" information. Always verify physics formulas and principles with standard textbooks (e.g., Edelman, Kremkau).</p>
              </Section>
            </div>
          )}

          {activeTab === 'references' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center space-x-4 mb-8">
                 <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <BookOpen className="text-emerald-400 w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-white">References & Citations</h2>
                    <p className="text-sm text-slate-500">Curriculum Source Material</p>
                 </div>
              </div>

              <Section title="Core Textbooks">
                 <p>The curriculum and quiz data in this application are based on standard Ultrasound Physics principles found in:</p>
                 <ul className="list-none space-y-4 mt-4">
                    <li className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                       <p className="text-cyan-400 font-bold text-sm mb-1">Understanding Ultrasound Physics</p>
                       <p className="text-slate-400 text-xs">Sidney K. Edelman, Ph.D.</p>
                       <p className="text-slate-500 text-[10px] mt-2 font-mono">Primary source for Doppler and Artifact modules.</p>
                    </li>
                    <li className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                       <p className="text-cyan-400 font-bold text-sm mb-1">Sonography Principles and Instruments</p>
                       <p className="text-slate-400 text-xs">Frederick W. Kremkau, Ph.D.</p>
                       <p className="text-slate-500 text-[10px] mt-2 font-mono">Primary source for Transducer and Bio-effects modules.</p>
                    </li>
                 </ul>
              </Section>

              <Section title="Standard Bodies">
                 <p>Curriculum aligns with content outlines provided by:</p>
                 <ul className="list-disc pl-5 space-y-2 mt-2 text-slate-400">
                    <li><strong>ARDMS:</strong> American Registry for Diagnostic Medical Sonography (SPI Content Outline).</li>
                    <li><strong>AIUM:</strong> American Institute of Ultrasound in Medicine (Bio-effects Statements).</li>
                 </ul>
              </Section>

              <Section title="External Resources">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <a href="https://www.ardms.org" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-900 border border-white/10 rounded-lg hover:border-cyan-500/50 group transition-all">
                       <span className="text-sm font-bold text-slate-300 group-hover:text-cyan-400">ARDMS Official Site</span>
                       <ExternalLink size={14} className="text-slate-500 group-hover:text-cyan-400" />
                    </a>
                    <a href="https://www.aium.org" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-900 border border-white/10 rounded-lg hover:border-cyan-500/50 group transition-all">
                       <span className="text-sm font-bold text-slate-300 group-hover:text-cyan-400">AIUM Official Site</span>
                       <ExternalLink size={14} className="text-slate-500 group-hover:text-cyan-400" />
                    </a>
                 </div>
              </Section>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center space-x-4 mb-8">
                 <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/20">
                    <Mail className="text-purple-400 w-8 h-8" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold text-white">Customer Support</h2>
                    <p className="text-sm text-slate-500">Assistance & Inquiries</p>
                 </div>
              </div>

              <Section title="Contact Information">
                 <p>For any technical issues, account inquiries, or general questions regarding the Echo Jeopardy platform, please contact our support team.</p>
                 
                 <div className="mt-6 p-6 bg-slate-900/50 border border-white/10 rounded-xl flex items-center justify-between group hover:border-purple-500/50 transition-all">
                    <div className="flex items-center space-x-4">
                       <div className="p-3 bg-white/5 rounded-lg">
                          <Mail className="text-purple-400" size={20} />
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Official Support Email</p>
                          <a href="mailto:info@spiphysic.com" className="text-lg font-mono text-white group-hover:text-purple-400 transition-colors">info@spiphysic.com</a>
                       </div>
                    </div>
                    <ExternalLink size={16} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                 </div>
              </Section>

              <Section title="Response Time">
                 <p>Our support team typically responds to inquiries within 24-48 hours during standard business days. For urgent technical issues affecting access to the platform, please mark your email subject with [URGENT].</p>
              </Section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-b border-white/5 pb-8 last:border-0">
    <h3 className="text-lg font-bold text-cyan-400 mb-4 uppercase tracking-wider">{title}</h3>
    <div className="text-slate-300 leading-relaxed text-sm md:text-base">
      {children}
    </div>
  </div>
);

export default LegalScreen;
