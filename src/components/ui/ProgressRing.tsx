import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  gradientId?: string;
  trackColor?: string;
  startColor?: string;
  endColor?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 140,
  strokeWidth = 10,
  className = '',
  children,
  gradientId = 'progress-ring-grad',
  trackColor,
  startColor = 'var(--color-accent-text, #10b981)',
  endColor = 'var(--color-accent-solid, #10b981)',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] transform transition-all duration-700 ease-out"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor || 'var(--color-progress-track)'}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className="transition-colors duration-200"
        />

        {/* Animated Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
};
