import { useState, useEffect, useCallback } from 'react';
import { TodayHeader } from '@/components/TodayHeader';
import { TaskList } from '@/components/TaskList';
import { AddTaskModal } from '@/components/AddTaskModal';
import { StatsView } from '@/components/StatsView';
import { SettingsView } from '@/components/SettingsView';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { BottomNav, type Tab } from '@/components/BottomNav';
import { EditTaskModal } from '@/components/TaskItem';
import { useTheme } from '@/hooks/useTheme';
import { useHabits } from '@/hooks/useHabits';
import { formatDateLabel } from '@/utils/date';
import { calculateCurrentStreak } from '@/utils/streaks';
import type { Task } from '@/types';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
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
  } = useHabits();

  const [tab, setTab] = useState<Tab>('today');
  const [showAdd, setShowAdd] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevAllDone, setPrevAllDone] = useState(false);

  const completedCount = activeTasks.filter((t) =>
    isCompleted(t.id, today)
  ).length;
  const totalCount = activeTasks.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  const currentStreak = calculateCurrentStreak(activeTasks, completionsMap);

  // Celebrate when all tasks get completed
  useEffect(() => {
    if (allDone && !prevAllDone) {
      setShowCelebration(true);
    }
    setPrevAllDone(allDone);
  }, [allDone, prevAllDone]);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW registration is best-effort
      });
    }
  }, []);

  const handleEditSave = useCallback(
    (id: string, title: string, categoryId: string | null) => {
      updateTask(id, { title, categoryId });
      setEditingTask(null);
    },
    [updateTask]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {tab === 'today' && (
        <>
          <TodayHeader
            dateLabel={formatDateLabel(today)}
            completed={completedCount}
            total={totalCount}
            currentStreak={currentStreak}
            theme={theme}
            onToggleTheme={toggleTheme}
            onAddTask={() => setShowAdd(true)}
          />
          <TaskList
            tasks={activeTasks}
            categories={data.categories}
            todayKey={today}
            isCompleted={isCompleted}
            onToggle={toggleCompletion}
            onReorder={reorderTasks}
            onEditTask={setEditingTask}
            onDeleteTask={deleteTask}
          />
        </>
      )}

      {tab === 'stats' && (
        <StatsView
          tasks={data.tasks}
          categories={data.categories}
          completions={data.completions}
        />
      )}

      {tab === 'settings' && (
        <SettingsView
          data={data}
          theme={theme}
          onToggleTheme={toggleTheme}
          onImport={importAppData}
          onReset={resetAll}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
        />
      )}

      <BottomNav active={tab} onChange={setTab} />

      {showAdd && (
        <AddTaskModal
          categories={data.categories}
          onAdd={addTask}
          onClose={() => setShowAdd(false)}
        />
      )}

      <EditTaskModal
        task={editingTask}
        categories={data.categories}
        onSave={handleEditSave}
        onClose={() => setEditingTask(null)}
      />

      <CelebrationOverlay show={showCelebration} onClose={() => setShowCelebration(false)} />
    </div>
  );
}
