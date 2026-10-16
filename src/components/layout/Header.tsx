'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';
import { Bell, User, LogOut, Menu, Sun, Moon } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

interface HeaderProps {
  title: string;
  children?: ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const displayName = user?.name || 'Dr. Admin';
  const displayRole = user?.role || 'Administrator';

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push('/login');
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: setting mounted state to avoid hydration mismatch
    setMounted(true);
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      setDarkMode(JSON.parse(saved));
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  const notifications = [
    { id: 1, title: 'New Appointment', message: 'John Smith booked for 2:00 PM', time: '5 min ago', read: false },
    { id: 2, title: 'Lab Results Ready', message: 'CBC results for Sarah Johnson', time: '1 hour ago', read: false },
    { id: 3, title: 'Low Stock Alert', message: 'Amoxicillin 500mg below reorder level', time: '3 hours ago', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 dark:border-emerald-900/30 bg-white dark:bg-black transition-colors duration-200">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left side - Mobile menu button and title */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
        </div>

        {/* Center - custom children */}
        <div className="flex-1 lg:flex lg:justify-center">{children}</div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-gray-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light (White & Green)' : 'Switch to dark (Black & Green)'}
          >
            {darkMode ? <Sun className="h-5 w-5 text-emerald-400 hover:rotate-45 transition-transform" /> : <Moon className="h-5 w-5 hover:-rotate-12 transition-transform" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={cn(
                'relative p-2 rounded-lg text-gray-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors',
                notificationsOpen && 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300'
              )}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 text-xs text-white dark:text-black font-bold shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-white dark:bg-black shadow-xl py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-emerald-900/30 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">Mark all read</button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={cn(
                        'w-full px-4 py-3 text-left hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-colors border-b border-gray-50 dark:border-emerald-950/40 last:border-0',
                        !notification.read && 'bg-emerald-50/60 dark:bg-emerald-950/60'
                      )}
                    >
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{notification.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">{notification.time}</p>
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-100 dark:border-emerald-900/30 p-3 text-center">
                  <Link href="/notifications" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
              aria-label="User menu"
              aria-expanded={userMenuOpen}
            >
              <Avatar name={displayName} size="sm" />
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">{displayName}</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-white dark:bg-black shadow-xl py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-emerald-900/30">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{displayName}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{displayRole}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Sun className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Settings
                </Link>
                <hr className="my-1 border-gray-100 dark:border-emerald-900/30" />
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}