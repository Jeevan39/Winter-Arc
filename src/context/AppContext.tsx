import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Habit, 
  HabitLog, 
  DailyReflection, 
  UserSettings, 
  Achievement, 
  ViewType, 
  MoodType,
  HabitStreak 
} from '../types';
import { 
  loadSettings, 
  saveSettings, 
  loadHabits, 
  saveHabit, 
  deleteHabit as dbDeleteHabit, 
  loadAllHabitLogs, 
  setHabitLogCompletion, 
  loadReflections, 
  saveReflection, 
  loadAchievements, 
  saveAchievements, 
  clearAllDatabase,
  DEFAULT_SETTINGS 
} from '../services/db';
import { 
  getTodayString, 
  formatDate, 
  parseDate, 
  calculateHabitStreak, 
  isHabitScheduledForDate,
  getDifferenceInDays 
} from '../services/streakService';

interface AppContextValue {
  // State
  isLoading: boolean;
  habits: Habit[];
  habitLogs: HabitLog[];
  reflections: DailyReflection[];
  settings: UserSettings;
  achievements: Achievement[];
  currentView: ViewType;
  selectedDate: string;
  isDrawerOpen: boolean;
  isAddSheetOpen: boolean;
  editingHabit: Habit | null;
  toastMessage: string | null;

  // View Navigation
  setCurrentView: (view: ViewType) => void;
  setSelectedDate: (dateStr: string) => void;
  setIsDrawerOpen: (open: boolean) => void;
  setIsAddSheetOpen: (open: boolean) => void;
  setEditingHabit: (habit: Habit | null) => void;
  showToast: (msg: string) => void;

  // Actions
  toggleHabit: (habitId: string, dateStr?: string) => Promise<boolean>;
  createHabit: (data: Omit<Habit, 'id' | 'createdAt' | 'order' | 'archived'>) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  toggleArchiveHabit: (habitId: string) => Promise<void>;
  saveMoodAndNotes: (dateStr: string, mood?: MoodType, notes?: string) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  completeOnboarding: (
    starterHabits: Omit<Habit, 'id' | 'createdAt' | 'order' | 'archived'>[], 
    startDate: string, 
    endDate: string
  ) => Promise<void>;
  resetAllData: () => Promise<void>;
  reloadAllData: () => Promise<void>;

