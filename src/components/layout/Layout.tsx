'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  title: string;
  headerActions?: ReactNode;
}

export function Layout({ children, title, headerActions }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafcfb] dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Sidebar />
      <div className={cn('transition-all duration-300', 'lg:ml-64')}>
        <Header title={title}>
          {headerActions}
        </Header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}