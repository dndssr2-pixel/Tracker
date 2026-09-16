import { Flame, Plus, Sun, Moon } from 'lucide-react';
import { ProgressBar } from '@/components/Progress';
import { cn } from '@/utils/cn';

type TodayHeaderProps = {
  dateLabel: string;
  completed: number;
  total: number;
  currentStreak: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onAddTask: () => void;
};

export function TodayHeader({
  dateLabel,
  completed,
  total,
  currentStreak,
  theme,
  onToggleTheme,
  onAddTask,
}: TodayHeaderProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone = completed > 0 && completed === total;

  return (
    <div className="px-4 pt-6">
      <div className="mx-auto max-w-2xl">
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-blue-500 dark:text-blue-400">
              {dateLabel}
            </p>
            <h1 className="mt-0.5 text-2xl font-bold text-gray-900 dark:text-white">
              Daily Habits
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={onAddTask}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm shadow-blue-500/30 transition-colors hover:bg-blue-600 active:scale-95"
              aria-label="Add task"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Progress card */}
        <div
          className={cn(
            'mb-2 rounded-3xl p-5 transition-all duration-500',
            allDone
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
              : 'bg-gradient-to-br from-blue-500 to-blue-600'
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-white" />
              <span className="text-sm font-semibold text-white">
                {currentStreak} day{currentStreak !== 1 ? 's' : ''} streak
              </span>
            </div>
            <span className="text-2xl font-bold text-white">{pct}%</span>
          </div>
          <ProgressBar
            completed={completed}
            total={total}
            className="bg-white/20 dark:bg-white/20"
          />
          <p className="mt-3 text-xs font-medium text-white/80">
            {allDone
              ? 'All tasks complete! Amazing work!'
              : total === 0
                ? 'Add your first task to get started'
                : `${completed} of ${total} tasks completed`}
          </p>
        </div>
      </div>
    </div>
  );
}
