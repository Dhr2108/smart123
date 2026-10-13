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
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
};

export function StatsCard({ title, value, icon, trend, color = 'blue', className }: StatsCardProps) {
  return (
    <div className={cn('rounded-lg border bg-white p-6 shadow-sm', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.positive !== false ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.positive !== false ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-lg p-3', iconColors[color])}>{icon}</div>
      </div>
    </div>
  );
}