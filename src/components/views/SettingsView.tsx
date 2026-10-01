import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { GlassCard } from '../ui/GlassCard';
import { 
  downloadBackupFile, 
  validateImportPayload, 
  restoreFromPayload 
} from '../../services/backupService';
import { 
  ShieldCheck, 
  Download, 
  Upload, 
  Trash2, 
  Moon, 
  Sun, 
  Snowflake, 
  Sparkles, 
  Vibrate, 
  Calendar, 
  Check, 
  AlertTriangle,
  Smartphone,
  ExternalLink,
  Copy
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData, reloadAllData, showToast } = useApp();
  const { isInstallable, install } = usePWAInstall();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await downloadBackupFile();
      showToast('Data exported successfully.');
    } catch (err) {
      console.error(err);
      showToast('Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('Reading backup file...');
      const text = await file.text();
      const rawJson = JSON.parse(text);
      const validation = validateImportPayload(rawJson);

      if (!validation.valid || !validation.payload) {
        setImportStatus(`Import Error: ${validation.error || 'Invalid file format'}`);
        return;
      }

      await restoreFromPayload(validation.payload);
      await reloadAllData();
      setImportStatus(null);
      showToast('Data restored successfully! ✨');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      setImportStatus('Failed to parse backup JSON file.');
    }
  };

  const handleResetConfirm = async () => {
    await resetAllData();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-5 pb-28 pt-2">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-arc-emerald">
          Preferences & Security
        </span>
        <h2 className="text-xl font-bold tracking-tight text-main mt-0.5">
          Settings & Data
        </h2>
      </div>

      {/* Privacy Guarantee Banner */}
      <GlassCard className="p-4 border-accent-theme bg-accent-theme">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-6 w-6 text-arc-emerald shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-main">
              Zero External Servers. 100% Private.
            </h3>
            <p className="text-xs text-sub leading-relaxed">
              All habits, reflections, and streaks are stored strictly inside your browser's IndexedDB. No accounts, no telemetry, no tracking.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Appearance Settings */}
      <GlassCard className="p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sub">
          Visual Experience
        </h3>

        {/* Theme */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {settings.theme === 'dark' ? (
              <Moon className="h-4 w-4 text-arc-cyan" />
            ) : (
              <Sun className="h-4 w-4 text-arc-amber" />
            )}
            <div>
              <span className="text-xs font-semibold text-main block">Theme Mode</span>
              <span className="text-[11px] text-dim">Dark Obsidian or Winter Sun</span>
            </div>
          </div>

          <div className="flex gap-1 rounded-xl bg-surface-theme p-1 border border-subtle-theme">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => updateSettings({ theme: t })}
                className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold capitalize transition ${
                  settings.theme === t
                    ? 'bg-accent-solid text-accent-contrast font-bold shadow-xs'
                    : 'text-dim hover:text-main'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Snow Effect */}
        <div className="flex items-center justify-between border-t border-subtle-theme pt-3">
          <div className="flex items-center gap-2.5">
            <Snowflake className="h-4 w-4 text-arc-cyan" />
            <div>
              <span className="text-xs font-semibold text-main block">Winter Snow Atmosphere</span>
              <span className="text-[11px] text-dim">Subtle floating winter particles</span>
            </div>
          </div>

          <button
            onClick={() => updateSettings({ snowEffect: !settings.snowEffect })}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-semibold transition ${
              settings.snowEffect
                ? 'bg-accent-theme text-arc-emerald border border-accent-theme'
                : 'bg-surface-theme text-dim border border-subtle-theme hover:text-main'
            }`}
          >
            {settings.snowEffect ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Micro Animations */}
        <div className="flex items-center justify-between border-t border-subtle-theme pt-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-arc-amber" />
            <div>
              <span className="text-xs font-semibold text-main block">Celebratory Animations</span>
              <span className="text-[11px] text-dim">Confetti on milestones & perfect days</span>
            </div>
          </div>

          <button
            onClick={() => updateSettings({ animations: !settings.animations })}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-semibold transition ${
              settings.animations
                ? 'bg-accent-theme text-arc-emerald border border-accent-theme'
                : 'bg-surface-theme text-dim border border-subtle-theme hover:text-main'
            }`}
          >
            {settings.animations ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Haptics */}
        <div className="flex items-center justify-between border-t border-subtle-theme pt-3">
          <div className="flex items-center gap-2.5">
            <Vibrate className="h-4 w-4 text-arc-emerald" />
            <div>
              <span className="text-xs font-semibold text-main block">Tactile Feedback</span>
              <span className="text-[11px] text-dim">Haptic vibration on completion tap</span>
            </div>
          </div>

          <button
            onClick={() => updateSettings({ haptics: !settings.haptics })}
            className={`min-h-[36px] rounded-xl px-3.5 text-xs font-semibold transition ${
              settings.haptics
                ? 'bg-accent-theme text-arc-emerald border border-accent-theme'
                : 'bg-surface-theme text-dim border border-subtle-theme hover:text-main'
            }`}
          >
            {settings.haptics ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </GlassCard>

      {/* Arc Dates Configuration */}
      <GlassCard className="p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sub">
          Winter Arc Timeline Window
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-sub mb-1">Start Date</label>
            <input
              type="date"
              value={settings.arcStartDate}
              onChange={(e) => updateSettings({ arcStartDate: e.target.value })}
              className="w-full rounded-xl border border-subtle-theme bg-surface-theme px-3 py-2 text-xs text-main focus:border-accent-theme focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-sub mb-1">Target End Date</label>
            <input
              type="date"
              value={settings.arcEndDate}
              onChange={(e) => updateSettings({ arcEndDate: e.target.value })}
              className="w-full rounded-xl border border-subtle-theme bg-surface-theme px-3 py-2 text-xs text-main focus:border-accent-theme focus:outline-none"
            />
          </div>
        </div>
      </GlassCard>

      {/* Phone Installation & APK Section */}
      <GlassCard className="p-4 space-y-3.5 border-accent-theme">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-theme text-arc-emerald border border-accent-theme">
            <Smartphone className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-main">
              Install to Phone & APK
            </h3>
            <p className="text-[11px] text-sub">Install natively on Android without Play Store</p>
          </div>
        </div>

        {isInstallable && (
          <button
            onClick={install}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-accent-solid text-xs font-bold text-accent-contrast shadow-sm hover:opacity-90 active:scale-98 transition"
          >
            <Download className="h-4 w-4" />
            <span>Install App on Phone</span>
          </button>
        )}

        <div className="space-y-2 rounded-xl border border-subtle-theme bg-surface-theme p-3 text-xs text-sub leading-relaxed">
          <p className="font-semibold text-main">Two Ways to Install:</p>
          <ol className="list-decimal list-inside space-y-1.5 text-[11px]">
            <li>
              <strong className="text-main">Direct Phone Install (Instant):</strong> Open this app in Chrome on your phone, tap the <strong className="text-main">three dots (⋮)</strong>, and select <strong className="text-arc-emerald">"Install app"</strong> or <strong className="text-arc-emerald">"Add to Home screen"</strong>. It installs directly as a standalone app with zero data.
            </li>
            <li>
              <strong className="text-main">Export as .apk file:</strong> Copy your app link below, go to <strong className="text-main">pwabuilder.com</strong>, paste the link, and click <strong className="text-arc-cyan">"Package for Android"</strong> to download a standalone APK file for sideloading.
            </li>
          </ol>
        </div>

        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.origin);
              showToast('App URL copied to clipboard!');
            }
          }}
          className="flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-xl border border-subtle-theme bg-surface-theme text-xs font-medium text-main hover:bg-surface-hover-theme transition"
        >
          <Copy className="h-3.5 w-3.5 text-arc-cyan" />
          <span>Copy App Link for APK Builder</span>
        </button>
      </GlassCard>

      {/* Data Management Section */}
      <GlassCard className="p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sub">
          Data Management & Backups
        </h3>

        <p className="text-xs text-sub leading-relaxed">
          Safeguard your progress by downloading JSON backups. You can restore your habits, streaks, and reflections anytime or transfer them to another device.
        </p>

        {importStatus && (
          <div className="rounded-xl border border-amber-theme bg-amber-theme p-3 text-xs text-arc-amber">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-subtle-theme bg-surface-theme text-xs font-semibold text-main hover:bg-surface-hover-theme active:scale-95 transition"
          >
            <Download className="h-4 w-4 text-arc-emerald" />
            <span>Export Backup</span>
          </button>

          {/* Import button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-subtle-theme bg-surface-theme text-xs font-semibold text-main hover:bg-surface-hover-theme active:scale-95 transition"
          >
            <Upload className="h-4 w-4 text-arc-cyan" />
            <span>Import Backup</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Reset All Data */}
        <div className="border-t border-subtle-theme pt-3">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-rose-theme bg-rose-theme text-xs font-semibold text-arc-rose hover:opacity-80 active:scale-95 transition"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset All Application Data</span>
          </button>
        </div>
      </GlassCard>

      {/* About */}
      <div className="text-center text-xs text-dim space-y-1">
        <p className="font-bold text-main">WINTER ARC 2026</p>
        <p>Offline-First Progressive Web Application</p>
        <p className="text-[10px]">Build yourself quietly.</p>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-backdrop-heavy-theme backdrop-blur-md animate-in fade-in">
          <GlassCard className="w-full max-w-sm p-5 border-rose-theme bg-card-elevated-theme" variant="elevated">
            <div className="flex items-center gap-3 text-arc-rose mb-3">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-bold">Erase All Data?</h3>
            </div>

            <p className="text-xs text-sub leading-relaxed mb-5">
              This will permanently delete all your habits, daily streak logs, reflections, and achievements from this device. Consider downloading a backup first.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-xl border border-subtle-theme bg-surface-theme py-2.5 text-xs font-semibold text-sub hover:text-main hover:bg-surface-hover-theme transition"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="flex-1 rounded-xl bg-rose-solid py-2.5 text-xs font-bold text-rose-contrast hover:bg-rose-solid-hover transition shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
