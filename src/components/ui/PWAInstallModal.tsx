import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const PWAInstallModal: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          className="flex items-center gap-1.5 rounded-full border border-accent-theme bg-accent-theme px-2.5 py-1 text-[11px] font-medium text-arc-emerald hover:opacity-85 active:scale-95 transition"
        >
          <Download className="h-3 w-3" />
          <span>Install</span>
        </button>
      )}

      {isIOS && !isInstallable && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-cyan-theme bg-cyan-theme px-2.5 py-1 text-[11px] font-medium text-arc-cyan hover:opacity-85 active:scale-95 transition"
        >
          <Download className="h-3 w-3" />
          <span>Install App</span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-backdrop-heavy-theme backdrop-blur-md animate-in fade-in">
          <GlassCard className="w-full max-w-sm p-6 relative" variant="elevated">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-dim hover:text-main"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-theme text-arc-emerald border border-accent-theme shadow-xs">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-main">Install Winter Arc</h3>
                <p className="text-xs text-dim">Add to iPhone or iPad Home Screen</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-sub">
              <div className="flex items-start gap-2.5 rounded-xl bg-surface-theme border border-subtle-theme p-3">
                <Share className="h-4 w-4 text-arc-cyan shrink-0 mt-0.5" />
                <span>
                  1. Tap the <strong className="text-main">Share</strong> icon at the bottom of Safari.
                </span>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl bg-surface-theme border border-subtle-theme p-3">
                <PlusSquare className="h-4 w-4 text-arc-emerald shrink-0 mt-0.5" />
                <span>
                  2. Scroll down and tap <strong className="text-main">Add to Home Screen</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl bg-surface-theme border border-subtle-theme p-3">
                <span className="text-arc-emerald font-bold shrink-0">✓</span>
                <span>
                  3. Launch Winter Arc from your home screen for full offline standalone mode.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-accent-solid py-2.5 text-xs font-bold text-accent-contrast hover:opacity-90 active:scale-[0.98] transition shadow-[var(--shadow-accent-glow)]"
            >
              Got it
            </button>
          </GlassCard>
        </div>
      )}
    </>
  );
};
