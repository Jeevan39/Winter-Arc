import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Habit, HabitLog, DailyReflection, UserSettings, Achievement } from '../types';

interface WinterArcDB extends DBSchema {
  habits: {
    key: string;
    value: Habit;
    indexes: { 'by-order': number; 'by-archived': number };
  };
  habitLogs: {
    key: string;
    value: HabitLog;
    indexes: { 'by-date': string; 'by-habit': string };
  };
  reflections: {
    key: string;
    value: DailyReflection;
  };
  settings: {
    key: string;
    value: UserSettings;
  };
  achievements: {
    key: string;
    value: Achievement;
  };
}

const DB_NAME = 'winter_arc_2026_db';
const DB_VERSION = 1;

export const DEFAULT_SETTINGS: UserSettings = {
  id: 'user_settings',
  theme: 'dark',
  snowEffect: true,
  animations: true,
  haptics: true,
  arcStartDate: '2026-10-01',
  arcEndDate: '2026-12-31',
  hasCompletedOnboarding: false,
  xp: 0,
  level: 1,
  createdAt: new Date().toISOString(),
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first habit on your Winter Arc.',
    icon: 'Sparkles',
    category: 'milestone',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'streak_7',
    title: '7-Day Lock-In',
    description: 'Maintain a 7-day streak on any habit.',
    icon: 'Flame',
    category: 'streak',
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'streak_14',
    title: '14-Day Resilience',
    description: 'Conquer 14 straight days of unrelenting execution.',
    icon: 'Shield',
    category: 'streak',
    progress: 0,
    maxProgress: 14,
  },
  {
    id: 'streak_30',
    title: '30-Day Discipline',
    description: 'Cement a habit into your core identity with a 30-day streak.',
    icon: 'Award',
    category: 'streak',
    progress: 0,
    maxProgress: 30,
  },
  {
    id: 'iron_mind',
    title: 'Iron Mind',
    description: 'Reach 100 total habit check-ins.',
    icon: 'Target',
    category: 'habits',
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'early_riser',
    title: 'Dawn Watcher',
    description: 'Check off Wake Early 10 times.',
    icon: 'Sun',
    category: 'habits',
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'perfect_day',
    title: 'Full Lock-In',
    description: 'Complete 100% of your habits on a scheduled day.',
    icon: 'CheckCircle2',
    category: 'milestone',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'winter_ascendant',
    title: 'Arc Ascendant',
    description: 'Reach Level 5 by earning 500 XP.',
    icon: 'Mountain',
    category: 'mindset',
    progress: 0,
    maxProgress: 500,
  },
  {
    id: 'arc_completion',
    title: 'Winter Conqueror',
    description: 'Reach the final milestone of the Winter Arc 2026.',
    icon: 'Snowflake',
    category: 'milestone',
    progress: 0,
    maxProgress: 120,
  },
];

export const PRESET_STARTER_HABITS: Omit<Habit, 'id' | 'createdAt' | 'order' | 'archived'>[] = [
  {
    name: 'Wake Early (6:00 AM)',
    icon: 'Sun',
    color: '#f59e0b',
    frequency: 'everyday',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    target: '06:00 AM',
    reminderTime: '06:00',
  },
  {
    name: 'Gym & Physical Training',
    icon: 'Dumbbell',
    color: '#10b981',
    frequency: 'everyday',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    target: '45 mins',
    reminderTime: '07:30',
  },
  {
    name: 'Deep Work / Coding / Study',
    icon: 'Code',
    color: '#38bdf8',
    frequency: 'everyday',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    target: '90 mins',
    reminderTime: '09:00',
  },
  {
    name: 'Read 20 Pages',
    icon: 'BookOpen',
    color: '#8b5cf6',
    frequency: 'everyday',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    target: '20 pages',
    reminderTime: '20:30',
  },
  {
    name: 'Cold Discipline / Cold Shower',
    icon: 'Snowflake',
    color: '#06b6d4',
    frequency: 'everyday',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    target: '3 mins',
  },
  {
    name: 'Hydrate 3 Liters',
    icon: 'Droplets',
    color: '#3b82f6',
    frequency: 'everyday',
    selectedDays: [0, 1, 2, 3, 4, 5, 6],
    target: '3 Liters',
  },
];

