'use client';

import React, { isValidElement, cloneElement, Children } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const initials = name ? getInitials(name) : '?';

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200/60 dark:border-emerald-800/60',
        sizes[size],
        className
      )}
      aria-label={alt || name}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-semibold text-emerald-800 dark:text-emerald-300">
          {initials}
        </span>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  children: React.ReactNode;
  className?: string;
  max?: number;
}

export function AvatarGroup({ children, className, max = 5 }: AvatarGroupProps) {
  const kids = Children.toArray(children).filter(isValidElement) as React.ReactElement<AvatarProps>[];
  const visible = kids.slice(0, max);
  const remaining = kids.length - max;

  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((child, index) =>
        cloneElement<AvatarProps>(child, {
          key: child.key || index,
          className: cn('ring-2 ring-white', child.props.className),
        })
      )}
      {remaining > 0 && (
        <div className={cn('flex items-center justify-center rounded-full bg-gray-100', sizes.md)}>
          <span className="text-xs font-medium text-gray-600">+{remaining}</span>
        </div>
      )}
    </div>
  );
}