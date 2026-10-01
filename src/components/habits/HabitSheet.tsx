import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Habit } from '../../types';
import { HabitIcon, ICON_OPTIONS, HABIT_COLORS } from '../icons/HabitIcon';
import { GlassCard } from '../ui/GlassCard';
import { getHabitColorTheme } from '../../utils/themeColors';
import { X, Check, Trash2, Archive, ArchiveRestore } from 'lucide-react';

export const HabitSheet: React.FC = () => {
  const { 
    isAddSheetOpen, 
    setIsAddSheetOpen, 
    editingHabit, 
    setEditingHabit, 
    createHabit, 
    updateHabit, 
    deleteHabit, 
    toggleArchiveHabit 
  } = useApp();

  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Sun');
  const [selectedColor, setSelectedColor] = useState('#10b981');
  const [frequency, setFrequency] = useState<'everyday' | 'custom'>('everyday');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [target, setTarget] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [iconCategory, setIconCategory] = useState<'all' | 'mind' | 'body' | 'focus' | 'lifestyle'>('all');

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setSelectedIcon(editingHabit.icon);
      setSelectedColor(editingHabit.color);
      setFrequency(editingHabit.frequency);
      setSelectedDays(editingHabit.selectedDays || [0, 1, 2, 3, 4, 5, 6]);
      setTarget(editingHabit.target || '');
      setReminderTime(editingHabit.reminderTime || '');
    } else {
      setName('');
      setSelectedIcon('Sun');
      setSelectedColor('#10b981');
      setFrequency('everyday');
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
      setTarget('');
      setReminderTime('');
    }
    setShowDeleteConfirm(false);
  }, [editingHabit, isAddSheetOpen]);

  if (!isAddSheetOpen && !editingHabit) return null;

  const handleClose = () => {
    setIsAddSheetOpen(false);
    setEditingHabit(null);
    setShowDeleteConfirm(false);
  };

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
      }
    } else {
      setSelectedDays([...selectedDays, dayIndex].sort());
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingHabit) {
      await updateHabit({
        ...editingHabit,
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        frequency,
        selectedDays: frequency === 'everyday' ? [0, 1, 2, 3, 4, 5, 6] : selectedDays,
        target: target.trim() || undefined,
        reminderTime: reminderTime.trim() || undefined,
      });
    } else {
      await createHabit({
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        frequency,
        selectedDays: frequency === 'everyday' ? [0, 1, 2, 3, 4, 5, 6] : selectedDays,
        target: target.trim() || undefined,
        reminderTime: reminderTime.trim() || undefined,
      });
    }

    handleClose();
  };

  const handleDelete = async () => {
    if (editingHabit) {
      await deleteHabit(editingHabit.id);
      handleClose();
    }
  };

  const handleArchiveToggle = async () => {
    if (editingHabit) {
      await toggleArchiveHabit(editingHabit.id);
      handleClose();
    }
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const filteredIcons = iconCategory === 'all' 
    ? ICON_OPTIONS 
    : ICON_OPTIONS.filter((ico) => ico.category === iconCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-backdrop-heavy-theme backdrop-blur-sm animate-in fade-in">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Sheet Container */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-3xl border-t border-subtle-theme bg-[var(--color-bg-card-elevated)] pb-safe shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Grab Handle */}
        <div className="mx-auto my-2.5 h-1.5 w-12 rounded-full bg-[var(--color-border-strong)]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-3 pt-1 border-b border-subtle-theme">
          <h2 className="text-base font-bold text-main">
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-theme text-dim hover:text-main hover:bg-surface-hover-theme transition"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-4 space-y-5 no-scrollbar">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sub mb-1.5">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wake Early, Gym, Deep Study, 3L Water"
              className="w-full rounded-xl border border-subtle-theme bg-surface-theme px-4 py-3 text-sm text-main placeholder-[var(--color-text-placeholder)] focus:border-accent-theme focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
              required
            />
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sub mb-2">
              Color Accent
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              {HABIT_COLORS.map((c) => {
                const theme = getHabitColorTheme(c.hex);
                return (
                  <button
                    type="button"
                    key={c.hex}
                    onClick={() => setSelectedColor(c.hex)}
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform ${theme.solid} ${
                      selectedColor === c.hex ? 'scale-110 ring-2 ring-emerald-500 ring-offset-2 ring-offset-[var(--color-bg-card-elevated)]' : 'hover:scale-105'
                    }`}
                    title={c.name}
                  >
                    {selectedColor === c.hex && <Check className="h-4 w-4 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Selector with Category Filters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-sub">
                Choose Icon
              </label>
              <div className="flex gap-1 text-[11px]">
                {(['all', 'mind', 'body', 'focus', 'lifestyle'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setIconCategory(cat)}
                    className={`capitalize px-2 py-0.5 rounded-md transition ${
                      iconCategory === cat ? 'bg-accent-theme text-arc-emerald font-semibold border border-accent-theme' : 'text-dim hover:text-main'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto rounded-xl border border-subtle-theme bg-surface-theme p-2.5">
              {filteredIcons.map((opt) => {
                const isSelected = selectedIcon === opt.name;
                return (
                  <button
                    type="button"
                    key={opt.name}
                    onClick={() => setSelectedIcon(opt.name)}
                    className={`flex h-11 w-full items-center justify-center rounded-xl border transition ${
                      isSelected
                        ? 'border-accent-theme bg-accent-theme text-arc-emerald shadow-[var(--shadow-accent-glow)]'
                        : 'border-subtle-theme bg-surface-theme text-sub hover:border-medium-theme hover:text-main'
                    }`}
                    title={opt.label}
                  >
                    <HabitIcon name={opt.name} className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frequency Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sub mb-2">
              Frequency
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFrequency('everyday')}
                className={`min-h-[44px] rounded-xl border text-xs font-medium transition ${
                  frequency === 'everyday'
                    ? 'border-accent-theme bg-accent-theme text-arc-emerald font-semibold'
                    : 'border-subtle-theme bg-surface-theme text-sub hover:text-main hover:bg-surface-hover-theme'
                }`}
              >
                Every Day (Warrior)
              </button>
              <button
                type="button"
                onClick={() => setFrequency('custom')}
                className={`min-h-[44px] rounded-xl border text-xs font-medium transition ${
                  frequency === 'custom'
                    ? 'border-accent-theme bg-accent-theme text-arc-emerald font-semibold'
                    : 'border-subtle-theme bg-surface-theme text-sub hover:text-main hover:bg-surface-hover-theme'
                }`}
              >
                Custom Days
              </button>
            </div>

            {frequency === 'custom' && (
              <div className="mt-3 flex justify-between gap-1">
                {dayLabels.map((lbl, idx) => {
                  const isDaySelected = selectedDays.includes(idx);
                  return (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`flex h-10 flex-1 items-center justify-center rounded-xl border text-xs font-medium transition ${
                        isDaySelected
                          ? 'border-accent-solid bg-accent-solid text-accent-contrast font-bold shadow-[var(--shadow-accent-glow)]'
                          : 'border-subtle-theme bg-surface-theme text-sub hover:text-main hover:border-medium-theme'
                      }`}
                    >
                      {lbl.slice(0, 1)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Target & Reminder Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-sub mb-1.5">
                Target (Optional)
              </label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. 30 mins, 20 pages"
                className="w-full rounded-xl border border-subtle-theme bg-surface-theme px-3 py-2.5 text-xs text-main placeholder-[var(--color-text-placeholder)] focus:border-accent-theme focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-sub mb-1.5">
                Target Time (Optional)
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full rounded-xl border border-subtle-theme bg-surface-theme px-3 py-2.5 text-xs text-main focus:border-accent-theme focus:outline-none transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-accent-solid text-sm font-bold text-accent-contrast shadow-[var(--shadow-accent-glow)] hover:opacity-90 active:scale-[0.98] transition"
            >
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </button>

            {editingHabit && (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleArchiveToggle}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-subtle-theme bg-surface-theme text-xs font-medium text-sub hover:bg-surface-hover-theme hover:text-main transition"
                >
                  {editingHabit.archived ? (
                    <>
                      <ArchiveRestore className="h-4 w-4" />
                      <span>Unarchive</span>
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4" />
                      <span>Archive</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-theme bg-rose-theme text-xs font-medium text-arc-rose hover:opacity-80 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Delete Confirmation Alert Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-backdrop-heavy-theme backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl border border-rose-theme bg-[var(--color-bg-card-elevated)] p-5 shadow-2xl">
              <h3 className="text-sm font-bold text-arc-rose">Delete Habit?</h3>
              <p className="mt-1.5 text-xs text-sub">
                Are you sure you want to delete <strong className="text-main">"{name}"</strong>? All past streak logs for this habit will be permanently deleted.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-xl border border-subtle-theme bg-surface-theme py-2.5 text-xs font-medium text-sub hover:text-main hover:bg-surface-hover-theme transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 rounded-xl bg-rose-solid py-2.5 text-xs font-bold text-rose-contrast hover:bg-rose-solid-hover transition shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
