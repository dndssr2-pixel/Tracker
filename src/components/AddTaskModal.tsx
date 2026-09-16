import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { TaskCategory } from '@/types';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';

type AddTaskModalProps = {
  categories: TaskCategory[];
  onAdd: (title: string, categoryId: string | null) => void;
  onClose: () => void;
};

export function AddTaskModal({ categories, onAdd, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), categoryId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-6 dark:bg-gray-800 sm:rounded-3xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">New Task</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          placeholder="e.g. Morning workout"
          className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
        />
        <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Category</p>
        <div className="mb-6 flex flex-wrap gap-2">
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
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-40"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>
    </div>
  );
}
