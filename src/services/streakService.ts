import { Habit, HabitLog, HabitStreak } from '../types';

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0); // Noon to avoid timezone drift
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function getDifferenceInDays(startStr: string, endStr: string): number {
  const s = parseDate(startStr).getTime();
  const e = parseDate(endStr).getTime();
  return Math.round((e - s) / (1000 * 60 * 60 * 24));
}

export function isHabitScheduledForDate(habit: Habit, dateStr: string): boolean {
  if (habit.frequency === 'everyday') return true;
  const d = parseDate(dateStr);
  const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon ...
  return habit.selectedDays ? habit.selectedDays.includes(dayOfWeek) : true;
}

export function calculateHabitStreak(
  habit: Habit,
  logs: HabitLog[],
  todayStr: string = getTodayString()
): HabitStreak {
  const logMap = new Map<string, boolean>();
  let totalCompletions = 0;
  let lastCompletedDate: string | undefined;

  for (const log of logs) {
    if (log.habitId === habit.id && log.completed) {
      logMap.set(log.date, true);
      totalCompletions++;
      if (!lastCompletedDate || log.date > lastCompletedDate) {
        lastCompletedDate = log.date;
      }
    }
  }

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = todayStr;
  const isTodayScheduled = isHabitScheduledForDate(habit, checkDate);
  const isTodayCompleted = logMap.get(checkDate) === true;

  if (isTodayCompleted) {
    currentStreak++;
    // Continue counting backwards from yesterday
    checkDate = addDays(checkDate, -1);
  } else if (isTodayScheduled) {
    // Today is scheduled but not completed yet; check yesterday to see if active
    checkDate = addDays(checkDate, -1);
  } else {
    // Today is not a scheduled day; start check from yesterday
    checkDate = addDays(checkDate, -1);
  }

  // Max lookback limit of 400 days to avoid infinite loop
  for (let i = 0; i < 400; i++) {
    const scheduled = isHabitScheduledForDate(habit, checkDate);
    if (scheduled) {
      if (logMap.get(checkDate) === true) {
        currentStreak++;
      } else {
        // Missed a scheduled day; streak breaks
        break;
      }
    }
    checkDate = addDays(checkDate, -1);
  }

  // Calculate best historical streak
  let bestStreak = currentStreak;
  let runningStreak = 0;

  // Gather all unique dates where habit could have been done up to today
  // We can look at the creation date of the habit or past 120 days
  const startDateStr = habit.createdAt ? habit.createdAt.split('T')[0] : addDays(todayStr, -120);
  const totalDays = Math.max(0, getDifferenceInDays(startDateStr, todayStr));

  for (let i = totalDays; i >= 0; i--) {
    const dStr = addDays(startDateStr, i);
    if (isHabitScheduledForDate(habit, dStr)) {
      if (logMap.get(dStr) === true) {
        runningStreak++;
        if (runningStreak > bestStreak) {
          bestStreak = runningStreak;
        }
      } else {
        runningStreak = 0;
      }
    }
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    totalCompletions,
    lastCompletedDate,
  };
}

export function getWeekDays(referenceDate: Date = new Date()): { dateStr: string; dayName: string; dayNumber: number; isToday: boolean }[] {
  const current = new Date(referenceDate);
  // Get start of week (Sunday or Monday, let's do Monday start for discipline / Winter Arc standard)
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(current.setDate(diff));

  const days = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayStr = getTodayString();

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = formatDate(d);
    days.push({
      dateStr,
      dayName: dayNames[i],
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr,
    });
  }
  return days;
}

export function getDaysInMonth(year: number, monthZeroIndexed: number): string[] {
  const date = new Date(year, monthZeroIndexed, 1);
  const days: string[] = [];
  while (date.getMonth() === monthZeroIndexed) {
    days.push(formatDate(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
