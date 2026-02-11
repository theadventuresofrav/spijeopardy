import { UserProfile, XPEvent, Badge, Level, Difficulty } from '../types';

// Leveling Config
const BASE_XP = 1000;
const GROWTH_FACTOR = 1.5;

export const XP_REWARDS = {
  CORRECT_ANSWER_EASY: 100,
  CORRECT_ANSWER_MEDIUM: 200,
  CORRECT_ANSWER_HARD: 300,
  DAILY_DOUBLE_BONUS: 150,
  LESSON_COMPLETE: 500,
  PERFECT_GAME: 2000,
  STREAK_MILESTONE: 250, // Per 10 streak
};

export const LEVELS: Level[] = Array.from({ length: 50 }, (_, i) => {
  const level = i + 1;
  return {
    level,
    title: getLevelTitle(level),
    xpRequired: Math.floor(BASE_XP * Math.pow(level, GROWTH_FACTOR)),
  };
});

function getLevelTitle(level: number): string {
  if (level < 5) return "Sonography Student";
  if (level < 10) return "Clinical Intern";
  if (level < 20) return "Registered Sonographer";
  if (level < 30) return "Lead Tech";
  if (level < 40) return "Department Manager";
  if (level < 50) return "Physics Professor";
  return "Sound Wave Sorcerer";
}

export const calculateLevel = (currentXP: number): { currentLevel: Level, nextLevel: Level, progress: number } => {
  let levelIndex = 0;
  while (levelIndex < LEVELS.length - 1 && currentXP >= LEVELS[levelIndex].xpRequired) {
    levelIndex++;
  }
  
  const currentLevel = LEVELS[levelIndex];
  const nextLevel = LEVELS[levelIndex + 1] || currentLevel; // Cap at max level
  
  const prevLevelXP = levelIndex > 0 ? LEVELS[levelIndex - 1].xpRequired : 0;
  const levelSpan = nextLevel.xpRequired - prevLevelXP;
  const progressInLevel = currentXP - prevLevelXP;
  
  return {
    currentLevel,
    nextLevel,
    progress: Math.min(100, Math.max(0, (progressInLevel / levelSpan) * 100))
  };
};

export const checkBadges = (profile: UserProfile): Badge[] => {
  const newBadges: Badge[] = [];
  const currentBadgeIds = new Set(profile.badges.map(b => b.id));

  // Helper to add badge
  const award = (badge: Badge) => {
    if (!currentBadgeIds.has(badge.id)) {
      newBadges.push({ ...badge, unlockedAt: new Date().toISOString() });
    }
  };

  // 1. Initiate (First Mission)
  if (profile.missionHistory.length > 0) {
    award({ id: 'initiate', name: 'Initiate', description: 'Complete your first mission.', icon: 'Zap' });
  }

  // 2. High Roller (Earn > 10,000 career score)
  if (profile.careerScore >= 10000) {
    award({ id: 'high_roller', name: 'High Roller', description: 'Accumulate 10,000 career points.', icon: 'DollarSign' });
  }

  // 3. Streaker (Streak > 5 in any mission)
  const maxStreakEver = Math.max(...profile.missionHistory.map(m => m.maxStreak), 0);
  if (maxStreakEver >= 10) {
    award({ id: 'resonance_master', name: 'Resonance Master', description: 'Achieve a 10-answer streak.', icon: 'Activity' });
  }

  // 4. Scholar (Complete 5 Topics)
  if (profile.completedTopicIds.length >= 5) {
    award({ id: 'scholar', name: 'Scholar', description: 'Complete 5 educational modules.', icon: 'BookOpen' });
  }

  // 5. Physicist (Perfect Game)
  const hasPerfectGame = profile.missionHistory.some(m => m.efficiency >= 100); // Assuming efficiency tracks accuracy
  if (hasPerfectGame) {
    award({ id: 'physicist', name: 'Physicist', description: 'Complete a mission with 100% accuracy.', icon: 'Target' });
  }

  return newBadges;
};