let dbPromise: Promise<IDBPDatabase<WinterArcDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<WinterArcDB>> {
  if (!dbPromise) {
    dbPromise = openDB<WinterArcDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Habits store
        if (!db.objectStoreNames.contains('habits')) {
          const habitStore = db.createObjectStore('habits', { keyPath: 'id' });
          habitStore.createIndex('by-order', 'order');
          habitStore.createIndex('by-archived', 'archived');
        }

        // Habit logs store
        if (!db.objectStoreNames.contains('habitLogs')) {
          const logStore = db.createObjectStore('habitLogs', { keyPath: 'id' });
          logStore.createIndex('by-date', 'date');
          logStore.createIndex('by-habit', 'habitId');
        }

        // Daily reflections store
        if (!db.objectStoreNames.contains('reflections')) {
          db.createObjectStore('reflections', { keyPath: 'date' });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }

        // Achievements store
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// ----------------- DB Operations -----------------

export async function loadSettings(): Promise<UserSettings> {
  const db = await getDB();
  const settings = await db.get('settings', 'user_settings');
  if (!settings) {
    await db.put('settings', DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return settings;
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings);
}

export async function loadHabits(): Promise<Habit[]> {
  const db = await getDB();
  const habits = await db.getAll('habits');
  return habits.sort((a, b) => a.order - b.order);
}

export async function saveHabit(habit: Habit): Promise<void> {
  const db = await getDB();
  await db.put('habits', habit);
}

export async function deleteHabit(habitId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['habits', 'habitLogs'], 'readwrite');
  await tx.objectStore('habits').delete(habitId);
  
  // Clean up logs associated with this habit
  const logIndex = tx.objectStore('habitLogs').index('by-habit');
  let cursor = await logIndex.openCursor(habitId);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}

export async function loadAllHabitLogs(): Promise<HabitLog[]> {
  const db = await getDB();
  return db.getAll('habitLogs');
}

export async function loadHabitLogsForDate(dateStr: string): Promise<HabitLog[]> {
  const db = await getDB();
  const index = db.transaction('habitLogs').store.index('by-date');
  return index.getAll(dateStr);
}

export async function setHabitLogCompletion(
  habitId: string, 
  dateStr: string, 
  completed: boolean
): Promise<HabitLog> {
  const db = await getDB();
  const id = `${habitId}_${dateStr}`;
  const log: HabitLog = {
    id,
    habitId,
    date: dateStr,
    completed,
    completedAt: completed ? new Date().toISOString() : '',
  };
  await db.put('habitLogs', log);
  return log;
}

export async function loadReflections(): Promise<DailyReflection[]> {
  const db = await getDB();
  return db.getAll('reflections');
}

export async function getReflectionForDate(dateStr: string): Promise<DailyReflection | undefined> {
  const db = await getDB();
  return db.get('reflections', dateStr);
}

export async function saveReflection(reflection: DailyReflection): Promise<void> {
  const db = await getDB();
  await db.put('reflections', reflection);
}

export async function loadAchievements(): Promise<Achievement[]> {
  const db = await getDB();
  const existing = await db.getAll('achievements');
  if (existing.length === 0) {
    const tx = db.transaction('achievements', 'readwrite');
    for (const ach of INITIAL_ACHIEVEMENTS) {
      await tx.store.put(ach);
    }
    await tx.done;
    return INITIAL_ACHIEVEMENTS;
  }
  return existing;
}

export async function saveAchievements(achievements: Achievement[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('achievements', 'readwrite');
  for (const ach of achievements) {
    await tx.store.put(ach);
  }
  await tx.done;
}

export async function clearAllDatabase(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['habits', 'habitLogs', 'reflections', 'settings', 'achievements'], 'readwrite');
  await tx.objectStore('habits').clear();
  await tx.objectStore('habitLogs').clear();
  await tx.objectStore('reflections').clear();
  await tx.objectStore('settings').clear();
  await tx.objectStore('achievements').clear();
  await tx.done;
}
