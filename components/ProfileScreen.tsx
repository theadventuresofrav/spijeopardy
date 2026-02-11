import React, { useState, useEffect } from 'react';
import { UserProfile, Badge } from '../types';
import { LevelProgress } from './LevelProgress';
import { calculateLevel } from '../utils/gamification';
import { ShieldCheck, Target, Zap, Activity, Calendar, Award, Database, Cpu, BrainCircuit, BarChart2, Users, CheckSquare, TrendingUp, Play, BookOpen, MessageSquare, Library, FunctionSquare, Shield, LogOut, Lock, DollarSign, Mic, Palette, Snowflake, Image, Edit2, Save, X } from 'lucide-react';
import HostAvatar from './HostAvatar';
import { useQuery } from "convex/react";
// @ts-ignore
import { api } from "../convex/_generated/api";

const BADGE_ICONS: Record<string, React.FC<any>> = {
  Zap,
  DollarSign,
  Activity,
  BookOpen,
  Target,
  Award,
  ShieldCheck
};

interface ProfileScreenProps {
  profile: UserProfile;
  isConvexEnabled?: boolean;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
  onBack?: () => void;
  onStartGame?: () => void;
  onViewArchive?: () => void;
  onViewVault?: () => void;
  onViewCourse?: () => void;
  onViewStudyBuddy?: () => void;
  onViewGlossary?: () => void;
  onViewFormulas?: () => void;
  onViewExam?: () => void;
  onViewLegal?: () => void;
}

const MOCK_LEADERBOARD = [
  { id: 'bot1', tag: 'DOPPLER_PRIME', score: 125000, rank: 1, avatarVariant: 'hertz' },
  { id: 'bot2', tag: 'ECHO_VANGUARD', score: 98000, rank: 2, avatarVariant: 'echo' },
  { id: 'bot3', tag: 'SONIC_BOOM', score: 75400, rank: 3, avatarVariant: 'harvey' },
  { id: 'bot4', tag: 'WAVE_RUNNER', score: 45000, rank: 4, avatarVariant: 'echo' },
  { id: 'bot5', tag: 'PHYSICS_GURU', score: 32000, rank: 5, avatarVariant: 'hertz' },
];

