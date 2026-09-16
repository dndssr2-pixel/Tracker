import { useRef, useState } from 'react';
import { GripVertical, MoreVertical, Pencil, Trash2, Check } from 'lucide-react';
import type { Task, TaskCategory } from '@/types';
import { CheckCircle } from '@/components/Progress';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';

type TaskItemProps = {
  task: Task;
  category: TaskCategory | null;
  completed: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragging: boolean;
  dragOffset: number;
  bindDragHandle: (id: string) => object;
};

export function TaskItem({
  task,
  category,
  completed,
  onToggle,
  onEdit,
  onDelete,
  isDragging,
  dragOffset,
  bindDragHandle,
}: TaskItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const CatIcon = category ? getIcon(category.icon) : null;

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 transition-all duration-200 dark:border-gray-700 dark:bg-gray-800',
        isDragging && 'z-10 opacity-90 shadow-lg',
        completed
          ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-900/10'
          : 'hover:border-gray-200 dark:hover:border-gray-600'
      )}
      style={isDragging ? { transform: `translateY(${dragOffset}px)` } : undefined}
    >
      <button
        {...bindDragHandle(task.id)}
        className="flex-shrink-0 cursor-grab touch-none text-gray-300 hover:text-gray-400 active:cursor-grabbing dark:text-gray-600 dark:hover:text-gray-500"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      <CheckCircle checked={completed} onToggle={onToggle} size={28} />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium leading-tight transition-all',
            completed
              ? 'text-gray-400 line-through dark:text-gray-500'
              : 'text-gray-800 dark:text-gray-100'
          )}
        >
          {task.title}
        </p>
        {category && CatIcon && (
          <div className="mt-1 flex items-center gap-1.5">
            <span className={cn('text-emerald-600 dark:text-emerald-400')}>
              <CatIcon size={11} />
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              {category.name}
            </span>
          </div>
        )}
      </div>

      <div ref={menuRef} className="relative flex-shrink-0">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          aria-label="Task options"
        >
          <MoreVertical size={18} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type EditTaskModalProps = {
  task: Task | null;
  categories: TaskCategory[];
  onSave: (id: string, title: string, categoryId: string | null) => void;
  onClose: () => void;
};

export function EditTaskModal({ task, categories, onSave, onClose }: EditTaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [categoryId, setCategoryId] = useState<string | null>(task?.categoryId ?? null);

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-6 dark:bg-gray-800 sm:rounded-3xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Check size={22} />
          </button>
        </div>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && title.trim()) onSave(task.id, title.trim(), categoryId);
          }}
          placeholder="Task name"
          className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Category</p>
        <div className="mb-2 flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryId(null)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              categoryId === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
            )}
          >
            None
          </button>
          {categories.map((c) => {
            const Icon = getIcon(c.icon);
            return (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  categoryId === c.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                )}
              >
                <Icon size={12} />
                {c.name}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => title.trim() && onSave(task.id, title.trim(), categoryId)}
          disabled={!title.trim()}
          className="mt-4 w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-40"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
