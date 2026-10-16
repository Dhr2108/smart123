'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  HeartPulse,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Triage', href: '/triage', icon: Sparkles, badge: 'AI' },
  { name: 'Patients', href: '/patients', icon: Users, badge: '12' },
  { name: 'Doctors', href: '/doctors', icon: UserPlus, badge: '5' },
  { name: 'Appointments', href: '/appointments', icon: Calendar, badge: '24' },
  { name: 'Billing', href: '/billing', icon: FileText, badge: '18' },
  { name: 'Pharmacy', href: '/pharmacy', icon: Pill, badge: '7' },
  { name: 'Lab & Radiology', href: '/lab', icon: FlaskConical, badge: '12' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-gray-200 dark:border-emerald-900/30 bg-white dark:bg-black transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn('flex h-16 items-center justify-between border-b border-gray-100 dark:border-emerald-900/30 px-4', collapsed && 'justify-center')}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2" aria-label="Hospital Management System">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-500 shadow-sm shadow-emerald-500/20">
                <HeartPulse className="h-5 w-5 text-white dark:text-black" />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">HMS</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="flex items-center justify-center" aria-label="Hospital Management System">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 dark:bg-emerald-500 shadow-sm shadow-emerald-500/20">
                <HeartPulse className="h-5 w-5 text-white dark:text-black" />
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors',
              collapsed && 'ml-auto'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-400 font-semibold border-r-2 border-emerald-600 dark:border-emerald-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300',
                  collapsed && 'justify-center px-2'
                )}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {!collapsed && (
                  <>
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/60">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn('border-t border-gray-100 dark:border-emerald-900/30 p-4', collapsed && 'hidden')}>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}