  // Computed & Metrics
  getHabitStreak: (habitId: string) => HabitStreak;
  todayProgress: { completed: number; total: number; percent: number };
  arcProgress: { currentDay: number; totalDays: number; percent: number; isCompleted: boolean };
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [reflections, setReflections] = useState<DailyReflection[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  // Initialize DB Data
  const loadData = useCallback(async () => {
    try {
      const [s, h, l, r, a] = await Promise.all([
        loadSettings(),
        loadHabits(),
        loadAllHabitLogs(),
        loadReflections(),
        loadAchievements(),
      ]);
      setSettings(s);
      setHabits(h);
      setHabitLogs(l);
      setReflections(r);
      setAchievements(a);

      // Sync theme class to html document
      applyTheme(s.theme);
    } catch (err) {
      console.error('Failed to load initial local data from IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const applyTheme = (theme: 'dark' | 'light' | 'system') => {
    const root = document.documentElement;
    const body = document.body;
    let effective = theme;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effective = prefersDark ? 'dark' : 'light';
    }

    if (effective === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      if (body) {
        body.classList.add('dark');
        body.classList.remove('light');
      }
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      if (body) {
        body.classList.remove('dark');
        body.classList.add('light');
      }
    }

    try {
      localStorage.setItem('winter_arc_theme', theme);
    } catch (e) {}
  };

  // Streak calculation memoized
  const getHabitStreak = useCallback(
    (habitId: string): HabitStreak => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) {
        return { currentStreak: 0, bestStreak: 0, totalCompletions: 0 };
      }
      return calculateHabitStreak(habit, habitLogs, getTodayString());
    },
    [habits, habitLogs]
  );

  // Today progress computation
  const todayProgress = useMemo(() => {
    const todayStr = getTodayString();
    const activeHabits = habits.filter((h) => !h.archived);
    const scheduled = activeHabits.filter((h) => isHabitScheduledForDate(h, todayStr));
    if (scheduled.length === 0) return { completed: 0, total: 0, percent: 0 };

    let completed = 0;
    for (const h of scheduled) {
      const log = habitLogs.find((l) => l.habitId === h.id && l.date === todayStr);
      if (log && log.completed) {
        completed++;
      }
    }
    const percent = Math.round((completed / scheduled.length) * 100);
    return { completed, total: scheduled.length, percent };
  }, [habits, habitLogs]);

  // Winter Arc progress computation
  const arcProgress = useMemo(() => {
    const todayStr = getTodayString();
    const startStr = settings.arcStartDate || '2026-10-01';
    const endStr = settings.arcEndDate || '2026-12-31';

    const totalDays = Math.max(1, getDifferenceInDays(startStr, endStr) + 1);
    const daysSinceStart = getDifferenceInDays(startStr, todayStr) + 1;
    const currentDay = Math.max(1, Math.min(daysSinceStart, totalDays));

    const percent = Math.min(100, Math.round((currentDay / totalDays) * 100));
    const isCompleted = daysSinceStart >= totalDays;

    return { currentDay, totalDays, percent, isCompleted };
  }, [settings.arcStartDate, settings.arcEndDate]);

  // XP and Achievements evaluator
  const evaluateAchievements = useCallback(
    async (currentLogs: HabitLog[], currentHabits: Habit[], currentSettings: UserSettings) => {
      let updatedXp = currentSettings.xp;
      const updatedAchievements = [...achievements];
      let hasChanges = false;

      // 1. Total habit completions
      const totalCompletions = currentLogs.filter((l) => l.completed).length;

      // Check first_step
      const firstStep = updatedAchievements.find((a) => a.id === 'first_step');
      if (firstStep && !firstStep.unlockedAt && totalCompletions >= 1) {
        firstStep.unlockedAt = new Date().toISOString();
        firstStep.progress = 1;
        hasChanges = true;
        showToast('Achievement Unlocked: First Step! ✨');
      }

      // Check iron_mind (100 completions)
      const ironMind = updatedAchievements.find((a) => a.id === 'iron_mind');
      if (ironMind) {
        ironMind.progress = Math.min(ironMind.maxProgress, totalCompletions);
        if (!ironMind.unlockedAt && totalCompletions >= 100) {
          ironMind.unlockedAt = new Date().toISOString();
          hasChanges = true;
          showToast('Achievement Unlocked: Iron Mind! 🛡️ (100 Completions)');
        }
      }

      // Check streaks
      let maxCurrentStreak = 0;
      for (const h of currentHabits) {
        const s = calculateHabitStreak(h, currentLogs, getTodayString());
        if (s.currentStreak > maxCurrentStreak) {
          maxCurrentStreak = s.currentStreak;
        }
      }

      // Streak 7
      const streak7 = updatedAchievements.find((a) => a.id === 'streak_7');
      if (streak7) {
        streak7.progress = Math.min(streak7.maxProgress, maxCurrentStreak);
        if (!streak7.unlockedAt && maxCurrentStreak >= 7) {
          streak7.unlockedAt = new Date().toISOString();
          hasChanges = true;
          showToast('Achievement Unlocked: 7-Day Lock-In! 🔥');
        }
      }

      // Streak 14
      const streak14 = updatedAchievements.find((a) => a.id === 'streak_14');
      if (streak14) {
        streak14.progress = Math.min(streak14.maxProgress, maxCurrentStreak);
        if (!streak14.unlockedAt && maxCurrentStreak >= 14) {
          streak14.unlockedAt = new Date().toISOString();
          hasChanges = true;
          showToast('Achievement Unlocked: 14-Day Resilience! ⚔️');
        }
      }

      // Streak 30
      const streak30 = updatedAchievements.find((a) => a.id === 'streak_30');
      if (streak30) {
        streak30.progress = Math.min(streak30.maxProgress, maxCurrentStreak);
        if (!streak30.unlockedAt && maxCurrentStreak >= 30) {
          streak30.unlockedAt = new Date().toISOString();
          hasChanges = true;
          showToast('Achievement Unlocked: 30-Day Discipline! 👑');
        }
      }

      // Wake early 10 times
      const wakeHabit = currentHabits.find((h) => h.name.toLowerCase().includes('wake'));
      if (wakeHabit) {
        const wakeCompletions = currentLogs.filter((l) => l.habitId === wakeHabit.id && l.completed).length;
        const earlyRiser = updatedAchievements.find((a) => a.id === 'early_riser');
        if (earlyRiser) {
          earlyRiser.progress = Math.min(earlyRiser.maxProgress, wakeCompletions);
          if (!earlyRiser.unlockedAt && wakeCompletions >= 10) {
            earlyRiser.unlockedAt = new Date().toISOString();
            hasChanges = true;
            showToast('Achievement Unlocked: Dawn Watcher! ☀️');
          }
        }
      }

      // Winter ascendant (500 XP)
      const ascendant = updatedAchievements.find((a) => a.id === 'winter_ascendant');
      if (ascendant) {
        ascendant.progress = Math.min(ascendant.maxProgress, updatedXp);
        if (!ascendant.unlockedAt && updatedXp >= 500) {
          ascendant.unlockedAt = new Date().toISOString();
          hasChanges = true;
          showToast('Achievement Unlocked: Arc Ascendant! 🏔️');
        }
      }

      if (hasChanges) {
        setAchievements(updatedAchievements);
        await saveAchievements(updatedAchievements);
      }
    },
    [achievements, showToast]
  );

  // Toggle Habit completion
  const toggleHabit = useCallback(
    async (habitId: string, dateStr: string = selectedDate): Promise<boolean> => {
      const existingLog = habitLogs.find((l) => l.habitId === habitId && l.date === dateStr);
      const newStatus = existingLog ? !existingLog.completed : true;

      // Haptic feedback if enabled
      if (settings.haptics && typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(25);
      }

      // Save to IndexedDB
      const updatedLog = await setHabitLogCompletion(habitId, dateStr, newStatus);
      const nextLogs = habitLogs.filter((l) => !(l.habitId === habitId && l.date === dateStr));
      nextLogs.push(updatedLog);
      setHabitLogs(nextLogs);

      // XP calculation: +10 XP if completed, -10 XP if toggled off
      let xpDelta = newStatus ? 10 : -10;
      
      // Check if this makes today a perfect day
      const todayStr = getTodayString();
      if (dateStr === todayStr && newStatus) {
        const activeHabits = habits.filter((h) => !h.archived && isHabitScheduledForDate(h, todayStr));
        const allCompleted = activeHabits.every((h) => {
          if (h.id === habitId) return true;
          const l = nextLogs.find((log) => log.habitId === h.id && log.date === todayStr);
          return l && l.completed;
        });

        if (allCompleted && activeHabits.length > 0) {
          xpDelta += 50; // Perfect day bonus!
          showToast('Perfect Day! +50 XP Bonus 🔥');
          
          if (settings.animations) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#10b981', '#38bdf8', '#ffffff'],
            });
          }
        }
      }

