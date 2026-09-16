import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

type ProgressBarProps = {
  completed: number;
  total: number;
  className?: string;
};

export function ProgressBar({ completed, total, className }: ProgressBarProps) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const allDone = completed > 0 && completed === total;

  return (
    <div
      className={cn(
        'h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden',
        className
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500 ease-out',
          allDone
            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
            : 'bg-gradient-to-r from-sky-400 to-blue-500'
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

type CircularProgressProps = {
  value: number; // 0-1
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
};

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 10,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - value * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
          style={{
            stroke: value >= 1 ? '#10b981' : '#3b82f6',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

type CheckCircleProps = {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
};

export function CheckCircle({ checked, onToggle, size = 28, className }: CheckCircleProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={cn(
        'flex items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90',
        checked
          ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
          : 'bg-transparent border-gray-300 dark:border-gray-600 text-transparent hover:border-emerald-400',
        className
      )}
      style={{ width: size, height: size }}
    >
      <Check
        size={size * 0.6}
        strokeWidth={3}
        className={cn('transition-transform duration-200', checked ? 'scale-100' : 'scale-50')}
      />
    </button>
  );
}
