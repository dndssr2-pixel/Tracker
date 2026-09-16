import { useRef, useState } from 'react';
import {
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Plus,
  Check,
  AlertTriangle,
} from 'lucide-react';
import type { AppData, TaskCategory } from '@/types';
import { CATEGORY_COLORS } from '@/types';
import { exportData, importData } from '@/utils/storage';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';

type SettingsViewProps = {
  data: AppData;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onImport: (data: AppData) => void;
  onReset: () => void;
  onAddCategory: (name: string, color: string, icon: string) => void;
  onDeleteCategory: (id: string) => void;
};

const ICON_CHOICES = [
  'Heart',
  'Dumbbell',
  'BookOpen',
  'Briefcase',
  'Circle',
  'Droplet',
  'Coffee',
  'Moon',
  'Sun',
  'Brain',
  'Bike',
  'Footprints',
  'Apple',
  'Pencil',
  'Music',
  'Code',
];

export function SettingsView({
  data,
  theme,
  onToggleTheme,
  onImport,
  onReset,
  onAddCategory,
  onDeleteCategory,
}: SettingsViewProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showReset, setShowReset] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('emerald');
  const [newCatIcon, setNewCatIcon] = useState('Circle');
  const [importError, setImportError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = importData(reader.result as string);
        onImport(parsed);
      } catch {
        setImportError('Could not read this file. Make sure it is a valid backup JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddCat = () => {
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim(), newCatColor, newCatIcon);
    setNewCatName('');
    setNewCatColor('emerald');
    setNewCatIcon('Circle');
    setShowAddCat(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6">
      {/* Appearance */}
      <Section title="Appearance">
        <Row
          icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          title="Theme"
          subtitle={theme === 'dark' ? 'Dark mode' : 'Light mode'}
          action={
            <button
              onClick={onToggleTheme}
              className="relative h-7 w-12 rounded-full bg-gray-200 transition-colors dark:bg-gray-600"
            >
              <span
                className={cn(
                  'absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-all',
                  theme === 'dark' ? 'left-[22px]' : 'left-0.5'
                )}
              >
                {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
              </span>
            </button>
          }
        />
      </Section>

      {/* Data */}
      <Section title="Data & Backup">
        <Row
          icon={<Download size={18} />}
          title="Export Backup"
          subtitle="Download all data as a JSON file"
          action={
            <button
              onClick={() => exportData(data)}
              className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
            >
              Export
            </button>
          }
        />
        <Row
          icon={<Upload size={18} />}
          title="Import Backup"
          subtitle="Restore from a JSON file"
          action={
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
            >
              Import
            </button>
          }
        />
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="hidden"
        />
        {importError && (
          <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle size={14} />
            {importError}
          </div>
        )}
        <Row
          icon={<Trash2 size={18} />}
          title="Reset All Data"
          subtitle="Delete all tasks and history"
          action={
            <button
              onClick={() => setShowReset(true)}
              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
            >
              Reset
            </button>
          }
          danger
        />
      </Section>

      {/* Categories */}
      <Section title="Categories">
        <div className="space-y-1 p-2">
          {data.categories.map((cat) => (
            <CategoryRow
              key={cat.id}
              category={cat}
              taskCount={data.tasks.filter((t) => t.categoryId === cat.id).length}
              onDelete={() => onDeleteCategory(cat.id)}
            />
          ))}
        </div>
        <button
          onClick={() => setShowAddCat(true)}
          className="flex w-full items-center justify-center gap-2 border-t border-gray-100 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-gray-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          <Plus size={16} /> Add Category
        </button>
      </Section>

      {/* About */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">HabitFlow v1.0</p>
        <p className="mt-1 text-xs text-gray-300 dark:text-gray-600">
          Your data is stored locally on this device.
        </p>
      </div>

      {/* Reset confirm */}
      {showReset && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setShowReset(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <AlertTriangle className="text-red-600" size={28} />
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-bold text-gray-900 dark:text-white">
              Delete everything?
            </h3>
            <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
              All tasks, completions, and categories will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReset();
                  setShowReset(false);
                }}
                className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add category */}
      {showAddCat && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
          onClick={() => setShowAddCat(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-white p-6 dark:bg-gray-800 sm:rounded-3xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">New Category</h2>
              <button
                onClick={() => setShowAddCat(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Check size={22} />
              </button>
            </div>
            <input
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Category name"
              className="mb-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Color</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewCatColor(color)}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-all',
                    `bg-${color}-500`,
                    newCatColor === color
                      ? 'border-gray-900 ring-2 ring-blue-300 dark:border-white'
                      : 'border-transparent'
                  )}
                />
              ))}
            </div>
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Icon</p>
            <div className="mb-6 grid grid-cols-8 gap-2">
              {ICON_CHOICES.map((iconName) => {
                const Icon = getIcon(iconName);
                return (
                  <button
                    key={iconName}
                    onClick={() => setNewCatIcon(iconName)}
                    className={cn(
                      'flex h-9 items-center justify-center rounded-lg border transition-all',
                      newCatIcon === iconName
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'border-gray-200 text-gray-400 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    )}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleAddCat}
              disabled={!newCatName.trim()}
              className="w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-40"
            >
              Add Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h3>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}

function Row({
  icon,
  title,
  subtitle,
  action,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 last:border-b-0 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'text-gray-400',
            danger && 'text-red-400'
          )}
        >
          {icon}
        </span>
        <div>
          <p
            className={cn(
              'text-sm font-medium',
              danger ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
            )}
          >
            {title}
          </p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function CategoryRow({
  category,
  taskCount,
  onDelete,
}: {
  category: TaskCategory;
  taskCount: number;
  onDelete: () => void;
}) {
  const Icon = getIcon(category.icon);
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <div className="flex items-center gap-3">
        <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', `bg-${category.color}-100`, `text-${category.color}-600`, `dark:bg-${category.color}-900/30`, `dark:text-${category.color}-400`)}>
          <Icon size={16} />
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {category.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          {taskCount}
        </span>
        <button
          onClick={onDelete}
          className="rounded-lg p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 dark:text-gray-600 dark:hover:bg-red-900/20"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
