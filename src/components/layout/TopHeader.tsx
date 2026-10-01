import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Snowflake, Sun, Moon, Plus } from 'lucide-react';
import { PWAInstallModal } from '../ui/PWAInstallModal';

export const TopHeader: React.FC = () => {
  const { 
    isDrawerOpen, 
    setIsDrawerOpen, 
    settings, 
    updateSettings, 
    setIsAddSheetOpen, 
    setEditingHabit 
  } = useApp();

  const cycleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const toggleSnow = () => {
    updateSettings({ snowEffect: !settings.snowEffect });
  };

  return (
    <header className="sticky top-0 z-30 w-full pt-safe">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        {/* Left: Menu / Drawer Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-subtle-theme bg-surface-theme text-sub hover:bg-surface-hover-theme hover:text-main active:scale-95 transition shadow-xs"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Center: Clean Single Wordmark */}
        <div className="flex items-center gap-1.5 select-none">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[var(--shadow-accent-glow)]" />
          <h1 className="text-sm font-bold tracking-[0.22em] text-main">
            WINTER ARC
          </h1>
          <span className="text-[10px] font-semibold text-arc-emerald tracking-wider">
            2026
          </span>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-1.5">
          <PWAInstallModal />

          {/* Snow toggle */}
          <button
            onClick={toggleSnow}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition active:scale-95 ${
              settings.snowEffect
                ? 'border-cyan-theme bg-cyan-theme text-arc-cyan shadow-[0_0_10px_-2px_rgba(6,182,212,0.3)]'
                : 'border-subtle-theme bg-surface-theme text-dim hover:text-main'
            }`}
            title={settings.snowEffect ? 'Snow animation active' : 'Snow animation paused'}
            aria-label="Toggle snow animation"
          >
            <Snowflake className={`h-4 w-4 ${settings.snowEffect ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-subtle-theme bg-surface-theme text-sub hover:bg-surface-hover-theme hover:text-main active:scale-95 transition shadow-xs"
            title={`Current theme: ${settings.theme}`}
            aria-label="Toggle dark/light theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="h-4 w-4 text-arc-amber" />
            ) : (
              <Moon className="h-4 w-4 text-sub" />
            )}
          </button>

          {/* New Habit Quick Add */}
          <button
            onClick={() => {
              setEditingHabit(null);
              setIsAddSheetOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-solid text-accent-contrast font-bold hover:opacity-90 active:scale-95 transition shadow-[0_0_12px_-2px_rgba(16,185,129,0.5)]"
            title="Create new habit"
            aria-label="Create new habit"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </header>
  );
};
