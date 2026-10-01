import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../ui/GlassCard';
import { HabitIcon } from '../icons/HabitIcon';
import { 
  getDaysInMonth, 
  getTodayString, 
  parseDate, 
  isHabitScheduledForDate, 
  formatDate 
} from '../../services/streakService';
import { getHabitColorTheme } from '../../utils/themeColors';
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface MonthOption {
  year: number;
  month: number; // 0-indexed
  name: string;
}

const ARC_MONTHS: MonthOption[] = [
  { year: 2026, month: 9, name: 'Oct 2026' },
  { year: 2026, month: 10, name: 'Nov 2026' },
  { year: 2026, month: 11, name: 'Dec 2026' },
];

export const MonthView: React.FC = () => {
  const { habits, habitLogs, toggleHabit } = useApp();
  const todayStr = getTodayString();
  const activeHabits = habits.filter((h) => !h.archived);

  // Default to current date's month or first arc month
  const currentDate = new Date();
  const initialMonthIdx = ARC_MONTHS.findIndex(
    (m) => m.year === currentDate.getFullYear() && m.month === currentDate.getMonth()
  );
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(
    initialMonthIdx !== -1 ? initialMonthIdx : 0
  );

  const selectedMonth = ARC_MONTHS[selectedMonthIdx];
  const daysInMonth = getDaysInMonth(selectedMonth.year, selectedMonth.month);

  // Compute month overall completion rate
  let totalScheduled = 0;
  let totalCompleted = 0;

  for (const dayStr of daysInMonth) {
    if (dayStr > todayStr) continue; // don't count future days against consistency
    for (const h of activeHabits) {
      if (isHabitScheduledForDate(h, dayStr)) {
        totalScheduled++;
        const log = habitLogs.find((l) => l.habitId === h.id && l.date === dayStr);
        if (log && log.completed) {
          totalCompleted++;
        }
      }
    }
  }

  const monthPercent = totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

  // First day of month offset (0 = Sunday, 1 = Monday ...)
  const firstDayOfMonth = new Date(selectedMonth.year, selectedMonth.month, 1).getDay();
  // We align with Monday as column 0
  const leadingBlankDays = (firstDayOfMonth + 6) % 7;

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Month Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {ARC_MONTHS.map((m, idx) => (
          <button
            key={m.name}
            onClick={() => setSelectedMonthIdx(idx)}
            className={`min-h-[44px] rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
              selectedMonthIdx === idx
                ? 'border border-accent-theme bg-accent-theme text-arc-emerald shadow-xs'
                : 'border border-subtle-theme bg-surface-theme text-sub hover:text-main'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Month Summary Banner */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-sub">
              {selectedMonth.name} Overview
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold font-mono text-main">
                {monthPercent}%
              </span>
              <span className="text-xs text-dim">
                ({totalCompleted} / {totalScheduled} completed)
              </span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-theme border border-accent-theme text-arc-emerald">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-theme">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${monthPercent}%` }}
          />
        </div>
      </GlassCard>

      {/* Aggregate Discipline Calendar Heatmap */}
      <GlassCard className="p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sub mb-3">
          Overall Daily Heatmap
        </h3>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-dim mb-2">
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: leadingBlankDays }).map((_, i) => (
            <div key={`blank-${i}`} className="h-8 rounded-lg bg-transparent" />
          ))}

          {daysInMonth.map((dayStr) => {
            const dateNum = parseDate(dayStr).getDate();
            const isToday = dayStr === todayStr;
            const isFuture = dayStr > todayStr;

            // Compute ratio of completed habits on this day
            const scheduledOnDay = activeHabits.filter((h) => isHabitScheduledForDate(h, dayStr));
            let doneOnDay = 0;
            for (const h of scheduledOnDay) {
              const log = habitLogs.find((l) => l.habitId === h.id && l.date === dayStr);
              if (log && log.completed) doneOnDay++;
            }

            const ratio = scheduledOnDay.length > 0 ? doneOnDay / scheduledOnDay.length : 0;

            let bgColor = 'bg-surface-theme';
            let textColor = 'text-sub';

            if (isFuture) {
              bgColor = 'bg-transparent border border-dashed border-subtle-theme';
              textColor = 'text-dim';
            } else if (ratio === 1 && scheduledOnDay.length > 0) {
              bgColor = 'bg-accent-solid shadow-[var(--shadow-accent-glow)]';
              textColor = 'text-accent-contrast font-bold';
            } else if (ratio >= 0.5) {
              bgColor = 'bg-accent-theme border border-accent-theme';
              textColor = 'text-arc-emerald font-bold';
            } else if (ratio > 0) {
              bgColor = 'bg-surface-theme border border-subtle-theme';
              textColor = 'text-main font-semibold';
            }

            return (
              <div
                key={dayStr}
                className={`relative flex h-8 flex-col items-center justify-center rounded-lg text-[11px] font-mono transition-all ${bgColor} ${textColor} ${
                  isToday ? 'ring-2 ring-cyan-500 ring-offset-1 ring-offset-[var(--color-bg-app)]' : ''
                }`}
                title={`${dayStr}: ${doneOnDay}/${scheduledOnDay.length} habits completed`}
              >
                <span>{dateNum}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-dim">
          <span>Less</span>
          <span className="h-2.5 w-2.5 rounded bg-surface-theme border border-subtle-theme" />
          <span className="h-2.5 w-2.5 rounded bg-surface-theme" />
          <span className="h-2.5 w-2.5 rounded bg-accent-theme border border-accent-theme" />
          <span className="h-2.5 w-2.5 rounded bg-accent-solid" />
          <span>Locked In</span>
        </div>
      </GlassCard>

      {/* Habit Specific Heatmaps List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sub px-1">
          Habit Breakdown ({selectedMonth.name})
        </h3>

        {activeHabits.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <p className="text-xs text-dim">No habits scheduled for {selectedMonth.name}.</p>
          </GlassCard>
        ) : (
          activeHabits.map((habit) => {
          const habitTheme = getHabitColorTheme(habit.color);

          return (
            <GlassCard key={habit.id} className="p-3.5">
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${habitTheme.badge}`}
                >
                  <HabitIcon name={habit.icon} className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-main truncate">
                  {habit.name}
                </span>
              </div>

              {/* Heatmap Row */}
              <div className="flex flex-wrap gap-1">
                {daysInMonth.map((dStr) => {
                  const log = habitLogs.find((l) => l.habitId === habit.id && l.date === dStr);
                  const done = log?.completed || false;
                  const isFuture = dStr > todayStr;
                  const scheduled = isHabitScheduledForDate(habit, dStr);

                  return (
                    <button
                      key={dStr}
                      type="button"
                      disabled={!scheduled}
                      onClick={() => toggleHabit(habit.id, dStr)}
                      className={`h-4 w-4 rounded-sm transition active:scale-90 ${
                        !scheduled
                          ? 'opacity-10 cursor-not-allowed bg-transparent'
                          : done
                          ? `${habitTheme.solid} shadow-xs`
                          : isFuture
                          ? 'bg-surface-theme opacity-30'
                          : 'bg-surface-theme hover:bg-surface-hover-theme border border-subtle-theme'
                      }`}
                      title={`${dStr}: ${done ? 'Completed' : 'Missed'}`}
                    />
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
