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
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
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
        'fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn('flex h-16 items-center justify-between border-b px-4', collapsed && 'justify-center')}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2" aria-label="Hospital Management System">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <HeartPulse className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">HMS</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="flex items-center justify-center" aria-label="Hospital Management System">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <HeartPulse className="h-5 w-5 text-white" />
              </div>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors',
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
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
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
                      <span className="ml-auto inline-flex items-center justify-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
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
        <div className={cn('border-t p-4', collapsed && 'hidden')}>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}