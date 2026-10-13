'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Bell, User, LogOut, Menu, Sun, Moon } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title: string;
  children?: ReactNode;
}

export function Header({ title, children }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left side - Mobile menu button and title */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Center - custom children */}
        <div className="flex-1 lg:flex lg:justify-center">{children}</div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={cn(
                'relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors',
                notificationsOpen && 'bg-gray-100'
              )}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-white shadow-lg py-1">
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="text-sm text-blue-600 hover:underline">Mark all read</button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={cn(
                        'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                        !notification.read && 'bg-blue-50'
                      )}
                    >
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-500">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </button>
                  ))}
                </div>
                <div className="border-t p-3 text-center">
                  <Link href="/notifications" className="text-sm text-blue-600 hover:underline">
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
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100"
              aria-label="User menu"
              aria-expanded={userMenuOpen}
            >
              <Avatar name="Dr. Admin" size="sm" />
              <span className="hidden sm:block text-sm font-medium text-gray-700">Dr. Admin</span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-lg py-1">
                <div className="px-4 py-3 border-b">
                  <p className="font-medium text-sm">Dr. Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Sun className="h-4 w-4" />
                  Settings
                </Link>
                <hr className="my-1 border-gray-200" />
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
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