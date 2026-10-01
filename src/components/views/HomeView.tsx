import React from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../ui/GlassCard';
import { ProgressRing } from '../ui/ProgressRing';
import { HabitCard } from '../habits/HabitCard';
import { Habit } from '../../types';
import { isHabitScheduledForDate, getTodayString } from '../../services/streakService';
import { 
  Flame, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Trophy,
  CheckCircle2 
} from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  'Consistency beats intensity every single time.',
  'Small daily disciplines compound into massive transformations.',
  'Build yourself quietly in the cold. Let the spring speak.',
  'You are not negotiating with your habits today.',
  'Focus on the process. The streak takes care of itself.',
  'One disciplined decision at a time.',
  'Your future self is forged in today’s quiet consistency.',
];

export const HomeView: React.FC = () => {
  const { 
    habits, 
    todayProgress, 
    arcProgress, 
    setCurrentView, 
    setIsAddSheetOpen, 
    setEditingHabit,
    settings 
  } = useApp();

  const todayStr = getTodayString();
  const currentHour = new Date().getHours();
  let greeting = 'Good morning';
  if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Good afternoon';
  } else if (currentHour >= 18) {
    greeting = 'Good evening';
  }

  // Pick a stable quote for the day
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const quote = MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];

  // Active scheduled habits for today
  const activeHabits = habits.filter((h) => !h.archived);
  const todaysHabits = activeHabits.filter((h) => isHabitScheduledForDate(h, todayStr));

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Greeting & Header Intro */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-arc-emerald">
            {greeting}, Warrior
          </span>
          <h2 className="text-xl font-bold tracking-tight text-main mt-0.5">
            Day {arcProgress.currentDay} of Winter Arc
          </h2>
        </div>

        {/* Level / XP pill */}
        <div className="flex items-center gap-1.5 rounded-full border border-subtle-theme bg-surface-theme px-3 py-1.5 text-xs shadow-xs">
          <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20" />
          <span className="font-semibold text-sub">Lvl {settings.level}</span>
          <span className="text-dim">·</span>
          <span className="font-mono font-medium text-arc-emerald">{settings.xp} XP</span>
        </div>
      </div>

      {/* Signature Winter Arc Progress Card */}
      <GlassCard variant="glow" className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-arc-emerald">
              Winter Arc Progress
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono tracking-tight text-main">
                {arcProgress.percent}%
              </span>
              <span className="text-xs text-dim">
                ({arcProgress.currentDay} / {arcProgress.totalDays} days)
              </span>
            </div>
            <p className="text-xs text-sub max-w-[210px] leading-relaxed">
              {arcProgress.totalDays - arcProgress.currentDay} days left to transform. Stay unrelenting.
            </p>
            <button
              onClick={() => setCurrentView('arc')}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-arc-emerald hover:opacity-80 transition"
            >
              <span>Explore timeline</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="shrink-0">
            <ProgressRing
              progress={arcProgress.percent}
              size={110}
              strokeWidth={8}
            >
              <span className="text-lg font-bold font-mono text-main">
                {arcProgress.percent}%
              </span>
              <span className="text-[10px] font-medium text-arc-emerald">
                Completed
              </span>
            </ProgressRing>
          </div>
        </div>
      </GlassCard>

      {/* Today's Mission Summary Card */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sub">
                Today’s Mission
              </span>
              <span className="rounded-full bg-accent-theme px-2 py-0.5 text-[10px] font-semibold text-arc-emerald">
                {todayProgress.completed} / {todayProgress.total} Done
              </span>
            </div>
            <p className="text-xs text-sub">
              {todayProgress.percent === 100 && todayProgress.total > 0
                ? 'Flawless execution! You are 100% locked in.'
                : `You are ${todayProgress.percent}% locked in today.`}
            </p>
          </div>

          <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-surface-theme border border-subtle-theme text-arc-emerald">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-theme">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500 shadow-[var(--shadow-accent-glow)]"
            style={{ width: `${todayProgress.percent}%` }}
          />
        </div>
      </GlassCard>

      {/* Today's Habits List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight text-main">
              Scheduled Habits
            </h3>
            <span className="text-xs text-dim">
              ({todaysHabits.length})
            </span>
          </div>
          <button
            onClick={() => setCurrentView('today')}
            className="text-xs font-medium text-arc-emerald hover:underline"
          >
            Open Today View
          </button>
        </div>

        {todaysHabits.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-theme text-arc-emerald mb-3 border border-accent-theme">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-main">Your Winter Arc starts here</h4>
            <p className="mt-1 text-xs text-sub max-w-xs mx-auto">
              Create your first habit and begin forging your daily streak.
            </p>
            <button
              onClick={() => {
                setEditingHabit(null);
                setIsAddSheetOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-accent-solid px-4 py-2 text-xs font-bold text-accent-contrast hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create Habit</span>
            </button>
          </GlassCard>
        ) : (
          <div className="space-y-2.5">
            {todaysHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                selectedDate={todayStr}
                onEdit={(h) => {
                  setEditingHabit(h);
                  setIsAddSheetOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Daily Philosophy / Motivational Card */}
      <div className="rounded-2xl border border-subtle-theme bg-surface-theme p-4 text-center">
        <Sparkles className="mx-auto h-4 w-4 text-arc-emerald mb-1.5" />
        <p className="text-xs italic text-sub">
          "{quote}"
        </p>
      </div>
    </div>
  );
};
