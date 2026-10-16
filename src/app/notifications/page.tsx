'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Bell, Check, X } from 'lucide-react';

const mockNotifications = [
  { id: 1, title: 'New Appointment', message: 'John Smith booked for 2:00 PM', time: '5 min ago', read: false, type: 'appointment', priority: 'high' },
  { id: 2, title: 'Lab Results Ready', message: 'CBC results for Sarah Johnson', time: '1 hour ago', read: false, type: 'lab', priority: 'high' },
  { id: 3, title: 'Low Stock Alert', message: 'Amoxicillin 500mg below reorder level', time: '3 hours ago', read: true, type: 'pharmacy', priority: 'medium' },
  { id: 4, title: 'Appointment Cancelled', message: 'Patient PAT-003 cancelled appointment APT-012', time: '5 hours ago', read: true, type: 'appointment', priority: 'medium' },
  { id: 5, title: 'Payment Received', message: 'Payment of $250 received from Patient PAT-002', time: '1 day ago', read: true, type: 'billing', priority: 'low' },
  { id: 6, title: 'New Patient Registered', message: 'Emily Davis registered as new patient', time: '2 days ago', read: true, type: 'patient', priority: 'low' },
  { id: 7, title: 'System Maintenance', message: 'Scheduled maintenance on Oct 15, 2:00-4:00 AM', time: '3 days ago', read: true, type: 'system', priority: 'high' },
  { id: 8, title: 'Doctor Schedule Updated', message: 'Dr. Amanda Carter updated availability', time: '4 days ago', read: true, type: 'doctor', priority: 'low' },
  { id: 9, title: 'Insurance Claim Approved', message: 'Claim for Patient PAT-001 approved by MediCover', time: '5 days ago', read: false, type: 'billing', priority: 'medium' },
  { id: 10, title: 'Radiology Report Ready', message: 'Chest X-Ray report for Patient PAT-004', time: '1 week ago', read: true, type: 'lab', priority: 'medium' },
];

const typeLabels: Record<string, string> = {
  appointment: 'Appointments',
  lab: 'Lab & Radiology',
  pharmacy: 'Pharmacy',
  billing: 'Billing',
  patient: 'Patients',
  system: 'System',
  doctor: 'Doctors',
};

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  appointment: Bell,
  lab: Bell,
  pharmacy: Bell,
  billing: Bell,
  patient: Bell,
  system: Bell,
  doctor: Bell,
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && !notification.read) || (activeTab === 'read' && notification.read);
    return matchesSearch && matchesType && matchesTab;
  });

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    // In a real app, this would call an API
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    console.log('Mark all as read');
  };

  const deleteNotification = (id: number) => {
    console.log('Delete notification:', id);
  };

  return (
    <Layout title="Notifications">
      <div className="max-w-4xl">
        {/* Header Stats */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-500">{unreadCount} unread of {mockNotifications.length} total</p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'appointment', label: 'Appointments' },
                  { value: 'lab', label: 'Lab & Radiology' },
                  { value: 'pharmacy', label: 'Pharmacy' },
                  { value: 'billing', label: 'Billing' },
                  { value: 'patient', label: 'Patients' },
                  { value: 'system', label: 'System' },
                  { value: 'doctor', label: 'Doctors' },
                ]}
                className="w-full sm:w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as 'all' | 'unread' | 'read')}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All ({mockNotifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="read">Read ({mockNotifications.length - unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <NotificationsList notifications={filteredNotifications} onMarkAsRead={markAsRead} onDelete={deleteNotification} />
          </TabsContent>
          <TabsContent value="unread">
            <NotificationsList
              notifications={filteredNotifications.filter(n => !n.read)}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </TabsContent>
          <TabsContent value="read">
            <NotificationsList
              notifications={filteredNotifications.filter(n => n.read)}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function NotificationsList({ notifications, onMarkAsRead, onDelete }: {
  notifications: typeof mockNotifications;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
          <p className="text-gray-500 mt-1">You&apos;re all caught up!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Card key={notification.id} className={!notification.read ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40' : ''}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/50">
                  {(() => {
                    const IconComponent = typeIcons[notification.type] || Bell;
                    return <IconComponent className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />;
                  })()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                  <Badge variant={notification.priority === 'high' ? 'danger' : notification.priority === 'medium' ? 'warning' : 'secondary'}>
                    {notification.priority}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {typeLabels[notification.type] || notification.type}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{notification.time}</p>
              </div>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)}>
                    <Check className="h-4 w-4 mr-1" />
                    Mark Read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => onDelete(notification.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Search({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function Select({ value, onChange, options, className }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <select value={value} onChange={onChange} className={`flex h-10 w-full rounded-md border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-black text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className || ''}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-white dark:bg-black">{option.label}</option>
      ))}
    </select>
  );
}