export type HabitFrequency = 'everyday' | 'custom';

export type MoodType = 'exhausted' | 'neutral' | 'good' | 'great' | 'fire';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  selectedDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  target?: string;
  reminderTime?: string;
  createdAt: string;
  archived: boolean;
  order: number;
}

export interface HabitLog {
  id: string; // `${habitId}_${date}`
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt: string;
}

export interface DailyReflection {
  date: string; // YYYY-MM-DD
  mood?: MoodType;
  notes?: string;
  updatedAt: string;
}

export interface UserSettings {
  id: string; // 'user_settings'
  theme: 'dark' | 'light' | 'system';
  snowEffect: boolean;
  animations: boolean;
  haptics: boolean;
  arcStartDate: string; // YYYY-MM-DD
  arcEndDate: string; // YYYY-MM-DD
  hasCompletedOnboarding: boolean;
  xp: number;
  level: number;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'habits' | 'milestone' | 'mindset';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export type ViewType = 
  | 'home' 
  | 'today' 
  | 'week' 
  | 'month' 
  | 'arc' 
  | 'insights' 
  | 'habits' 
  | 'settings';

export interface HabitStreak {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  lastCompletedDate?: string;
}

export interface ExportDataPayload {
  version: number;
  exportedAt: string;
  app: 'Winter Arc 2026';
  settings: UserSettings;
  habits: Habit[];
  habitLogs: HabitLog[];
  reflections: DailyReflection[];
  achievements: Achievement[];
}
