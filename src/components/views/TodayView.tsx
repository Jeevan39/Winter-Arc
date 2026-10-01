import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../ui/GlassCard';
import { ProgressRing } from '../ui/ProgressRing';
import { HabitCard } from '../habits/HabitCard';
import { MoodType } from '../../types';
import { 
  getTodayString, 
  parseDate, 
  formatDate, 
  addDays, 
  isHabitScheduledForDate 
} from '../../services/streakService';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Smile, 
  Flame, 
  PenTool, 
  Check, 
  Sparkles,
  Plus 
} from 'lucide-react';

const MOODS: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'exhausted', emoji: '😞', label: 'Tough' },
  { type: 'neutral', emoji: '😐', label: 'Steady' },
  { type: 'good', emoji: '🙂', label: 'Good' },
  { type: 'great', emoji: '😊', label: 'Strong' },
  { type: 'fire', emoji: '🔥', label: 'Locked In' },
];

export const TodayView: React.FC = () => {
  const { 
    habits, 
    habitLogs, 
    reflections, 
    saveMoodAndNotes, 
    setIsAddSheetOpen, 
    setEditingHabit 
  } = useApp();

  const todayStr = getTodayString();
  const [currentDateStr, setCurrentDateStr] = useState(todayStr);
  const [selectedMood, setSelectedMood] = useState<MoodType | undefined>();
  const [journalText, setJournalText] = useState('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Sync reflection for the selected date
  useEffect(() => {
    const existing = reflections.find((r) => r.date === currentDateStr);
    if (existing) {
      setSelectedMood(existing.mood);
      setJournalText(existing.notes || '');
    } else {
      setSelectedMood(undefined);
      setJournalText('');
    }
  }, [currentDateStr, reflections]);

  // Date formatting
  const dateObj = parseDate(currentDateStr);
  const formattedHeaderDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const isSelectedToday = currentDateStr === todayStr;

  // Habits scheduled for this date
  const scheduledHabits = habits
    .filter((h) => !h.archived)
    .filter((h) => isHabitScheduledForDate(h, currentDateStr));

  // Completion stats for this date
  const completedCount = scheduledHabits.filter((h) => {
    const l = habitLogs.find((log) => log.habitId === h.id && log.date === currentDateStr);
    return l && l.completed;
  }).length;

  const totalCount = scheduledHabits.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handlePrevDay = () => setCurrentDateStr((prev) => addDays(prev, -1));
  const handleNextDay = () => setCurrentDateStr((prev) => addDays(prev, 1));
  const handleJumpToday = () => setCurrentDateStr(todayStr);

  const handleSaveReflection = async () => {
    await saveMoodAndNotes(currentDateStr, selectedMood, journalText);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Date Navigation Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-arc-emerald">
            {isSelectedToday ? "Today's Mission" : 'Daily Log'}
          </span>
          <h2 className="text-xl font-bold tracking-tight text-main mt-0.5">
            {formattedHeaderDate}
          </h2>
        </div>

        {/* Date stepper */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevDay}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-subtle-theme bg-surface-theme text-sub hover:bg-surface-hover-theme active:scale-95 transition"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {!isSelectedToday && (
            <button
              onClick={handleJumpToday}
              className="rounded-xl border border-accent-theme bg-accent-theme px-2.5 py-1.5 text-xs font-semibold text-arc-emerald hover:opacity-90 transition"
            >
              Today
            </button>
          )}

          <button
            onClick={handleNextDay}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-subtle-theme bg-surface-theme text-sub hover:bg-surface-hover-theme active:scale-95 transition"
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Daily Progress Focus Card */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-medium text-sub">
              Completion Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-main">
                {percentage}%
              </span>
              <span className="text-xs text-dim">
                ({completedCount} of {totalCount} completed)
              </span>
            </div>
            <p className="text-xs text-arc-emerald font-medium">
              {percentage === 100 && totalCount > 0
                ? 'All disciplines conquered.'
                : percentage > 50
                ? 'Strong progress today.'
                : 'Every checked habit builds momentum.'}
            </p>
          </div>

          <ProgressRing
            progress={percentage}
            size={74}
            strokeWidth={7}
          >
            <span className="text-xs font-bold font-mono text-main">
              {percentage}%
            </span>
          </ProgressRing>
        </div>
      </GlassCard>

      {/* Habits List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sub">
            Disciplines for this Day
          </h3>
          <button
            onClick={() => {
              setEditingHabit(null);
              setIsAddSheetOpen(true);
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-arc-emerald hover:opacity-80"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Habit</span>
          </button>
        </div>

        {scheduledHabits.length === 0 ? (
          <GlassCard className="p-6 text-center space-y-2">
            <p className="text-xs text-dim">
              No disciplines added yet for this date.
            </p>
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
          scheduledHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              selectedDate={currentDateStr}
              onEdit={(h) => {
                setEditingHabit(h);
                setIsAddSheetOpen(true);
              }}
            />
          ))
        )}
      </div>

      {/* Daily Reflection & Mood Journal */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-subtle-theme pb-2.5">
          <div className="flex items-center gap-2">
            <PenTool className="h-4 w-4 text-arc-emerald" />
            <h3 className="text-sm font-bold text-main">Daily Reflection</h3>
          </div>
          <span className="text-[11px] text-dim">Private & Local</span>
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block text-xs font-medium text-sub mb-2">
            How was your day?
          </label>
          <div className="flex justify-between gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m.type}
                onClick={() => setSelectedMood(m.type)}
                className={`flex flex-col items-center justify-center rounded-xl p-2 flex-1 border transition active:scale-95 ${
                  selectedMood === m.type
                    ? 'border-accent-theme bg-accent-theme shadow-xs'
                    : 'border-subtle-theme bg-surface-theme hover:border-medium-theme'
                }`}
              >
                <span className="text-xl mb-0.5">{m.emoji}</span>
                <span className="text-[10px] text-sub font-medium">
                  {m.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Journal Notes */}
        <div>
          <label className="block text-xs font-medium text-sub mb-1.5">
            Thoughts & Learnings
          </label>
          <textarea
            rows={3}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Write down any notes, mindset reflections, or wins from today..."
            className="w-full rounded-xl border border-subtle-theme bg-surface-theme p-3 text-xs text-main placeholder-[var(--color-text-placeholder)] focus:border-accent-theme focus:outline-none transition resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveReflection}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
              isSavedRecently
                ? 'bg-accent-solid text-accent-contrast'
                : 'bg-surface-theme text-sub hover:bg-surface-hover-theme'
            }`}
          >
            {isSavedRecently ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>Saved to Device</span>
              </>
            ) : (
              <span>Save Reflection</span>
            )}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
