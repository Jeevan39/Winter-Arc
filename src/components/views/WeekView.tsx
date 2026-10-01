import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../ui/GlassCard';
import { HabitIcon } from '../icons/HabitIcon';
import { 
  getWeekDays, 
  getTodayString, 
  addDays, 
  formatDate,
  parseDate, 
  isHabitScheduledForDate 
} from '../../services/streakService';
import { getHabitColorTheme } from '../../utils/themeColors';
import { ChevronLeft, ChevronRight, Check, CalendarRange, Flame, Plus } from 'lucide-react';

export const WeekView: React.FC = () => {
  const { habits, habitLogs, toggleHabit, getHabitStreak, setEditingHabit, setIsAddSheetOpen } = useApp();
  const todayStr = getTodayString();
  const [referenceDate, setReferenceDate] = useState<Date>(new Date());

  const weekDays = getWeekDays(referenceDate);
  const activeHabits = habits.filter((h) => !h.archived);

  // Compute total weekly completions vs scheduled
  let totalScheduled = 0;
  let totalCompleted = 0;

  for (const h of activeHabits) {
    for (const d of weekDays) {
      if (isHabitScheduledForDate(h, d.dateStr)) {
        totalScheduled++;
        const log = habitLogs.find((l) => l.habitId === h.id && l.date === d.dateStr);
        if (log && log.completed) {
          totalCompleted++;
        }
      }
    }
  }

  const weeklyPercent = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

  const handlePrevWeek = () => {
    const prev = new Date(referenceDate);
    prev.setDate(prev.getDate() - 7);
    setReferenceDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(referenceDate);
    next.setDate(next.getDate() + 7);
    setReferenceDate(next);
  };

  const handleCurrentWeek = () => {
    setReferenceDate(new Date());
  };

  const firstDay = weekDays[0];
  const lastDay = weekDays[6];
  const dateRangeLabel = `${firstDay.dayName} ${firstDay.dayNumber} - ${lastDay.dayName} ${lastDay.dayNumber}`;

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-arc-emerald">
            Weekly Matrix
          </span>
          <h2 className="text-xl font-bold tracking-tight text-main mt-0.5">
            {dateRangeLabel}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevWeek}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-subtle-theme bg-surface-theme text-sub hover:bg-surface-hover-theme active:scale-95 transition"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleCurrentWeek}
            className="rounded-xl border border-subtle-theme bg-surface-theme px-2.5 py-1.5 text-xs font-semibold text-sub hover:text-main transition"
          >
            This Week
          </button>
          <button
            onClick={handleNextWeek}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-subtle-theme bg-surface-theme text-sub hover:bg-surface-hover-theme active:scale-95 transition"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekly Progress Banner */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-sub">Weekly Consistency</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold font-mono text-main">
                {weeklyPercent}%
              </span>
              <span className="text-xs text-dim">
                ({totalCompleted} / {totalScheduled} completed)
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-theme border border-accent-theme text-arc-emerald">
            <CalendarRange className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-theme">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${weeklyPercent}%` }}
          />
        </div>
      </GlassCard>

      {/* Habit Weekly Breakdown Cards */}
      <div className="space-y-3">
        {activeHabits.length === 0 ? (
          <GlassCard className="p-6 text-center space-y-2">
            <p className="text-xs text-dim">No active habits to track this week.</p>
            <button
              onClick={() => {
                setEditingHabit(null);
                setIsAddSheetOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent-solid px-3.5 py-1.5 text-xs font-bold text-accent-contrast hover:opacity-90 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Your First Habit</span>
            </button>
          </GlassCard>
        ) : (
          activeHabits.map((habit) => {
          const streak = getHabitStreak(habit.id);
          const habitTheme = getHabitColorTheme(habit.color);

          return (
            <GlassCard key={habit.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${habitTheme.badge}`}
                  >
                    <HabitIcon name={habit.icon} className="h-4 w-4" />
                  </div>
                  <span className="truncate text-sm font-bold text-main">
                    {habit.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-arc-amber">
                  <Flame className="h-3.5 w-3.5 fill-amber-500/20" />
                  <span>{streak.currentStreak}d</span>
                </div>
              </div>

              {/* Day Check Circles Row */}
              <div className="grid grid-cols-7 gap-1 pt-1 border-t border-subtle-theme">
                {weekDays.map((wd) => {
                  const isScheduled = isHabitScheduledForDate(habit, wd.dateStr);
                  const log = habitLogs.find((l) => l.habitId === habit.id && l.date === wd.dateStr);
                  const isDone = log?.completed || false;
                  const isToday = wd.dateStr === todayStr;

                  return (
                    <div key={wd.dateStr} className="flex flex-col items-center gap-1.5">
                      <span className={`text-[10px] font-medium ${isToday ? 'text-arc-emerald font-bold' : 'text-dim'}`}>
                        {wd.dayName}
                      </span>

                      <button
                        type="button"
                        disabled={!isScheduled}
                        onClick={() => toggleHabit(habit.id, wd.dateStr)}
                        className={`flex h-8 w-8 items-center justify-center rounded-xl transition active:scale-90 ${
                          !isScheduled
                            ? 'opacity-20 cursor-not-allowed bg-transparent border border-dashed border-subtle-theme'
                            : isDone
                            ? `${habitTheme.solid} ${habitTheme.glow}`
                            : 'border border-subtle-theme bg-surface-theme hover:border-medium-theme'
                        } ${isToday ? 'ring-1 ring-emerald-500 ring-offset-1 ring-offset-[var(--color-bg-app)]' : ''}`}
                        title={`${wd.dayName} ${wd.dayNumber} - ${isDone ? 'Completed' : 'Incomplete'}`}
                        aria-label={`Toggle ${habit.name} on ${wd.dayName}`}
                      >
                        {isDone ? (
                          <Check className="h-4 w-4 stroke-[3]" />
                        ) : isScheduled ? (
                          <span className="text-[10px] text-dim font-mono">
                            {wd.dayNumber}
                          </span>
                        ) : null}
                      </button>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          );
        }))}
      </div>
    </div>
  );
};
