import React from 'react';
import { Habit } from '../../types';
import { useApp } from '../../context/AppContext';
import { HabitIcon } from '../icons/HabitIcon';
import { GlassCard } from '../ui/GlassCard';
import { getWeekDays, getTodayString } from '../../services/streakService';
import { getHabitColorTheme } from '../../utils/themeColors';
import { Check, Flame, MoreVertical, Edit3 } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  selectedDate?: string;
  onEdit?: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, selectedDate, onEdit }) => {
  const { toggleHabit, habitLogs, getHabitStreak } = useApp();
  const todayStr = getTodayString();
  const activeDate = selectedDate || todayStr;
  const habitTheme = getHabitColorTheme(habit.color);

  // Check completion for activeDate
  const currentLog = habitLogs.find((l) => l.habitId === habit.id && l.date === activeDate);
  const isCompleted = currentLog?.completed || false;

  const streak = getHabitStreak(habit.id);
  const weekDays = getWeekDays(new Date(activeDate));

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHabit(habit.id, activeDate);
  };

  return (
    <GlassCard
      className={`group p-4 transition-all duration-300 ${
        isCompleted
          ? 'border-accent-theme bg-accent-theme shadow-[var(--shadow-card)]'
          : 'hover:border-medium-theme'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Icon & Title & Streak */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${habitTheme.badge}`}
          >
            <HabitIcon name={habit.icon} className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-bold text-main">
                {habit.name}
              </h3>
              {habit.target && (
                <span className="shrink-0 rounded bg-surface-theme border border-subtle-theme px-1.5 py-0.5 text-[10px] font-mono text-sub">
                  {habit.target}
                </span>
              )}
            </div>

            <div className="mt-0.5 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-mono font-medium text-arc-amber">
                <Flame className="h-3.5 w-3.5 fill-amber-500/20" />
                <span>{streak.currentStreak} day streak</span>
              </span>
              {streak.bestStreak > streak.currentStreak && (
                <span className="text-[11px] text-dim">
                  Best: {streak.bestStreak}d
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Satisfying Completion Button & Edit */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(habit)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-dim hover:text-main hover:bg-surface-theme transition"
              aria-label="Edit habit"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={handleToggle}
            className={`group/btn relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border transition-all duration-200 active:scale-90 ${
              isCompleted
                ? 'border-accent-solid bg-accent-solid text-accent-contrast shadow-[var(--shadow-accent-glow)]'
                : 'border-subtle-theme bg-surface-theme text-dim hover:border-accent-theme hover:text-arc-emerald'
            }`}
            aria-label={isCompleted ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} complete`}
          >
            <Check
              className={`h-5 w-5 transition-transform duration-200 ${
                isCompleted ? 'scale-110 stroke-[3]' : 'scale-90 opacity-40 group-hover/btn:opacity-100'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mini Weekly Progress Circles */}
      <div className="mt-3.5 border-t border-subtle-theme pt-3">
        <div className="flex items-center justify-between px-1">
          {weekDays.map((wd) => {
            const dayLog = habitLogs.find((l) => l.habitId === habit.id && l.date === wd.dateStr);
            const done = dayLog?.completed || false;
            const isDayToday = wd.dateStr === todayStr;

            return (
              <div key={wd.dateStr} className="flex flex-col items-center gap-1">
                <span className={`text-[10px] font-medium ${isDayToday ? 'text-arc-emerald font-bold' : 'text-dim'}`}>
                  {wd.dayName.slice(0, 1)}
                </span>
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center transition-all ${
                    done
                      ? `${habitTheme.solid} ${habitTheme.glow}`
                      : 'border border-subtle-theme bg-surface-theme'
                  } ${isDayToday ? 'ring-1 ring-emerald-500 ring-offset-1 ring-offset-[var(--color-bg-app)]' : ''}`}
                >
                  {done ? (
                    <Check className="h-3 w-3 stroke-[3]" />
                  ) : (
                    <span className="h-1 w-1 rounded-full bg-track-theme" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};
