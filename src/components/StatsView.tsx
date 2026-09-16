import { Flame, TrendingUp, Target, Calendar, Trophy } from 'lucide-react';
import type { Task, TaskCategory, CompletionLog } from '@/types';
import {
  calculateCurrentStreak,
  calculateBestStreak,
  getLastNDaysRates,
  getTotalCompletions,
  buildCompletionMap,
} from '@/utils/streaks';
import { formatDateShort, getDayOfWeek } from '@/utils/date';
import { CircularProgress } from '@/components/Progress';
import { cn } from '@/utils/cn';

type StatsViewProps = {
  tasks: Task[];
  categories: TaskCategory[];
  completions: CompletionLog[];
};

export function StatsView({ tasks, categories, completions }: StatsViewProps) {
  const compMap = buildCompletionMap(completions);
  const activeTasks = tasks.filter((t) => !t.archived);
  const currentStreak = calculateCurrentStreak(activeTasks, compMap);
  const bestStreak = calculateBestStreak(activeTasks, compMap);
  const totalCompletions = getTotalCompletions(completions);

  const last30 = getLastNDaysRates(activeTasks, compMap, 30);
  const last7 = last30.slice(-7);
  const avg7 =
    last7.length > 0 ? last7.reduce((s, d) => s + d.rate, 0) / last7.length : 0;

  const todayRate = last7[last7.length - 1]?.rate ?? 0;

  // Category breakdown
  const catStats = categories.map((c) => {
    const catTasks = activeTasks.filter((t) => t.categoryId === c.id);
    const catComps = completions.filter((c2) =>
      catTasks.some((t) => t.id === c2.taskId)
    ).length;
    return { category: c, taskCount: catTasks.length, completions: catComps };
  });

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6">
      {/* Hero stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<Flame size={20} className="text-orange-500" />}
          label="Current"
          value={`${currentStreak}`}
          unit="days"
          accent="orange"
        />
        <StatCard
          icon={<Trophy size={20} className="text-amber-500" />}
          label="Best"
          value={`${bestStreak}`}
          unit="days"
          accent="amber"
        />
        <StatCard
          icon={<Target size={20} className="text-blue-500" />}
          label="Done"
          value={`${totalCompletions}`}
          unit="total"
          accent="blue"
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-emerald-500" />}
          label="7-day avg"
          value={`${Math.round(avg7 * 100)}`}
          unit="%"
          accent="emerald"
        />
      </div>

      {/* Today's progress ring */}
      <div className="mb-6 flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">Today's Progress</p>
        <CircularProgress value={todayRate} size={140} strokeWidth={12}>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.round(todayRate * 100)}%
            </p>
            <p className="text-xs text-gray-400">
              {last7[last7.length - 1]?.completed ?? 0}/{last7[last7.length - 1]?.total ?? 0}
            </p>
          </div>
        </CircularProgress>
      </div>

      {/* 7-day bar chart */}
      <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last 7 Days</h3>
        </div>
        <div className="flex items-end justify-between gap-2" style={{ height: 140 }}>
          {last7.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end justify-center">
                <div
                  className={cn(
                    'w-full max-w-[36px] rounded-lg transition-all duration-500',
                    d.rate >= 1
                      ? 'bg-emerald-500'
                      : d.rate > 0
                        ? 'bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                  )}
                  style={{ height: `${Math.max(d.rate * 100, 4)}%` }}
                  title={`${d.completed}/${d.total}`}
                />
              </div>
              <span className="text-[10px] text-gray-400">{getDayOfWeek(d.date)[0]}</span>
              <span className="text-[9px] text-gray-300 dark:text-gray-600">{formatDateShort(d.date)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      {catStats.filter((c) => c.taskCount > 0).length > 0 && (
        <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            By Category
          </h3>
          <div className="space-y-3">
            {catStats
              .filter((c) => c.taskCount > 0)
              .map((c) => (
                <div key={c.category.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {c.category.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {c.completions} completions
                    </span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      {c.taskCount} tasks
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2">{icon}</div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-[11px] text-gray-400">{unit}</p>
      <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
