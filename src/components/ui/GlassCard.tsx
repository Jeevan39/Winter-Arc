import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'elevated' | 'glow';
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  children,
  className = '',
  glowColor,
  ...props
}) => {
  let baseClass = 'rounded-2xl transition-all duration-200 relative overflow-hidden ';

  switch (variant) {
    case 'subtle':
      baseClass += 'glass-panel-subtle ';
      break;
    case 'elevated':
      baseClass += 'glass-panel-elevated ';
      break;
    case 'glow':
      baseClass += 'glass-panel border-accent-theme shadow-[var(--shadow-accent-glow)] ';
      break;
    default:
      baseClass += 'glass-panel ';
      break;
  }

  return (
    <div
      className={`${baseClass} ${className}`}
      {...props}
    >
      {/* Subtle top edge specular highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border-subtle)] to-transparent" />
      {children}
    </div>
  );
};
