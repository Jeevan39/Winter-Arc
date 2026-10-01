import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { SideDrawer } from './SideDrawer';
import { SnowEffect } from '../ui/SnowEffect';
import { Toast } from '../ui/Toast';
import { HabitSheet } from '../habits/HabitSheet';
import { OnboardingView } from '../views/OnboardingView';
import { HomeView } from '../views/HomeView';
import { TodayView } from '../views/TodayView';
import { WeekView } from '../views/WeekView';
import { MonthView } from '../views/MonthView';
import { ArcView } from '../views/ArcView';
import { InsightsView } from '../views/InsightsView';
import { HabitsManagerView } from '../views/HabitsManagerView';
import { SettingsView } from '../views/SettingsView';

export const AppShell: React.FC = () => {
  const { currentView, settings, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-theme text-arc-emerald">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent shadow-[var(--shadow-accent-glow)]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-dim">
            Initializing Winter Arc...
          </span>
        </div>
      </div>
    );
  }

  // Show onboarding on first launch
  if (!settings.hasCompletedOnboarding) {
    return (
      <div
        className="relative min-h-screen w-full transition-colors duration-300 flex justify-center overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200 bg-app-theme text-main"
      >
        {/* Atmospheric winter gradients */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div
            className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full blur-[130px] bg-emerald-500/10"
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full blur-[130px] bg-cyan-500/10"
          />
        </div>
        <SnowEffect />
        <OnboardingView />
      </div>
    );
  }

  // Page animation settings
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 6,
      scale: 0.995,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: settings.animations ? 0.22 : 0,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -6,
      scale: 0.995,
      transition: {
        duration: settings.animations ? 0.16 : 0,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  // View routing resolution
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'today':
        return <TodayView />;
      case 'week':
        return <WeekView />;
      case 'month':
        return <MonthView />;
      case 'arc':
        return <ArcView />;
      case 'insights':
        return <InsightsView />;
      case 'habits':
        return <HabitsManagerView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div
      className="relative min-h-screen w-full transition-colors duration-300 flex justify-center selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden bg-app-theme text-main"
    >
      {/* Ambient Winter Gradient Lights */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full blur-[120px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent"
        />
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 h-[300px] w-[500px] rounded-full blur-[100px] bg-emerald-500/5"
        />
      </div>

      {/* Atmospheric Snow Canvas Particles */}
      <SnowEffect />

      {/* Floating System Toast */}
      <Toast />

      {/* Main Centered Mobile Application Shell */}
      <div className="relative z-10 flex min-h-screen w-full max-w-lg flex-col px-4">
        {/* Sticky Top Header */}
        <TopHeader />

        {/* Animated Page Transitions Routing Area */}
        <main className="flex-1 w-full pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Glass Bottom Navigation Bar */}
        <BottomNav />

        {/* Side Navigation Drawer */}
        <SideDrawer />

        {/* Bottom Sheet for Habit Creation / Editing */}
        <HabitSheet />
      </div>
    </div>
  );
};
