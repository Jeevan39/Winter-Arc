import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../ui/GlassCard';
import { Mountain, Sparkles, Check, ArrowRight, Shield, Flame, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingView: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-12-31');

  const handleFinish = async () => {
    // Start completely from zero: zero preloaded habits, blank slate to add user tasks
    await completeOnboarding([], startDate, endDate);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#38bdf8', '#ffffff'],
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-6 max-w-md mx-auto z-10">
      {/* Top progress dots */}
      <div className="flex items-center justify-center gap-2 pt-4">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === step ? 'w-8 bg-emerald-500 shadow-[var(--shadow-accent-glow)]' : s < step ? 'w-2 bg-emerald-600' : 'w-2 bg-track-theme'
            }`}
          />
        ))}
      </div>

      {/* Screen 1: Identity & Call */}
      {step === 1 && (
        <div className="my-auto space-y-6 text-center animate-in fade-in duration-300">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-accent-theme bg-accent-theme text-arc-emerald shadow-[var(--shadow-accent-glow)]">
            <Mountain className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-arc-emerald">
              Welcome to the protocol
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-main">
              WINTER ARC 2026
            </h1>
            <p className="text-sm font-medium text-sub italic">
              "Build yourself quietly in the cold."
            </p>
          </div>

          <GlassCard className="p-4 text-left space-y-2.5 text-xs text-sub">
            <div className="flex items-center gap-2 text-arc-emerald font-semibold">
              <Shield className="h-4 w-4 shrink-0" />
              <span>100% Private & Device-Only</span>
            </div>
            <p className="leading-relaxed">
              No accounts, passwords, or cloud servers. Your personal transformation is recorded strictly inside this device.
            </p>
          </GlassCard>
        </div>
      )}

      {/* Screen 2: Choose Arc Dates */}
      {step === 2 && (
        <div className="my-auto space-y-5 animate-in fade-in duration-300">
          <div className="space-y-1 text-center">
            <span className="text-xs font-bold tracking-widest uppercase text-arc-emerald">
              Step 2 of 4
            </span>
            <h2 className="text-2xl font-bold text-main">
              Set Your Arc Window
            </h2>
            <p className="text-xs text-sub">
              Choose the timeline of your discipline. Standard Winter Arc runs from October 1st through December 31st 2026.
            </p>
          </div>

          <GlassCard className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-sub mb-1.5">
                Arc Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-subtle-theme bg-surface-theme px-4 py-3 text-sm text-main focus:border-accent-theme focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-sub mb-1.5">
                Arc Conclusion Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-subtle-theme bg-surface-theme px-4 py-3 text-sm text-main focus:border-accent-theme focus:outline-none"
              />
            </div>
          </GlassCard>
        </div>
      )}

      {/* Screen 3: Powerful Encouraging Thought on Discipline */}
      {step === 3 && (
        <div className="my-auto space-y-4 animate-in fade-in duration-300">
          <div className="space-y-1 text-center">
            <span className="text-xs font-bold tracking-widest uppercase text-arc-emerald">
              Step 3 of 4 · Mindset Protocol
            </span>
            <h2 className="text-2xl font-bold text-main">
              The Power of Discipline
            </h2>
            <p className="text-xs text-sub">
              Internalize the mindset before you step into the cold.
            </p>
          </div>

          <GlassCard variant="glow" className="p-5 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-theme bg-accent-theme text-arc-emerald shadow-[var(--shadow-accent-glow)]">
              <Flame className="h-7 w-7 fill-emerald-500/20" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-arc-emerald">
                The Creed of the Disciplined
              </span>
              <h3 className="text-lg font-extrabold tracking-tight text-main leading-snug">
                "Discipline is not a restriction. It is the ultimate act of self-respect."
              </h3>
            </div>

            <p className="text-xs text-sub leading-relaxed">
              Motivation is an emotion—it vanishes when you are tired or cold. Discipline is an identity. When daily action is non-negotiable, self-doubt disappears and results compound.
            </p>
          </GlassCard>

          {/* Three Pillars of Discipline */}
          <div className="space-y-2 pt-1">
            <div className="flex items-start gap-3 rounded-xl border border-subtle-theme bg-surface-theme p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-theme text-arc-emerald border border-accent-theme mt-0.5">
                <Check className="h-4 w-4 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-main">Rule of Non-Negotiation</h4>
                <p className="text-[11px] text-dim leading-relaxed mt-0.5">
                  Decide once before the season begins. Never negotiate with fatigue in the moment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-subtle-theme bg-surface-theme p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-theme text-arc-cyan border border-cyan-theme mt-0.5">
                <Mountain className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-main">Consistency Over Intensity</h4>
                <p className="text-[11px] text-dim leading-relaxed mt-0.5">
                  Small, relentless daily execution outlasts erratic bursts of willpower every time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-subtle-theme bg-surface-theme p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-theme text-arc-amber border border-amber-theme mt-0.5">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-main">Quiet Execution</h4>
                <p className="text-[11px] text-dim leading-relaxed mt-0.5">
                  No public proclamations. Build yourself in silence; let spring reveal the transformation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 4: Ready to Launch */}
      {step === 4 && (
        <div className="my-auto space-y-6 text-center animate-in fade-in duration-300">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-accent-theme bg-accent-theme text-arc-emerald shadow-[var(--shadow-accent-glow)]">
            <Sparkles className="h-10 w-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase text-arc-emerald">
              Protocol Ready
            </span>
            <h2 className="text-3xl font-extrabold text-main">
              Ready to Step In?
            </h2>
            <p className="text-xs text-sub max-w-xs mx-auto leading-relaxed">
              You start with a clean slate from zero. Add your own non-negotiable disciplines, check them off daily, and build your transformation from the ground up.
            </p>
          </div>

          <GlassCard className="p-4 text-left border-accent-theme bg-accent-theme">
            <p className="text-xs text-arc-emerald text-center font-medium">
              "No announcements. No excuses. Just relentless daily proof."
            </p>
          </GlassCard>
        </div>
      )}

      {/* Bottom Button Controls */}
      <div className="pt-6 pb-2">
        {step < 4 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-accent-solid text-sm font-bold text-accent-contrast shadow-[var(--shadow-accent-glow)] hover:opacity-90 active:scale-[0.98] transition"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-accent-solid text-sm font-extrabold text-accent-contrast shadow-[var(--shadow-accent-glow)] hover:opacity-90 active:scale-[0.98] transition"
          >
            <span>START MY ARC</span>
            <Sparkles className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