const LeaderboardTable: React.FC<{ data: any[], currentProfileId: string }> = ({ data, currentProfileId }) => (
  <div className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden animate-in slide-in-from-right-8 duration-500">
    <div className="grid grid-cols-12 gap-4 p-6 bg-white/5 border-b border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
       <div className="col-span-2 text-center">Rank</div>
       <div className="col-span-6">Operator</div>
       <div className="col-span-4 text-right">Resonance</div>
    </div>
    <div className="divide-y divide-white/5">
       {data.map((entry) => (
         <div key={entry.id} className={`grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/5 transition-colors ${entry.id === currentProfileId ? 'bg-cyan-500/5' : ''}`}>
            <div className="col-span-2 flex justify-center">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black font-cinzel text-lg ${entry.rank === 1 ? 'bg-yellow-500 text-black' : entry.rank === 2 ? 'bg-slate-300 text-black' : entry.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {entry.rank}
              </div>
            </div>
            <div className="col-span-6 flex items-center space-x-4">
               <div className="scale-75 origin-left hidden md:block"><HostAvatar mood="neutral" careerScore={entry.score} variant="header" type={entry.avatarVariant} /></div>
               <div>
                  <div className={`font-black font-cinzel text-sm md:text-xl ${entry.id === currentProfileId ? 'text-cyan-400' : 'text-white'}`}>{entry.tag}</div>
                  {entry.id === currentProfileId && <div className="text-[9px] text-cyan-600 uppercase tracking-widest font-bold">YOU</div>}
               </div>
            </div>
            <div className="col-span-4 text-right">
               <div className="font-mono font-bold text-white text-sm md:text-xl">${entry.score.toLocaleString()}</div>
            </div>
         </div>
       ))}
    </div>
  </div>
);

const RealLeaderboard: React.FC<{ currentProfileId: string; isConvexEnabled: boolean }> = ({ currentProfileId, isConvexEnabled }) => {
  const convexLeaderboard = useQuery(api.users.getLeaderboard);
  
  if (!isConvexEnabled) {
      return <LeaderboardTable data={MOCK_LEADERBOARD} currentProfileId={currentProfileId} />;
  }

  if (convexLeaderboard === undefined) {
    return <div className="text-center py-12 text-slate-500 animate-pulse font-mono tracking-widest text-xs">ESTABLISHING UPLINK...</div>;
  }

  return <LeaderboardTable data={convexLeaderboard} currentProfileId={currentProfileId} />;
};

const NavButton: React.FC<{ icon: any, label: string, onClick?: () => void, primary?: boolean, danger?: boolean }> = ({ icon: Icon, label, onClick, primary, danger }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-4 transition-all group relative overflow-hidden
      ${primary 
        ? 'bg-cyan-600/20 border-cyan-400 hover:bg-cyan-500/30 text-white shadow-[0_0_30px_rgba(8,145,178,0.2)] hover:shadow-[0_0_50px_rgba(8,145,178,0.4)] hover:scale-105' 
        : danger
          ? 'bg-red-900/10 border-red-900/30 hover:bg-red-900/20 text-red-400 hover:border-red-500/50'
          : 'bg-slate-900/60 border-white/5 hover:bg-white/5 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]'
      }
    `}
  >
    {primary && <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent"></div>}
    <div className={`p-3 rounded-xl transition-all duration-500 group-hover:scale-110 ${primary ? 'bg-cyan-500 text-black' : danger ? 'bg-red-500/10' : 'bg-slate-800 group-hover:bg-cyan-500/20'}`}>
        <Icon size={24} className={`${primary ? 'text-black' : danger ? 'text-red-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
    </div>
    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-center z-10">{label}</span>
  </button>
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  profile, 
  isConvexEnabled = false,
  onUpdateProfile,
  onBack,
  onStartGame,
  onViewArchive,
  onViewVault,
  onViewCourse,
  onViewStudyBuddy,
  onViewGlossary,
  onViewFormulas,
  onViewExam,
  onViewLegal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'store'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    tag: profile.tag,
    role: profile.role || '',
    institution: profile.institution || '',
    targetExam: profile.targetExam || '',
    bio: profile.bio || ''
  });

  useEffect(() => {
    setEditForm({
        tag: profile.tag,
        role: profile.role || '',
        institution: profile.institution || '',
        targetExam: profile.targetExam || '',
        bio: profile.bio || ''
    });
  }, [profile]);

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        tag: editForm.tag,
        role: editForm.role,
        institution: editForm.institution,
        targetExam: editForm.targetExam,
        bio: editForm.bio
      });
    }
    setIsEditing(false);
  };

  const levelInfo = calculateLevel(profile.careerScore);
  const totalSyncs = profile.missionHistory.length;
  const avgEfficiency = totalSyncs > 0 
    ? Math.round(profile.missionHistory.reduce((acc, curr) => acc + curr.efficiency, 0) / totalSyncs) 
    : 0;

  // Merge user into leaderboard
  const fullLeaderboard = [...MOCK_LEADERBOARD, { 
    id: profile.id, 
    tag: profile.tag, 
    score: profile.careerScore, 
    rank: 0, 
    avatarVariant: profile.avatarVariant 
  }].sort((a, b) => b.score - a.score).map((p, idx) => ({ ...p, rank: idx + 1 }));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-24 px-4 md:px-8 font-sans">
      {/* Hero Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-16 relative overflow-hidden text-center md:text-left shadow-2xl">
        <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] pointer-events-none">
          <BrainCircuit size={150} className="md:w-[400px] md:h-[400px]" />
        </div>

        {/* Edit Button */}
        {onUpdateProfile && (
           <button 
             onClick={() => isEditing ? handleSave() : setIsEditing(true)}
             className="absolute top-8 right-8 z-20 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors group"
           >
             {isEditing ? <Save className="text-emerald-400" size={20} /> : <Edit2 className="text-slate-400 group-hover:text-cyan-400" size={20} />}
           </button>
        )}
        
        {isEditing && (
            <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-8 right-24 z-20 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors group"
            >
                <X className="text-slate-400 group-hover:text-red-400" size={20} />
            </button>
        )}
        
        <div className="relative group shrink-0">
           <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl group-hover:blur-3xl group-hover:scale-110 transition-all duration-700"></div>
           <HostAvatar mood="neutral" careerScore={profile.careerScore} variant="hero" type={profile.avatarVariant} />
        </div>

        <div className="flex-1 space-y-4 md:space-y-6 overflow-hidden w-full relative z-10">
           {isEditing ? (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                <div>
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">Operator Tag</label>
                    <input 
                        type="text" 
                        value={editForm.tag}
                        onChange={(e) => setEditForm({...editForm, tag: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-cinzel font-bold text-xl focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">Role / Title</label>
                        <input 
                            type="text" 
                            value={editForm.role}
                            onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                            placeholder="e.g. Student Sonographer"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">Institution</label>
                        <input 
                            type="text" 
                            value={editForm.institution}
                            onChange={(e) => setEditForm({...editForm, institution: e.target.value})}
                            placeholder="e.g. General Hospital"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                        />
                    </div>
                </div>
                <div>
                     <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">Target Exam</label>
                     <select 
                        value={editForm.targetExam}
                        onChange={(e) => setEditForm({...editForm, targetExam: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                     >
                        <option value="">Select Exam...</option>
                        <option value="SPI">SPI (Physics)</option>
                        <option value="AB">Abdomen (AB)</option>
                        <option value="OB/GYN">OB/GYN</option>
                        <option value="AE">Adult Echo (AE)</option>
                        <option value="VT">Vascular (VT)</option>
                        <option value="PEDS">Pediatric Sonography</option>
                     </select>
                </div>
                <div>
                     <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">Bio / Mission Statement</label>
                     <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        placeholder="Enter your mission statement..."
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                     />
                </div>
             </div>
           ) : (
             <div>
              <div className="flex items-center justify-center md:justify-start space-x-2 md:space-x-3 mb-2">
                 <ShieldCheck className="text-cyan-500" size={14} />
                 <span className="text-[9px] md:text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] font-mono">Operator_Verified</span>
                 {profile.role && (
                       <>
                         <span className="text-slate-600">|</span>
                         <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{profile.role}</span>
                       </>
                   )}
              </div>
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-cinzel font-black text-white tracking-tight uppercase truncate drop-shadow-lg">{profile.tag}</h2>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-2 justify-center md:justify-start">
                    <p className={`text-sm md:text-xl font-cinzel font-bold uppercase tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]`}>{levelInfo.currentLevel.title} // LVL {levelInfo.currentLevel.level}</p>
                    {profile.institution && <span className="hidden md:inline text-slate-600">|</span>}
                    {profile.institution && <p className="text-xs md:text-sm font-mono text-slate-500 uppercase tracking-widest">{profile.institution}</p>}
              </div>
              {profile.bio && (
                 <p className="mt-4 text-xs md:text-sm text-slate-400 max-w-lg mx-auto md:mx-0 leading-relaxed italic border-l-2 border-slate-700 pl-4">
                    "{profile.bio}"
                 </p>
              )}
              {profile.targetExam && (
                    <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <Target size={12} className="text-amber-400" />
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Target: {profile.targetExam}</span>
                    </div>
                )}
             </div>
           )}
           
           {!isEditing && (
            <div className="max-w-xl mx-auto md:mx-0">
                <LevelProgress xp={profile.careerScore} />
            </div>
           )}

           <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 pt-2">
              <div className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl flex items-center space-x-2 backdrop-blur-md">
                 <Calendar className="text-slate-400" size={14} />
                 <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">Est. {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-2 backdrop-blur-md">
                 <Activity className="text-emerald-400" size={14} />
                 <span className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">{totalSyncs} Syncs</span>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center md:justify-start space-x-8 border-b border-white/5 pb-1">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all flex items-center gap-3 relative group ${activeTab === 'overview' ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <BarChart2 size={18} />
          <span>Dashboard</span>
          <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transition-all duration-300 ${activeTab === 'overview' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'}`}></div>
        </button>
        <button 
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-4 px-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all flex items-center gap-3 relative group ${activeTab === 'leaderboard' ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <Users size={18} />
          <span>Global Ranking</span>
          <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transition-all duration-300 ${activeTab === 'leaderboard' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'}`}></div>
        </button>
        <button 
          onClick={() => setActiveTab('store')}
          className={`pb-4 px-2 font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all flex items-center gap-3 relative group ${activeTab === 'store' ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <DollarSign size={18} />
          <span>Requisition</span>
          <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 transition-all duration-300 ${activeTab === 'store' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'}`}></div>
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 md:space-y-12 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             <div className="tech-border-container p-0.5 rounded-2xl">
                <div className="bg-slate-900/80 p-6 rounded-2xl flex flex-col items-center text-center h-full justify-center group hover:bg-white/5 transition-colors">
                   <div className="p-4 bg-cyan-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Target size={32} className="text-cyan-400" />
                   </div>
                   <h3 className="text-3xl md:text-4xl font-black font-cinzel text-white mb-1 shadow-glow">{profile.careerScore.toLocaleString()}</h3>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Total Resonance (XP)</p>
                </div>
             </div>

             <div className="tech-border-container p-0.5 rounded-2xl">
                <div className="bg-slate-900/80 p-6 rounded-2xl flex flex-col items-center text-center h-full justify-center group hover:bg-white/5 transition-colors">
                   <div className="p-4 bg-amber-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <DollarSign size={32} className="text-amber-400" />
                   </div>
                   <h3 className="text-3xl md:text-4xl font-black font-cinzel text-amber-400 mb-1 shadow-glow">{profile.currency?.toLocaleString() || 0}</h3>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Echo Credits</p>
                </div>
             </div>

             <div className="tech-border-container p-0.5 rounded-2xl">
                <div className="bg-slate-900/80 p-6 rounded-2xl flex flex-col items-center text-center h-full justify-center group hover:bg-white/5 transition-colors">
                   <div className="p-4 bg-red-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Zap size={32} className="text-red-400" />
                   </div>
                   <h3 className="text-3xl md:text-4xl font-black font-cinzel text-white mb-1 shadow-glow">{profile.currentStreak || 0}</h3>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Day Streak</p>
                </div>
             </div>

             <div className="tech-border-container p-0.5 rounded-2xl">
                <div className="bg-slate-900/80 p-6 rounded-2xl flex flex-col items-center text-center h-full justify-center group hover:bg-white/5 transition-colors">
                   <div className="p-4 bg-emerald-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp size={32} className="text-emerald-400" />
                   </div>
                   <h3 className="text-3xl md:text-4xl font-black font-cinzel text-white mb-1 shadow-glow">{avgEfficiency}%</h3>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Avg. Efficiency</p>
                </div>
             </div>
          </div>

          {/* Daily Directives (Quests) */}
          <div className="tech-border-container p-0.5 rounded-3xl">
             <div className="bg-slate-950/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-cyan-500/5"></div>
                <div className="flex items-center space-x-3 mb-6 relative z-10">
                   <CheckSquare className="text-cyan-400" size={24} />
                   <h3 className="text-xl font-cinzel font-black uppercase tracking-widest text-white">Daily Directives</h3>
                   <div className="h-px bg-white/10 flex-1"></div>
                   <span className="text-xs font-mono text-slate-500">Resets in 12:00:00</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                   <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <Activity size={18} className="text-emerald-400" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-200 uppercase">Complete 1 Mission</p>
                            <p className="text-[10px] text-slate-500 font-mono">Progress: {profile.missionHistory.length > 0 ? '1/1' : '0/1'}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-black text-amber-400">+50 XP</span>
                         {profile.missionHistory.length > 0 && <CheckSquare size={14} className="text-emerald-500 ml-auto mt-1" />}
                      </div>
                   </div>

                   <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                            <Zap size={18} className="text-purple-400" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-200 uppercase">Maintain Streak</p>
                            <p className="text-[10px] text-slate-500 font-mono">Current: {profile.currentStreak} Days</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-black text-amber-400">+100 XP</span>
                      </div>
                   </div>

                   <div className="bg-slate-900/60 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <BookOpen size={18} className="text-blue-400" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-200 uppercase">Review Glossary</p>
                            <p className="text-[10px] text-slate-500 font-mono">Pending</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-black text-amber-400">+25 XP</span>
                         <button onClick={onViewGlossary} className="text-[8px] uppercase tracking-widest text-cyan-500 hover:text-cyan-400 mt-1">GO</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Badges Section */}
          <div className="tech-border-container p-0.5 rounded-3xl">
             <div className="bg-slate-950/80 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="flex items-center space-x-3 mb-8 relative z-10">
                   <Award className="text-yellow-400" size={24} />
                   <h3 className="text-xl font-cinzel font-black uppercase tracking-widest text-white">Neural Achievements</h3>
                   <div className="h-px bg-white/10 flex-1"></div>
                   <span className="text-xs font-mono text-slate-500">{profile.badges.length} Unlocked</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 relative z-10">
                   {profile.badges.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-slate-600 font-mono text-xs uppercase tracking-widest">
                         No achievements recorded. Begin simulations to earn rewards.
                      </div>
                   ) : (
                      profile.badges.map((badge, i) => {
                         const Icon = BADGE_ICONS[badge.icon] || Award;
                         return (
                            <div key={i} className="group relative flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/5 transition-colors">
                               <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mb-3 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-500">
                                  <Icon size={32} className="text-slate-500 group-hover:text-yellow-400 transition-colors" />
                               </div>
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white mb-1">{badge.name}</h4>
                               
                               {/* Tooltip */}
                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 border border-white/20 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                  <p className="text-[10px] text-slate-300 leading-relaxed text-center">{badge.description}</p>
                                  <div className="text-[8px] text-slate-600 font-mono mt-2 text-center">Unlocked: {new Date(badge.unlockedAt || '').toLocaleDateString()}</div>
                               </div>
                            </div>
                         );
                      })
                   )}
                </div>
             </div>
          </div>

          {/* Command Center Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             <NavButton icon={Play} label="Initiate Mission" onClick={onStartGame} primary />
             <NavButton icon={BookOpen} label="Lecture Hall" onClick={onViewCourse} />
             <NavButton icon={MessageSquare} label="Study Buddy" onClick={onViewStudyBuddy} />
             <NavButton icon={Activity} label="Mock Exam" onClick={onViewExam} />
             <NavButton icon={Library} label="Data Glossary" onClick={onViewGlossary} />
             <NavButton icon={FunctionSquare} label="Formula Hub" onClick={onViewFormulas} />
             <NavButton icon={Shield} label="Legal / Support" onClick={onViewLegal} />
             <NavButton icon={LogOut} label="Disengage" onClick={onBack} danger />
          </div>

          {/* Badge Collection */}
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-cinzel font-black text-white mb-6 flex items-center gap-3">
              <Award className="text-yellow-500" />
              <span>Badge Collection</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {profile.badges?.map((badge, idx) => {
                 const BadgeIcon = BADGE_ICONS[badge.icon] || Award;
                 return (
                   <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center gap-2 group hover:bg-white/10 transition-colors">
                      <div className="mb-2 group-hover:scale-110 transition-transform text-yellow-400">
                        <BadgeIcon size={32} />
                      </div>
                      <div className="font-black text-xs text-white uppercase tracking-widest">{badge.name}</div>
                      <div className="text-[10px] text-slate-400">{badge.description}</div>
                      <div className="text-[9px] text-cyan-500 font-mono mt-1">{badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'Unknown'}</div>
                   </div>
                 );
               })}
               {(!profile.badges || profile.badges.length === 0) && (
                 <div className="col-span-full text-center py-8 text-slate-500 italic flex flex-col items-center gap-2">
                    <Lock size={24} />
                    <span>Classified. Complete missions to unlock.</span>
                 </div>
               )}
            </div>
          </div>

          {/* Skill Matrix & Exam History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Skill Matrix (Mock) */}
             <div className="tech-border-container p-0.5 rounded-3xl">
                <div className="bg-slate-900/80 p-8 rounded-3xl h-full flex flex-col">
                   <div className="flex items-center space-x-3 mb-6">
                      <BrainCircuit className="text-cyan-400" size={24} />
                      <h3 className="text-xl font-cinzel font-black uppercase tracking-widest text-white">Neural Proficiency</h3>
                   </div>
                   
                   <div className="space-y-4 flex-1">
                      {[
                        { label: 'Physics', val: 75, color: 'bg-cyan-500' },
                        { label: 'Artifacts', val: 45, color: 'bg-purple-500' },
                        { label: 'Instrumentation', val: 60, color: 'bg-emerald-500' },
                        { label: 'Bio-Effects', val: 90, color: 'bg-amber-500' },
                      ].map((skill, i) => (
                         <div key={i} className="group">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                               <span className="group-hover:text-white transition-colors">{skill.label}</span>
                               <span className="font-mono">{skill.val}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                               <div className={`h-full ${skill.color} relative`} style={{ width: `${skill.val}%` }}>
                                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Exam History */}
             {profile.examHistory && profile.examHistory.length > 0 ? (
               <div className="tech-border-container p-0.5 rounded-3xl">
                  <div className="bg-slate-900/80 p-8 rounded-3xl h-full overflow-hidden">
                    <div className="flex items-center space-x-3 mb-6">
                      <TrendingUp className="text-teal-400" size={24} />
                      <h3 className="text-xl font-cinzel font-black text-white uppercase tracking-widest">Exam Logs</h3>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                       {profile.examHistory.slice().reverse().map((exam, idx) => (
                         <div key={exam.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div>
                              <div className="text-xs font-bold text-slate-200">Mock SPI Protocol</div>
                              <div className="text-[10px] text-slate-500 font-mono">{new Date(exam.date).toLocaleDateString()}</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${exam.score >= 77 ? 'text-emerald-400' : 'text-red-400'}`}>
                                 {Math.round((exam.score / 110) * 100)}%
                              </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
             ) : (
                <div className="tech-border-container p-0.5 rounded-3xl">
                   <div className="bg-slate-900/80 p-8 rounded-3xl h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-4 bg-white/5 rounded-full">
                         <Activity className="text-slate-600" size={32} />
                      </div>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">No Exam Data Available</p>
                      <button onClick={onViewExam} className="px-6 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-black uppercase tracking-widest transition-all">
                         Launch Simulation
                      </button>
                   </div>
                </div>
             )}
          </div>

        </div>
      )}

      {activeTab === 'leaderboard' && (
        isConvexEnabled ? (
          <RealLeaderboard currentProfileId={profile.id} />
        ) : (
          <LeaderboardTable data={fullLeaderboard} currentProfileId={profile.id} />
        )
      )}

      {activeTab === 'store' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
           {/* Store Header */}
           <div className="col-span-full flex items-center justify-between mb-4">
              <h3 className="text-xl font-cinzel font-black uppercase tracking-widest text-white">Requisition</h3>
              <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                 <div className="text-yellow-400 font-black">$</div>
                 <span className="text-yellow-400 font-mono font-bold">{profile.currency || 0}</span>
              </div>
           </div>

           {[
             { id: 1, name: "Neural Frame: Gold", cost: 500, icon: ShieldCheck, desc: "Exclusive avatar border.", type: "COSMETIC" },
             { id: 2, name: "XP Booster (1h)", cost: 200, icon: Zap, desc: "+50% XP gain for 1 hour.", type: "CONSUMABLE" },
             { id: 3, name: "Voice Pack: Legacy", cost: 1000, icon: Mic, desc: "Unlock classic narrator voices.", type: "AUDIO" },
             { id: 4, name: "Theme: Cyber-Red", cost: 750, icon: Palette, desc: "Aggressive red UI theme.", type: "COSMETIC" },
             { id: 5, name: "Streak Freeze", cost: 150, icon: Snowflake, desc: "Prevent streak reset for 24h.", type: "CONSUMABLE" },
             { id: 6, name: "Profile Background", cost: 300, icon: Image, desc: "Custom holographic backdrops.", type: "COSMETIC" }
           ].map((item) => (
             <div key={item.id} className="tech-border-container p-0.5 rounded-2xl group">
                <div className="bg-slate-900/80 p-6 rounded-2xl h-full flex flex-col relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   
                   <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl bg-slate-800 group-hover:bg-cyan-500/20 transition-colors`}>
                         <item.icon className="text-slate-400 group-hover:text-cyan-400" size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/10 px-2 py-1 rounded">{item.type}</span>
                   </div>
                   
                   <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{item.name}</h4>
                   <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1">{item.desc}</p>
                   
                   <button 
                     disabled={(profile.currency || 0) < item.cost}
                     className={`w-full py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all ${
                       (profile.currency || 0) >= item.cost 
                         ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                         : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5'
                     }`}
                   >
                      <span>Purchase</span>
                      <span className="w-px h-3 bg-current opacity-30"></span>
                      <span>${item.cost}</span>
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Hardware Interface Info */}
      <div className="pt-8 md:pt-12 text-center opacity-20">
         <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-1 text-slate-500">
            <Cpu size={12} md:size={14} />
            <span className="font-mono text-[7px] md:text-[9px] uppercase tracking-widest">Matrix_Stable</span>
         </div>
         <p className="text-[6px] md:text-[8px] text-slate-700 font-black uppercase tracking-[0.4em] md:tracking-[0.5em]">Neural Link Matrix Core</p>
      </div>
    </div>
  );
};

export default ProfileScreen;