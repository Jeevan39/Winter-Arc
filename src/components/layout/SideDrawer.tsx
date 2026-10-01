import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import {
  Home,
  CheckCircle2,
  CalendarRange,
  Calendar,
  Mountain,
  BarChart3,
  ListTodo,
  Settings,
  ShieldCheck,
  X,
  Sparkles,
  Flame,
} from 'lucide-react';

interface DrawerItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const SideDrawer: React.FC = () => {
  const { isDrawerOpen, setIsDrawerOpen, currentView, setCurrentView, settings, habits } = useApp();

  if (!isDrawerOpen) return null;

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    setIsDrawerOpen(false);
  };

  const navItems: DrawerItem[] = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'today', label: 'Today’s Mission', icon: CheckCircle2 },
    { id: 'week', label: 'Weekly Overview', icon: CalendarRange },
    { id: 'month', label: 'Monthly Matrix', icon: Calendar },
    { id: 'arc', label: 'Winter Arc Journey', icon: Mountain },
    { id: 'insights', label: 'Insights & Analytics', icon: BarChart3 },
    { id: 'habits', label: 'Manage Habits', icon: ListTodo, badge: `${habits.length}` },
    { id: 'settings', label: 'Settings & Data Backup', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="fixed inset-0 bg-backdrop-theme backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-[82%] max-w-xs flex-col border-r border-subtle-theme bg-card-elevated-theme p-5 shadow-2xl backdrop-blur-2xl transition-transform duration-300 animate-in slide-in-from-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-subtle-theme pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent-theme bg-accent-theme text-arc-emerald shadow-[var(--shadow-accent-glow)]">
              <Mountain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-widest text-main">WINTER ARC</h2>
              <p className="text-[11px] font-medium text-arc-emerald">2026 EDITION</p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-subtle-theme bg-surface-theme text-dim hover:text-main"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Stats Snapshot */}
        <div className="my-4 rounded-xl border border-subtle-theme bg-surface-theme p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-semibold text-sub">Level {settings.level}</span>
            </div>
            <span className="text-xs font-mono font-medium text-arc-emerald">
              {settings.xp} XP
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-track-theme">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${(settings.xp % 100)}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-dim">
            <span>Next rank</span>
            <span>{100 - (settings.xp % 100)} XP to go</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex w-full min-h-[44px] items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'border border-accent-theme bg-accent-theme text-arc-emerald font-semibold shadow-xs'
                    : 'text-sub hover:bg-surface-theme hover:text-main'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-arc-emerald' : 'text-dim'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-surface-theme px-2 py-0.5 text-[10px] font-mono text-sub">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Local Storage Guarantee */}
        <div className="border-t border-subtle-theme pt-4">
          <div className="flex items-center gap-2 rounded-xl bg-accent-theme border border-accent-theme p-2.5 text-[11px] text-arc-emerald">
            <ShieldCheck className="h-4 w-4 text-arc-emerald shrink-0" />
            <span className="leading-tight">Your data stays 100% on this device. Fully private.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
