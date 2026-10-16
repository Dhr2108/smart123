'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-300/70 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/40',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200/60 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/40',
    info: 'bg-teal-50 text-teal-800 border border-teal-200/60 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800/50',
    secondary: 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/60 dark:bg-black dark:text-emerald-400 dark:border-emerald-800/60',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}