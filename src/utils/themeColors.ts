export interface HabitColorTheme {
  badge: string;        // container for icon: bg-*-theme border border-*-theme text-arc-*
  text: string;         // text-arc-*
  bgSubtle: string;     // bg-*-theme
  borderSubtle: string; // border-*-theme
  solid: string;        // bg-*-solid text-*-contrast border-*-solid
  glow: string;         // glowing shadow
}

/**
 * Maps any habit color string (hex code or palette name) to semantic theme classes.
 * Ensures strict contrast and theme compatibility in both light and dark modes.
 */
export function getHabitColorTheme(color?: string): HabitColorTheme {
  if (!color) {
    return {
      badge: 'bg-accent-theme border border-accent-theme text-arc-emerald',
      text: 'text-arc-emerald',
      bgSubtle: 'bg-accent-theme',
      borderSubtle: 'border-accent-theme',
      solid: 'bg-accent-solid text-accent-contrast border-accent-solid',
      glow: 'shadow-[var(--shadow-accent-glow)]',
    };
  }

  const c = color.toLowerCase();

  // Cyan / Ice Blue / Cobalt
  if (
    c === '#38bdf8' ||
    c === '#06b6d4' ||
    c === '#3b82f6' ||
    c.includes('blue') ||
    c.includes('cyan') ||
    c.includes('cobalt')
  ) {
    return {
      badge: 'bg-cyan-theme border border-cyan-theme text-arc-cyan',
      text: 'text-arc-cyan',
      bgSubtle: 'bg-cyan-theme',
      borderSubtle: 'border-cyan-theme',
      solid: 'bg-cyan-solid text-cyan-contrast border-cyan-solid',
      glow: 'shadow-[0_0_15px_-2px_rgba(6,182,212,0.4)]',
    };
  }

  // Violet / Purple
  if (
    c === '#8b5cf6' ||
    c === '#a855f7' ||
    c === '#c084fc' ||
    c.includes('violet') ||
    c.includes('purple')
  ) {
    return {
      badge: 'bg-purple-theme border border-purple-theme text-arc-purple',
      text: 'text-arc-purple',
      bgSubtle: 'bg-purple-theme',
      borderSubtle: 'border-purple-theme',
      solid: 'bg-purple-solid text-purple-contrast border-purple-solid',
      glow: 'shadow-[0_0_15px_-2px_rgba(139,92,246,0.4)]',
    };
  }

  // Amber / Gold
  if (
    c === '#f59e0b' ||
    c === '#eab308' ||
    c.includes('amber') ||
    c.includes('gold')
  ) {
    return {
      badge: 'bg-amber-theme border border-amber-theme text-arc-amber',
      text: 'text-arc-amber',
      bgSubtle: 'bg-amber-theme',
      borderSubtle: 'border-amber-theme',
      solid: 'bg-amber-solid text-amber-contrast border-amber-solid',
      glow: 'shadow-[0_0_15px_-2px_rgba(245,158,11,0.4)]',
    };
  }

  // Rose / Crimson
  if (
    c === '#ec4899' ||
    c === '#ef4444' ||
    c === '#f43f5e' ||
    c === '#be123c' ||
    c.includes('rose') ||
    c.includes('crimson') ||
    c.includes('pink') ||
    c.includes('red')
  ) {
    return {
      badge: 'bg-rose-theme border border-rose-theme text-arc-rose',
      text: 'text-arc-rose',
      bgSubtle: 'bg-rose-theme',
      borderSubtle: 'border-rose-theme',
      solid: 'bg-rose-solid text-rose-contrast border-rose-solid',
      glow: 'shadow-[0_0_15px_-2px_rgba(244,63,94,0.4)]',
    };
  }

  // Default: Emerald / Lime
  return {
    badge: 'bg-accent-theme border border-accent-theme text-arc-emerald',
    text: 'text-arc-emerald',
    bgSubtle: 'bg-accent-theme',
    borderSubtle: 'border-accent-theme',
    solid: 'bg-accent-solid text-accent-contrast border-accent-solid',
    glow: 'shadow-[var(--shadow-accent-glow)]',
  };
}
