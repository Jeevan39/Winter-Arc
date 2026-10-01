import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="pointer-events-none fixed top-18 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 animate-in fade-in slide-in-from-top-3">
      <div className="flex items-center gap-2.5 rounded-full border border-accent-theme bg-[var(--color-bg-card-elevated)] px-4 py-2 text-xs font-semibold shadow-xl backdrop-blur-xl">
        <Sparkles className="h-3.5 w-3.5 text-arc-emerald shrink-0 animate-pulse" />
        <span className="text-main">{toastMessage}</span>
      </div>
    </div>
  );
};
