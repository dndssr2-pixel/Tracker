// Get YYYY-MM-DD in local time (not UTC)
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// Returns array of last N day keys, oldest first
export function lastNDays(n: number, endDate: Date = new Date()): string[] {
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    result.push(toDateKey(addDays(endDate, -i)));
  }
  return result;
}

export function formatDateLabel(key: string): string {
  const d = parseDateKey(key);
  const today = todayKey();
  const yesterday = toDateKey(addDays(new Date(), -1));

  if (key === today) return 'Today';
  if (key === yesterday) return 'Yesterday';

  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateShort(key: string): string {
  const d = parseDateKey(key);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function getDayOfWeek(key: string): string {
  const d = parseDateKey(key);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}
