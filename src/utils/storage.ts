import type { AppData, Task, TaskCategory, CompletionLog } from '@/types';
import { DEFAULT_CATEGORIES } from '@/types';

const STORAGE_KEY = 'habitflow-data-v1';

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        tasks: [],
        categories: DEFAULT_CATEGORIES,
        completions: [],
        version: 1,
        exportedAt: new Date().toISOString(),
      };
    }
    const parsed = JSON.parse(raw) as AppData;
    // Merge defaults if categories missing
    if (!parsed.categories || parsed.categories.length === 0) {
      parsed.categories = DEFAULT_CATEGORIES;
    }
    if (!parsed.tasks) parsed.tasks = [];
    if (!parsed.completions) parsed.completions = [];
    return parsed;
  } catch {
    return {
      tasks: [],
      categories: DEFAULT_CATEGORIES,
      completions: [],
      version: 1,
      exportedAt: new Date().toISOString(),
    };
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
}

export function exportData(data: AppData): void {
  const exportPayload: AppData = {
    ...data,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(jsonText: string): AppData {
  const parsed = JSON.parse(jsonText) as AppData;
  if (!parsed.tasks || !Array.isArray(parsed.tasks)) throw new Error('Invalid file: missing tasks');
  if (!parsed.completions || !Array.isArray(parsed.completions))
    throw new Error('Invalid file: missing completions');
  if (!parsed.categories || !Array.isArray(parsed.categories))
    parsed.categories = DEFAULT_CATEGORIES;
  return parsed;
}

export function genId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