      const newXp = Math.max(0, settings.xp + xpDelta);
      const newLevel = Math.floor(newXp / 100) + 1;
      const updatedSettings = { ...settings, xp: newXp, level: newLevel };
      setSettings(updatedSettings);
      await saveSettings(updatedSettings);

      // Evaluate achievements
      evaluateAchievements(nextLogs, habits, updatedSettings);

      return newStatus;
    },
    [habitLogs, selectedDate, settings, habits, showToast, evaluateAchievements]
  );

  // Create Habit
  const createHabit = useCallback(
    async (data: Omit<Habit, 'id' | 'createdAt' | 'order' | 'archived'>) => {
      const newHabit: Habit = {
        ...data,
        id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        order: habits.length,
        archived: false,
      };

      await saveHabit(newHabit);
      const updated = [...habits, newHabit];
      setHabits(updated);
      showToast(`Habit "${newHabit.name}" created!`);
    },
    [habits, showToast]
  );

  // Update Habit
  const updateHabit = useCallback(
    async (habit: Habit) => {
      await saveHabit(habit);
      setHabits((prev) => prev.map((h) => (h.id === habit.id ? habit : h)));
      showToast('Habit updated successfully');
    },
    [showToast]
  );

  // Archive / Unarchive Habit
  const toggleArchiveHabit = useCallback(
    async (habitId: string) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;
      const updated = { ...habit, archived: !habit.archived };
      await saveHabit(updated);
      setHabits((prev) => prev.map((h) => (h.id === habitId ? updated : h)));
      showToast(updated.archived ? 'Habit archived' : 'Habit restored');
    },
    [habits, showToast]
  );

  // Delete Habit
  const deleteHabit = useCallback(
    async (habitId: string) => {
      await dbDeleteHabit(habitId);
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      setHabitLogs((prev) => prev.filter((l) => l.habitId !== habitId));
      showToast('Habit removed');
    },
    [showToast]
  );

  // Save Mood & Daily Journal Reflection
  const saveMoodAndNotes = useCallback(
    async (dateStr: string, mood?: MoodType, notes?: string) => {
      const reflection: DailyReflection = {
        date: dateStr,
        mood,
        notes,
        updatedAt: new Date().toISOString(),
      };
      await saveReflection(reflection);
      setReflections((prev) => {
        const filtered = prev.filter((r) => r.date !== dateStr);
        return [...filtered, reflection];
      });
      showToast('Daily reflection saved');
    },
    [showToast]
  );

  // Update Settings
  const updateSettings = useCallback(
    async (newSettings: Partial<UserSettings>) => {
      const merged = { ...settings, ...newSettings };
      setSettings(merged);
      await saveSettings(merged);
      if (newSettings.theme) {
        applyTheme(newSettings.theme);
      }
    },
    [settings]
  );

  // Onboarding completion
  const completeOnboarding = useCallback(
    async (
      starterHabits: Omit<Habit, 'id' | 'createdAt' | 'order' | 'archived'>[],
      startDate: string,
      endDate: string
    ) => {
      const createdHabits: Habit[] = starterHabits.map((sh, idx) => ({
        ...sh,
        id: `habit_${Date.now()}_${idx}`,
        createdAt: new Date().toISOString(),
        order: idx,
        archived: false,
      }));

      for (const h of createdHabits) {
        await saveHabit(h);
      }
      setHabits(createdHabits);

      const updatedSettings: UserSettings = {
        ...settings,
        hasCompletedOnboarding: true,
        arcStartDate: startDate,
        arcEndDate: endDate,
      };
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
      showToast('Winter Arc initialized. Step into discipline.');
    },
    [settings, showToast]
  );

  // Reset all data
  const resetAllData = useCallback(async () => {
    await clearAllDatabase();
    await loadData();
    showToast('All local data has been reset.');
  }, [loadData, showToast]);

  const value: AppContextValue = {
    isLoading,
    habits,
    habitLogs,
    reflections,
    settings,
    achievements,
    currentView,
    selectedDate,
    isDrawerOpen,
    isAddSheetOpen,
    editingHabit,
    toastMessage,
    setCurrentView,
    setSelectedDate,
    setIsDrawerOpen,
    setIsAddSheetOpen,
    setEditingHabit,
    showToast,
    toggleHabit,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleArchiveHabit,
    saveMoodAndNotes,
    updateSettings,
    completeOnboarding,
    resetAllData,
    reloadAllData: loadData,
    getHabitStreak,
    todayProgress,
    arcProgress,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
