import type { Task, CompletionLog } from '@/types';
import { todayKey, parseDateKey, addDays, toDateKey } from './date';

export type CompletionMap = Map<string, Set<string>>; // dateKey -> Set(taskId)

export function buildCompletionMap(completions: CompletionLog[]): CompletionMap {
  const map: CompletionMap = new Map();
  for (const c of completions) {
    let set = map.get(c.date);
    if (!set) {
      set = new Set();
      map.set(c.date, set);
    }
    set.add(c.taskId);
  }
  return map;
}

export function isTaskCompletedOnDate(
  completions: CompletionMap,
  taskId: string,
  dateKey: string
): boolean {
  return completions.get(dateKey)?.has(taskId) ?? false;
}

// Current streak: consecutive days (ending today or yesterday) where ALL active tasks were completed
export function calculateCurrentStreak(
  activeTasks: Task[],
  completions: CompletionMap
): number {
  if (activeTasks.length === 0) return 0;

  let streak = 0;
  let date = new Date();

  // If today isn't fully complete, start from yesterday (streak not yet broken)
  const today = todayKey();
  const todayComplete = isAllTasksCompletedOnDate(activeTasks, completions, today);
  if (!todayComplete) {
    date = addDays(date, -1);
  }

  while (true) {
    const key = toDateKey(date);
    if (isAllTasksCompletedOnDate(activeTasks, completions, key)) {
      streak++;
      date = addDays(date, -1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateBestStreak(activeTasks: Task[], completions: CompletionMap): number {
  if (activeTasks.length === 0) return 0;

  // Collect all dates that have completions, sort them
  const allDates = Array.from(completions.keys()).sort();
  if (allDates.length === 0) return 0;

  let best = 0;
  let current = 0;
  let prevDate: Date | null = null;

  for (const dateKey of allDates) {
    const complete = isAllTasksCompletedOnDate(activeTasks, completions, dateKey);
    const d = parseDateKey(dateKey);

    if (complete) {
      if (prevDate && isConsecutiveDay(prevDate, d)) {
        current++;
      } else {
        current = 1;
      }
      if (current > best) best = current;
    } else {
      current = 0;
    }
    prevDate = d;
  }

  return best;
}

function isConsecutiveDay(prev: Date, curr: Date): boolean {
  const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
  return diff === 1;
}

export function isAllTasksCompletedOnDate(
  tasks: Task[],
  completions: CompletionMap,
  dateKey: string
): boolean {
  if (tasks.length === 0) return false;
  const completedSet = completions.get(dateKey);
  if (!completedSet) return false;
  return tasks.every((t) => completedSet.has(t.id));
}

export function getDayCompletionRate(
  tasks: Task[],
  completions: CompletionMap,
  dateKey: string
): number {
  if (tasks.length === 0) return 0;
  const completedSet = completions.get(dateKey);
  if (!completedSet) return 0;
  const done = tasks.filter((t) => completedSet.has(t.id)).length;
  return done / tasks.length;
}

// Get completion rate for last N days (oldest first)
export function getLastNDaysRates(
  tasks: Task[],
  completions: CompletionMap,
  n: number
): { date: string; rate: number; completed: number; total: number }[] {
  const result: { date: string; rate: number; completed: number; total: number }[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = addDays(today, -i);
    const key = toDateKey(d);
    const completedSet = completions.get(key);
    const done = completedSet ? tasks.filter((t) => completedSet.has(t.id)).length : 0;
    result.push({
      date: key,
      completed: done,
      total: tasks.length,
      rate: tasks.length > 0 ? done / tasks.length : 0,
    });
  }
  return result;
}

export function getTotalCompletions(completions: CompletionLog[]): number {
  return completions.length;
}
