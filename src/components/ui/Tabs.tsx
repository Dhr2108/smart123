'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultValue = '', value, onChange, children, className }: TabsProps) {
  const controlled = value !== undefined;
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  const currentTab = controlled ? value : activeTab;

  const handleTabChange = (newValue: string) => {
    if (!controlled) setActiveTab(newValue);
    onChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab: currentTab, setActiveTab: handleTabChange }}>
      <div className={cn('', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-sm',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({ value, children, disabled, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext)!;

  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      aria-controls={`tabs-${value}-panel`}
      id={`tabs-${value}-trigger`}
      data-state={activeTab === value ? 'active' : 'inactive'}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        activeTab === value
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-700 hover:text-gray-900',
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useContext(TabsContext)!;

  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`tabs-${value}-panel`}
      aria-labelledby={`tabs-${value}-trigger`}
      className={cn('mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
    >
      {children}
    </div>
  );
}