import { useRef } from 'react';
import { GripVertical, Inbox } from 'lucide-react';
import type { Task, TaskCategory } from '@/types';
import { TaskItem } from '@/components/TaskItem';
import { useDragReorder } from '@/hooks/useDragReorder';

type TaskListProps = {
  tasks: Task[];
  categories: TaskCategory[];
  todayKey: string;
  isCompleted: (taskId: string, dateKey: string) => boolean;
  onToggle: (taskId: string, dateKey: string) => void;
  onReorder: (orderedIds: string[]) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
};

export function TaskList({
  tasks,
  categories,
  todayKey,
  isCompleted,
  onToggle,
  onReorder,
  onEditTask,
  onDeleteTask,
}: TaskListProps) {
  const { orderedItems, dragId, dragOffset, bindDragHandle } = useDragReorder(tasks, onReorder);
  const containerRef = useRef<HTMLDivElement>(null);

  const catMap = new Map(categories.map((c) => [c.id, c]));

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Inbox size={36} className="text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-gray-700 dark:text-gray-300">
          No tasks yet
        </h3>
        <p className="text-sm text-gray-400">
          Tap the + button above to add your first daily habit.
        </p>
      </div>
    );
  }

  // Sort: incomplete first, then complete
  const sorted = [...orderedItems].sort((a, b) => {
    const ac = isCompleted(a.id, todayKey) ? 1 : 0;
    const bc = isCompleted(b.id, todayKey) ? 1 : 0;
    if (ac !== bc) return ac - bc;
    return a.order - b.order;
  });

  return (
    <div ref={containerRef} className="mx-auto max-w-2xl space-y-2 px-4 pb-28 pt-4">
      {sorted.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          category={task.categoryId ? catMap.get(task.categoryId) ?? null : null}
          completed={isCompleted(task.id, todayKey)}
          onToggle={() => onToggle(task.id, todayKey)}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}
          isDragging={dragId === task.id}
          dragOffset={dragId === task.id ? dragOffset : 0}
          bindDragHandle={bindDragHandle}
        />
      ))}
      <div className="flex items-center justify-center gap-1.5 pt-4 text-xs text-gray-300 dark:text-gray-600">
        <GripVertical size={12} />
        Drag to reorder
      </div>
    </div>
  );
}
