import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../ui/GlassCard';
import { HabitIcon } from '../icons/HabitIcon';
import { Plus, Edit3, Archive, ArchiveRestore, Flame, CheckCircle2 } from 'lucide-react';
import { Habit } from '../../types';
import { getHabitColorTheme } from '../../utils/themeColors';

export const HabitsManagerView: React.FC = () => {
  const { habits, setIsAddSheetOpen, setEditingHabit, toggleArchiveHabit, getHabitStreak } = useApp();
  const [tab, setTab] = useState<'active' | 'archived'>('active');

  const filteredHabits = habits.filter((h) => (tab === 'active' ? !h.archived : h.archived));

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsAddSheetOpen(true);
  };

  const handleNew = () => {
    setEditingHabit(null);
    setIsAddSheetOpen(true);
  };

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-arc-emerald">
            Protocols & Disciplines
          </span>
          <h2 className="text-xl font-bold tracking-tight text-main mt-0.5">
            Manage Habits
          </h2>
        </div>

        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 rounded-xl bg-accent-solid px-3.5 py-2 text-xs font-bold text-accent-contrast shadow-[var(--shadow-accent-glow)] hover:opacity-90 active:scale-95 transition"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-surface-theme p-1 border border-subtle-theme">
        <button
          onClick={() => setTab('active')}
          className={`flex-1 min-h-[40px] rounded-lg text-xs font-semibold transition ${
            tab === 'active'
              ? 'bg-accent-theme text-arc-emerald shadow-xs border border-accent-theme'
              : 'text-dim hover:text-main'
          }`}
        >
          Active Habits ({habits.filter((h) => !h.archived).length})
        </button>
        <button
          onClick={() => setTab('archived')}
          className={`flex-1 min-h-[40px] rounded-lg text-xs font-semibold transition ${
            tab === 'archived'
              ? 'bg-accent-theme text-arc-emerald shadow-xs border border-accent-theme'
              : 'text-dim hover:text-main'
          }`}
        >
          Archived ({habits.filter((h) => h.archived).length})
        </button>
      </div>

      {/* Habit List */}
      <div className="space-y-2.5">
        {filteredHabits.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <p className="text-xs text-dim">
              {tab === 'active' ? 'No active habits found. Create one now!' : 'No archived habits.'}
            </p>
          </GlassCard>
        ) : (
          filteredHabits.map((habit) => {
            const streak = getHabitStreak(habit.id);
            const habitTheme = getHabitColorTheme(habit.color);

            return (
              <GlassCard
                key={habit.id}
                className="p-3.5 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm ${habitTheme.badge}`}
                  >
                    <HabitIcon name={habit.icon} className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold text-main">
                      {habit.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-dim mt-0.5">
                      <span className="capitalize text-sub">{habit.frequency}</span>
                      {habit.target && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-arc-emerald font-medium">{habit.target}</span>
                        </>
                      )}
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-arc-amber font-mono font-medium">
                        <Flame className="h-3 w-3 fill-amber-500/20" />
                        {streak.currentStreak}d
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleArchiveHabit(habit.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-dim hover:text-main hover:bg-surface-theme transition"
                    title={habit.archived ? 'Restore habit' : 'Archive habit'}
                  >
                    {habit.archived ? (
                      <ArchiveRestore className="h-4 w-4" />
                    ) : (
                      <Archive className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleEdit(habit)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-dim hover:text-arc-emerald hover:bg-surface-theme transition"
                    title="Edit habit details"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};
