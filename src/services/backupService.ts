import { ExportDataPayload, Habit, HabitLog, DailyReflection, UserSettings, Achievement } from '../types';
import { 
  getDB, 
  loadSettings, 
  loadHabits, 
  loadAllHabitLogs, 
  loadReflections, 
  loadAchievements, 
  clearAllDatabase,
  DEFAULT_SETTINGS 
} from './db';
import { formatDate } from './streakService';

export async function createExportPayload(): Promise<ExportDataPayload> {
  const [settings, habits, habitLogs, reflections, achievements] = await Promise.all([
    loadSettings(),
    loadHabits(),
    loadAllHabitLogs(),
    loadReflections(),
    loadAchievements(),
  ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: 'Winter Arc 2026',
    settings,
    habits,
    habitLogs,
    reflections,
    achievements,
  };
}

export async function downloadBackupFile(): Promise<void> {
  const payload = await createExportPayload();
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `winter_arc_backup_${formatDate(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  payload?: ExportDataPayload;
}

export function validateImportPayload(rawJson: unknown): ValidationResult {
  if (!rawJson || typeof rawJson !== 'object') {
    return { valid: false, error: 'Backup file must contain a valid JSON object.' };
  }

  const obj = rawJson as Partial<ExportDataPayload>;

  if (obj.app !== 'Winter Arc 2026') {
    return { valid: false, error: 'Unrecognized file format: Not a Winter Arc 2026 backup.' };
  }

  if (!Array.isArray(obj.habits)) {
    return { valid: false, error: 'Corrupted backup file: "habits" list is missing.' };
  }

  if (!Array.isArray(obj.habitLogs)) {
    return { valid: false, error: 'Corrupted backup file: "habitLogs" list is missing.' };
  }

  // Validate each habit has required fields
  for (const h of obj.habits) {
    if (!h.id || typeof h.name !== 'string' || typeof h.color !== 'string') {
      return { valid: false, error: 'Habit records in file are malformed.' };
    }
  }

  return { valid: true, payload: obj as ExportDataPayload };
}

export async function restoreFromPayload(payload: ExportDataPayload): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['habits', 'habitLogs', 'reflections', 'settings', 'achievements'], 'readwrite');

  // Clear existing
  await tx.objectStore('habits').clear();
  await tx.objectStore('habitLogs').clear();
  await tx.objectStore('reflections').clear();
  await tx.objectStore('settings').clear();
  await tx.objectStore('achievements').clear();

  // Restore habits
  for (const h of payload.habits) {
    await tx.objectStore('habits').put(h);
  }

  // Restore logs
  for (const log of payload.habitLogs) {
    await tx.objectStore('habitLogs').put(log);
  }

  // Restore reflections
  if (Array.isArray(payload.reflections)) {
    for (const ref of payload.reflections) {
      await tx.objectStore('reflections').put(ref);
    }
  }

  // Restore settings
  if (payload.settings) {
    await tx.objectStore('settings').put(payload.settings);
  } else {
    await tx.objectStore('settings').put(DEFAULT_SETTINGS);
  }

  // Restore achievements
  if (Array.isArray(payload.achievements)) {
    for (const ach of payload.achievements) {
      await tx.objectStore('achievements').put(ach);
    }
  }

  await tx.done;
}
