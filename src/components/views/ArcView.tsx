import React from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../ui/GlassCard';
import { ProgressRing } from '../ui/ProgressRing';
import { getTodayString, parseDate, getDifferenceInDays } from '../../services/streakService';
import { Mountain, Flame, Award, Shield, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Milestone {
  day: number;
  title: string;
  codename: string;
  description: string;
  icon: React.ElementType;
}

const MILESTONES: Milestone[] = [
  {
    day: 1,
    title: 'Day 1',
    codename: 'The Ignition',
    description: 'You made the non-negotiable decision to transform in silence.',
    icon: Sparkles,
  },
  {
    day: 30,
    title: 'Day 30',
    codename: 'The Foundation',
    description: 'The friction disappears. Your habits become default behaviors.',
    icon: Shield,
  },
  {
    day: 60,
    title: 'Day 60',
    codename: 'The Hardening',
    description: 'While others quit when winter hits, your discipline sharpens.',
    icon: Flame,
  },
  {
    day: 92,
    title: 'Day 92',
    codename: 'The Ascension',
    description: 'Winter Arc completed. You emerge completely unrecognizable.',
    icon: Mountain,
  },
];

export const ArcView: React.FC = () => {
  const { arcProgress, habits, habitLogs, settings } = useApp();

  // Calculate highest current and best streak across any habit
  const currentDay = arcProgress.currentDay;
  const totalDays = arcProgress.totalDays;
  const percent = arcProgress.percent;

  const handleMilestoneClick = (m: Milestone, isUnlocked: boolean) => {
    if (isUnlocked && settings.animations) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#38bdf8', '#fbbf24'],
      });
    }
  };

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-arc-emerald">
          The Grand Journey
        </span>
        <h2 className="text-xl font-bold tracking-tight text-main mt-0.5">
          Winter Arc 2026
        </h2>
        <p className="text-xs text-sub mt-1">
          1 October → 31 December 2026 · {totalDays} Days of Relentless Focus
        </p>
      </div>

      {/* Hero Progress Ring Card */}
      <GlassCard variant="glow" className="p-5 text-center">
        <div className="flex flex-col items-center">
          <ProgressRing
            progress={percent}
            size={140}
            strokeWidth={11}
            className="my-1"
          >
            <span className="text-3xl font-extrabold font-mono text-main">
              {percent}%
            </span>
            <span className="text-xs font-semibold text-arc-emerald tracking-wide mt-0.5">
              Day {currentDay} of {totalDays}
            </span>
          </ProgressRing>

          <h3 className="text-base font-bold text-main mt-3">
            {totalDays - currentDay} Days Remaining
          </h3>
          <p className="text-xs text-sub max-w-xs mt-1">
            "While the world sleeps through the cold, the disciplined forge their future."
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-subtle-theme pt-4 text-center">
          <div className="rounded-xl bg-surface-theme p-2">
            <span className="block text-[10px] uppercase text-dim font-semibold">
              Elapsed
            </span>
            <span className="text-sm font-bold font-mono text-main">
              {currentDay}d
            </span>
          </div>

          <div className="rounded-xl bg-surface-theme p-2">
            <span className="block text-[10px] uppercase text-dim font-semibold">
              Target
            </span>
            <span className="text-sm font-bold font-mono text-main">
              {totalDays}d
            </span>
          </div>

          <div className="rounded-xl bg-surface-theme p-2">
            <span className="block text-[10px] uppercase text-dim font-semibold">
              Total Habits
            </span>
            <span className="text-sm font-bold font-mono text-arc-emerald">
              {habits.filter((h) => !h.archived).length}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* Long-Term Timeline Milestones */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sub px-1">
          Arc Milestones & Trials
        </h3>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-[var(--color-border-subtle)]">
          {MILESTONES.map((m) => {
            const isUnlocked = currentDay >= m.day;
            const isCurrent = currentDay >= m.day && (m.day === 120 || currentDay < (m.day + 30));
            const Icon = m.icon;

            return (
              <div
                key={m.day}
                onClick={() => handleMilestoneClick(m, isUnlocked)}
                className="relative cursor-pointer group"
              >
                {/* Node icon on vertical line */}
                <div
                  className={`absolute -left-6 top-3 flex h-6 w-6 items-center justify-center rounded-full border text-xs transition-transform duration-200 group-hover:scale-110 ${
                    isUnlocked
                      ? 'border-accent-solid bg-accent-solid text-accent-contrast shadow-[var(--shadow-accent-glow)]'
                      : 'border-subtle-theme bg-surface-theme text-dim'
                  }`}
                >
                  {isUnlocked ? <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" /> : <Lock className="h-3 w-3" />}
                </div>

                <GlassCard
                  className={`p-4 transition-all ${
                    isCurrent
                      ? 'border-accent-theme bg-accent-theme shadow-xs'
                      : isUnlocked
                      ? 'border-subtle-theme hover:border-medium-theme'
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${isUnlocked ? 'text-arc-emerald' : 'text-dim'}`}>
                        {m.title}
                      </span>
                      <span className="text-dim">·</span>
                      <h4 className="text-sm font-bold text-main">
                        {m.codename}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      {isUnlocked && (
                        <span className="rounded-full bg-accent-theme px-2 py-0.5 text-[10px] font-semibold text-arc-emerald">
                          Unlocked
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-1 text-xs text-sub leading-relaxed">
                    {m.description}
                  </p>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
