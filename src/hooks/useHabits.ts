import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AppData, Task, TaskCategory, CompletionLog } from '@/types';
import { DEFAULT_CATEGORIES } from '@/types';
import { loadData, saveData, genId } from '@/utils/storage';
import { buildCompletionMap, type CompletionMap } from '@/utils/streaks';
import { todayKey } from '@/utils/date';

export function useHabits() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [today] = useState(todayKey());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced save
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveData(data), 150);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data]);

  // Cross-tab / cross-window sync
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'habitflow-data-v1' && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Midnight rollover detection
  useEffect(() => {
    const check = () => {
      const newToday = todayKey();
      if (newToday !== today) {
        window.location.reload();
      }
    };
    const interval = setInterval(check, 30_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', check);
    };
  }, [today]);

  const completionsMap: CompletionMap = useMemo(
    () => buildCompletionMap(data.completions),
    [data.completions]
  );

  const activeTasks = useMemo(
    () => data.tasks.filter((t) => !t.archived).sort((a, b) => a.order - b.order),
    [data.tasks]
  );

  const isCompleted = useCallback(
    (taskId: string, dateKey: string) =>
      completionsMap.get(dateKey)?.has(taskId) ?? false,
    [completionsMap]
  );

  const toggleCompletion = useCallback((taskId: string, dateKey: string) => {
    setData((prev) => {
      const existing = prev.completions.find(
        (c) => c.date === dateKey && c.taskId === taskId
      );
      if (existing) {
        return {
          ...prev,
          completions: prev.completions.filter(
            (c) => !(c.date === dateKey && c.taskId === taskId)
          ),
        };
      }
      const newComp: CompletionLog = {
        date: dateKey,
        taskId,
        completedAt: new Date().toISOString(),
      };
      return { ...prev, completions: [...prev.completions, newComp] };
    });
  }, []);

  const addTask = useCallback((title: string, categoryId: string | null) => {
    setData((prev) => {
      const maxOrder = prev.tasks.reduce((mx, t) => Math.max(mx, t.order), 0);
      const task: Task = {
        id: genId(),
        title: title.trim(),
        categoryId,
        order: maxOrder + 1,
        createdAt: new Date().toISOString(),
        archived: false,
      };
      return { ...prev, tasks: [...prev.tasks, task] };
    });
  }, []);

  const updateTask = useCallback(
    (id: string, updates: Partial<Pick<Task, 'title' | 'categoryId' | 'archived'>>) => {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      }));
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
      completions: prev.completions.filter((c) => c.taskId !== id),
    }));
  }, []);

  const reorderTasks = useCallback((orderedIds: string[]) => {
    setData((prev) => {
      const orderMap = new Map(orderedIds.map((id, i) => [id, i]));
      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          orderMap.has(t.id) ? { ...t, order: orderMap.get(t.id)! } : t
        ),
      };
    });
  }, []);

  const addCategory = useCallback(
    (name: string, color: string, icon: string) => {
      const cat: TaskCategory = { id: genId(), name, color, icon };
      setData((prev) => ({ ...prev, categories: [...prev.categories, cat] }));
      return cat.id;
    },
    []
  );

  const deleteCategory = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
      tasks: prev.tasks.map((t) =>
        t.categoryId === id ? { ...t, categoryId: null } : t
      ),
    }));
  }, []);

  const importAppData = useCallback((newData: AppData) => {
    setData(newData);
  }, []);

  const resetAll = useCallback(() => {
    setData({
      tasks: [],
      categories: DEFAULT_CATEGORIES,
      completions: [],
      version: 1,
      exportedAt: new Date().toISOString(),
    });
  }, []);

  return {
    data,
    today,
    activeTasks,
    completionsMap,
    isCompleted,
    toggleCompletion,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    addCategory,
    deleteCategory,
    importAppData,
    resetAll,
  };
}
