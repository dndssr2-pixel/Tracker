import { Home, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';

export type Tab = 'today' | 'stats' | 'settings';

type BottomNavProps = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export function BottomNav({ active, onChange }: BottomNavProps) {
  const tabs: { id: Tab; icon: typeof Home; label: string }[] = [
    { id: 'today', icon: Home, label: 'Today' },
    { id: 'stats', icon: BarChart3, label: 'Stats' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={cn('transition-transform', isActive && 'scale-110')}
              />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
