export type TaskCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Task = {
  id: string;
  title: string;
  categoryId: string | null;
  order: number;
  createdAt: string;
  archived: boolean;
};

export type CompletionLog = {
  date: string; // YYYY-MM-DD
  taskId: string;
  completedAt: string;
};

export type AppData = {
  tasks: Task[];
  categories: TaskCategory[];
  completions: CompletionLog[];
  version: number;
  exportedAt: string;
};

export const DEFAULT_CATEGORIES: TaskCategory[] = [
  { id: 'cat-health', name: 'Health', color: 'emerald', icon: 'Heart' },
  { id: 'cat-fitness', name: 'Fitness', color: 'orange', icon: 'Dumbbell' },
  { id: 'cat-mind', name: 'Mind', color: 'sky', icon: 'BookOpen' },
  { id: 'cat-productivity', name: 'Productivity', color: 'violet', icon: 'Briefcase' },
  { id: 'cat-other', name: 'Other', color: 'slate', icon: 'Circle' },
];

export const CATEGORY_COLORS = [
  'emerald',
  'orange',
  'sky',
  'violet',
  'amber',
  'rose',
  'teal',
  'indigo',
  'slate',
];
