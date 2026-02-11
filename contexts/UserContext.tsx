import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, XPEvent, Badge, Difficulty } from '../types';
import { calculateLevel, checkBadges, XP_REWARDS } from '../utils/gamification';
import { playSfx } from '../services/soundEffects';

interface UserContextType {
  profile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  unlockBadge: (badge: Badge) => void;
  updateStreak: () => void;
  completeMission: (score: number, difficulty: Difficulty) => void;
  spendCurrency: (amount: number) => boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest',
  tag: 'Rookie',
  careerScore: 0,
  currency: 0,
  currentStreak: 0,
  lastActiveDate: new Date().toISOString(),
  avatarVariant: 'echo',
  missionHistory: [],
  completedTopicIds: [],
  badges: [],
  lastDifficulty: 'MEDIUM',
  createdAt: new Date().toISOString(),
  isPro: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('echo_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('echo_user_profile', JSON.stringify(profile));
  }, [profile]);

  const addXP = (amount: number, reason: string) => {
    setProfile(prev => {
      const newScore = prev.careerScore + amount;
      const newCurrency = prev.currency + Math.floor(amount / 10); // 10% of XP becomes currency
      
      // Check for level up
      const oldLevel = calculateLevel(prev.careerScore).currentLevel;
      const newLevel = calculateLevel(newScore).currentLevel;
      
      if (newLevel.level > oldLevel.level) {
        playSfx('level_up'); // Assume this sfx exists or will be ignored
        // Could trigger a modal here
      }

      return {
        ...prev,
        careerScore: newScore,
        currency: newCurrency
      };
    });
  };

  const unlockBadge = (badge: Badge) => {
    setProfile(prev => {
      if (prev.badges.some(b => b.id === badge.id)) return prev;
      playSfx('badge_unlock');
      return {
        ...prev,
        badges: [...prev.badges, { ...badge, unlockedAt: new Date().toISOString() }]
      };
    });
  };

  const updateStreak = () => {
    setProfile(prev => {
      const last = new Date(prev.lastActiveDate);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

      let newStreak = prev.currentStreak;
      if (diffDays === 1) {
        newStreak += 1; // Consecutive day
      } else if (diffDays > 1) {
        newStreak = 1; // Streak broken
      }

      return {
        ...prev,
        currentStreak: newStreak,
        lastActiveDate: now.toISOString()
      };
    });
  };

  const completeMission = (score: number, difficulty: Difficulty) => {
    setProfile(prev => {
      const newHistory = [...prev.missionHistory, {
        id: crypto.randomUUID(),
        date: new Date().toLocaleDateString(),
        score,
        difficulty,
        efficiency: 0, // Todo: calculate
        consultancyUsed: 0,
        maxStreak: 0, // Todo: track in game
        lessons: []
      }];

      // Check for auto-badges
      const tempProfile = { ...prev, missionHistory: newHistory, careerScore: prev.careerScore + score };
      const earnedBadges = checkBadges(tempProfile);
      const uniqueNewBadges = earnedBadges.filter(b => !prev.badges.some(pb => pb.id === b.id));

      return {
        ...tempProfile,
        badges: [...prev.badges, ...uniqueNewBadges]
      };
    });
  };

  const spendCurrency = (amount: number): boolean => {
    if (profile.currency >= amount) {
      setProfile(prev => ({ ...prev, currency: prev.currency - amount }));
      return true;
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ profile, addXP, unlockBadge, updateStreak, completeMission, spendCurrency }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
