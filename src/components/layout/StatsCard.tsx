'use client';

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
  className?: string;
}

const iconColors = {
  blue: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border dark:border-emerald-800/50',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border dark:border-emerald-800/50',
  yellow: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 dark:border dark:border-amber-800/50',
  red: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-400 dark:border dark:border-rose-800/50',
  purple: 'bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-400 dark:border dark:border-teal-800/50',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-400 dark:border dark:border-orange-800/50',
};

export function StatsCard({ title, value, icon, trend, color = 'green', className }: StatsCardProps) {
  return (
    <div className={cn('rounded-xl border border-gray-200 dark:border-emerald-900/40 bg-white dark:bg-black p-6 shadow-sm transition-all duration-200 hover:border-emerald-500/50 dark:hover:border-emerald-500/50', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.positive !== false ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                )}
              >
                {trend.positive !== false ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-xl p-3', iconColors[color])}>{icon}</div>
      </div>
    </div>
  );
}