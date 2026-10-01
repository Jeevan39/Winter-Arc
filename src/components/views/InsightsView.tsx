import React from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../ui/GlassCard';
import { HabitIcon } from '../icons/HabitIcon';
import { 
  Flame, 
  Award, 
  Target, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Zap,
  Shield 
} from 'lucide-react';
import { getTodayString, parseDate, isHabitScheduledForDate } from '../../services/streakService';
import { getHabitColorTheme } from '../../utils/themeColors';

export const InsightsView: React.FC = () => {
  const { habits, habitLogs, achievements, settings, getHabitStreak } = useApp();
  const activeHabits = habits.filter((h) => !h.archived);
  const todayStr = getTodayString();

  // Streak metrics
  let maxCurrentStreak = 0;
  let maxLongestStreak = 0;
  let bestHabit = activeHabits[0];

  for (const h of activeHabits) {
    const s = getHabitStreak(h.id);
    if (s.currentStreak > maxCurrentStreak) {
      maxCurrentStreak = s.currentStreak;
    }
    if (s.bestStreak > maxLongestStreak) {
      maxLongestStreak = s.bestStreak;
      bestHabit = h;
    }
  }

  // Total completions across all time
  const totalCompletedChecks = habitLogs.filter((l) => l.completed).length;

  // Day of week consistency calculation (0 = Sun ... 6 = Sat)
  const dayCompletions = [0, 0, 0, 0, 0, 0, 0];
  const dayTotals = [0, 0, 0, 0, 0, 0, 0];

  for (const log of habitLogs) {
    const d = parseDate(log.date);
    const day = d.getDay();
    dayTotals[day]++;
    if (log.completed) {
      dayCompletions[day]++;
    }
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let bestDayIndex = 1; // Default Monday
  let bestDayRatio = -1;

  for (let i = 0; i < 7; i++) {
    const ratio = dayTotals[i] > 0 ? dayCompletions[i] / dayTotals[i] : 0;
    if (ratio > bestDayRatio && dayTotals[i] > 0) {
      bestDayRatio = ratio;
      bestDayIndex = i;
    }
  }

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-arc-emerald">
          Analytics & Mastery
        </span>
        <h2 className="text-xl font-bold tracking-tight text-main mt-0.5">
          Performance Insights
        </h2>
      </div>

      {/* Gamification Level & XP Card */}
      <GlassCard variant="glow" className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-accent-contrast font-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <span className="text-lg font-mono">L{settings.level}</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-sub">Discipline Level</span>
              <h3 className="text-base font-bold text-main">
                Tier {settings.level} Arc Warrior
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-extrabold font-mono text-arc-emerald">
              {settings.xp} XP
            </span>
            <span className="block text-[10px] text-dim">
              {100 - (settings.xp % 100)} XP to next tier
            </span>
          </div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-track-theme">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${settings.xp % 100}%` }}
          />
        </div>
      </GlassCard>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-3.5 space-y-1">
          <div className="flex items-center justify-between text-dim">
            <span className="text-[11px] font-medium">Current Streak</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-main block">
            {maxCurrentStreak}d
          </span>
          <span className="text-[10px] text-dim">Active non-stop days</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <div className="flex items-center justify-between text-dim">
            <span className="text-[11px] font-medium">Best Ever Streak</span>
            <Award className="h-4 w-4 text-arc-emerald" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-main block">
            {maxLongestStreak}d
          </span>
          <span className="text-[10px] text-dim">Personal discipline record</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <div className="flex items-center justify-between text-dim">
            <span className="text-[11px] font-medium">Total Check-Ins</span>
            <CheckCircle2 className="h-4 w-4 text-arc-cyan" />
          </div>
          <span className="text-2xl font-extrabold font-mono text-main block">
            {totalCompletedChecks}
          </span>
          <span className="text-[10px] text-dim">Completed habit actions</span>
        </GlassCard>

        <GlassCard className="p-3.5 space-y-1">
          <div className="flex items-center justify-between text-dim">
            <span className="text-[11px] font-medium">Peak Execution Day</span>
            <Calendar className="h-4 w-4 text-arc-purple" />
          </div>
          <span className="text-base font-bold text-main truncate block">
            {dayNames[bestDayIndex]}
          </span>
          <span className="text-[10px] text-dim">Most consistent day</span>
        </GlassCard>
      </div>

      {/* Best Habit Spotlight */}
      {bestHabit && (() => {
        const bestHabitTheme = getHabitColorTheme(bestHabit.color);
        return (
          <GlassCard className="p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sub">
              Crown Discipline
            </span>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${bestHabitTheme.badge}`}
                >
                  <HabitIcon name={bestHabit.icon} className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-main">{bestHabit.name}</h4>
                  <p className="text-xs text-dim">Highest recorded longevity</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-base font-bold text-arc-amber">
                  {getHabitStreak(bestHabit.id).bestStreak} Days
                </span>
                <span className="block text-[10px] text-dim">Record Streak</span>
              </div>
            </div>
          </GlassCard>
        );
      })()}

      {/* Achievements Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sub">
            Badges & Trophies
          </h3>
          <span className="text-xs font-mono font-semibold text-arc-emerald">
            {unlockedCount} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            const pct = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

            return (
              <GlassCard
                key={ach.id}
                className={`p-3.5 transition-all ${
                  isUnlocked
                    ? 'border-accent-theme bg-accent-theme shadow-xs'
                    : 'opacity-75 border-subtle-theme'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm ${
                        isUnlocked
                          ? 'border-accent-theme bg-accent-theme text-arc-emerald shadow-[var(--shadow-accent-glow)]'
                          : 'border-subtle-theme bg-surface-theme text-dim'
                      }`}
                    >
                      {isUnlocked ? <Sparkles className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-xs font-bold text-main">
                          {ach.title}
                        </h4>
                        {isUnlocked && (
                          <span className="rounded-full bg-accent-theme px-1.5 py-0.2 text-[9px] font-bold text-arc-emerald border border-accent-theme">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-sub mt-0.5">
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-semibold text-sub">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  </div>
                </div>

                {/* Progress bar for achievements */}
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-track-theme">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isUnlocked ? 'bg-emerald-500 shadow-[var(--shadow-accent-glow)]' : 'bg-surface-theme'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
