
export enum GameState {
  LANDING = 'LANDING',
  INTRO = 'INTRO',
  LOADING_BOARD = 'LOADING_BOARD',
  BOARD = 'BOARD',
  CLUE_ACTIVE = 'CLUE_ACTIVE',
  JUDGING = 'JUDGING',
  GAME_OVER = 'GAME_OVER',
  FASTEST_FINGER = 'FASTEST_FINGER',
  FINAL_JEOPARDY = 'FINAL_JEOPARDY',
  DAILY_DOUBLE_WAGER = 'DAILY_DOUBLE_WAGER',
  ARCHIVE = 'ARCHIVE',
  VAULT = 'VAULT',
  COURSE = 'COURSE',
  STUDY_BUDDY = 'STUDY_BUDDY',
  PROFILE = 'PROFILE',
  GLOSSARY = 'GLOSSARY',
  FORMULA_HUB = 'FORMULA_HUB',
  EXAM = 'EXAM',
  DEMO_MODE = 'DEMO_MODE',
  CINEMATIC_INTRO = 'CINEMATIC_INTRO',
  LEGAL = 'LEGAL'
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  imageUrl?: string;
}

export interface ExamAttempt {
  id: string;
  date: string;
  score: number;
  timeSpentSeconds: number;
  answers: Record<string, number>; // questionId -> selectedIndex
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Clue {
  id: string;
  value: number;
  clueText: string;
  correctAnswer: string;
  isAnswered: boolean;
  isCorrect?: boolean;
  isDailyDouble?: boolean;
  hintUsed?: boolean;
  hintText?: string;
}

export interface Category {
  id: string;
  title: string;
  clues: Clue[];
}

export interface GameBoardData {
  categories: Category[];
}

export interface JudgmentResult {
  isCorrect: boolean;
  scoreMultiplier: number;
  celebrityComment: string;
  hostComment: string;
  harveyComment: string;
  correctAnswerExpanded: string;
}

export interface TranscribedInteraction {
  clueText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  scripts: {
    echo: string;
    hertz: string;
    harvey: string;
  };
}

export interface MissionHistory {
  id: string;
  date: string;
  score: number;
  difficulty: Difficulty;
  efficiency: number;
  consultancyUsed: number;
  maxStreak: number;
  lessons: TranscribedInteraction[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Level {
  level: number;
  title: string;
  xpRequired: number;
}

export interface UserProfile {
  id: string;
  tag: string;
  careerScore: number; // Treated as Total XP
  currency: number; // "Echo Credits"
  currentStreak: number;
  lastActiveDate: string;
  avatarVariant: 'echo' | 'hertz' | 'harvey' | 'polis';
  missionHistory: MissionHistory[];
  examHistory?: ExamAttempt[];
  completedTopicIds: string[]; // Tracks curriculum progress
  badges: Badge[];
  lastDifficulty: Difficulty;
  createdAt: string;
  role?: string;
  institution?: string;
  targetExam?: string;
  bio?: string;
  isPro?: boolean;
}

export interface ActiveClue {
  catIdx: number;
  clueIdx: number;
  clue: Clue;
  category: string;
}

export interface UserSettings {
  muted: boolean;
  volumes: {
    master: number;
    sfx: number;
    voice: number;
    music: number;
    ambience: number;
  };
  lastDifficulty: Difficulty | null;
  geminiApiKey?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface LectureScript {
  topicId: string;
  topicTitle: string;
  quantifiedEffort: string; 
  timeSavedHours: number;
  learningEffortMinutes: string;
  roadmap: string[];
  contrastSection: string; 
  narrativeScript: string;
  visualId?: string; // ID for the interactive visual component
  visualInterpretation: {
    observation: string;
    significance: string;
  }[];
  clinicalDemo: {
    probeMovement: string;
    expectedOutcome: string;
  }[];
  analogy: string;
  mnemonic: {
    acronym: string;
    meaning: string;
  };
  holyShitInsight: string;
  psychologicalBarrier: string; 
  assessmentQuestions: {
    id?: string;
    question: string;
    options?: string[];
    correctAnswerIndex?: number;
    answer?: string;
    explanation: string;
  }[];
}

export interface XPEvent {
  id: string;
  type: 'CORRECT_ANSWER' | 'LESSON_COMPLETE' | 'STREAK_BONUS' | 'PERFECT_GAME' | 'DAILY_DOUBLE';
  amount: number;
  timestamp: string;
  description: string;
}

export interface Level {
  level: number;
  title: string;
  xpRequired: number; // XP needed to reach this level
}