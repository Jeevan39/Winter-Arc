import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import { 
  Home, 
  CheckCircle2, 
  CalendarRange, 
  Calendar, 
  Mountain, 
  BarChart3 
} from 'lucide-react';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'today', label: 'Today', icon: CheckCircle2 },
  { id: 'week', label: 'Week', icon: CalendarRange },
  { id: 'month', label: 'Month', icon: Calendar },
  { id: 'arc', label: 'Arc', icon: Mountain },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
];

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, settings } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none pb-safe-nav">
      <div className="mx-auto max-w-md px-3 pt-1">
        <nav
          className="pointer-events-auto flex items-center justify-around rounded-full border border-subtle-theme bg-card-elevated-theme px-1.5 py-1.5 shadow-[var(--shadow-card-elevated)] backdrop-blur-xl"
          role="navigation"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                whileTap={settings.animations ? { scale: 0.90 } : undefined}
                className={`relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center rounded-full px-1.5 py-1 text-center transition-colors duration-150 ${
                  isActive 
                    ? 'text-arc-emerald font-semibold' 
                    : 'text-dim hover:text-main'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
              >
                {/* Smooth Animated Active Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 34,
                    }}
                    className="absolute inset-0 rounded-full bg-accent-theme border border-accent-theme shadow-[var(--shadow-accent-glow)]"
                  />
                )}

                <Icon
                  className={`relative z-10 h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100 opacity-80'
                  }`}
                />

                <span className="relative z-10 text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>

                {/* Animated active micro-dot */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavDot"
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 34,
                    }}
                    className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[var(--color-accent-solid)] shadow-[0_0_6px_#10b981]"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
