import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconCache: Record<string, LucideIcon> = {};

export function getIcon(name: string): LucideIcon {
  if (iconCache[name]) return iconCache[name];
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  if (Icon) {
    iconCache[name] = Icon;
    return Icon;
  }
  return Icons.Circle;
}
