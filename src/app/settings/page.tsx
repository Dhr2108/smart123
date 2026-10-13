'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { User, Bell, Shield, Palette, Database, Moon, Sun, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'appearance' | 'system'>('profile');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Layout title="Settings">
      <div className="max-w-4xl">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as 'profile' | 'notifications' | 'security' | 'appearance' | 'system')}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
            <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
            <TabsTrigger value="appearance"><Palette className="h-4 w-4 mr-2" />Appearance</TabsTrigger>
            <TabsTrigger value="system"><Database className="h-4 w-4 mr-2" />System</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600">DA</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Dr. Admin</h3>
                      <p className="text-gray-500">Administrator</p>
                      <Button variant="outline" className="mt-2"><Save className="h-4 w-4 mr-2" />Change Avatar</Button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Full Name" defaultValue="Dr. Admin" />
                    <Input label="Email" type="email" defaultValue="admin@hospital.com" />
                    <Input label="Phone" type="tel" defaultValue="+1-555-0001" />
                    <Input label="Department" defaultValue="Administration" />
                  </div>
                  <Input label="Address" defaultValue="123 Hospital Ave, Medical City, MC 10001" className="sm:col-span-2" />
                  <div className="flex justify-end">
                    <Button type="submit"><Save className="h-4 w-4 mr-2" />Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {['Email Notifications', 'SMS Notifications', 'Push Notifications', 'Appointment Reminders', 'Lab Results', 'Billing Alerts', 'Low Stock Alerts', 'System Updates'].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item}</p>
                      <p className="text-sm text-gray-500">Receive {item.toLowerCase()}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Change Password</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Current Password" type="password" />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm New Password" type="password" />
                  </div>
                  <Button className="mt-4"><Save className="h-4 w-4 mr-2" />Update Password</Button>
                </div>
                <hr />
                <div>
                  <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                  <p className="text-gray-500 mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline"><Shield className="h-4 w-4 mr-2" />Enable 2FA</Button>
                </div>
                <hr />
                <div>
                  <h4 className="font-medium mb-4">Active Sessions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-gray-500">Chrome on Windows • 2 minutes ago</p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-gray-500">iOS • 1 day ago</p>
                      </div>
                      <Button variant="ghost" size="sm">Revoke</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Theme</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={cn('relative cursor-pointer border-2 rounded-lg p-4 transition-colors', darkMode ? 'border-gray-200' : 'border-blue-500 bg-blue-50')}>
                      <input type="radio" name="theme" checked={!darkMode} onChange={() => setDarkMode(false)} className="sr-only" />
                      <div className="flex items-center gap-4">
                        <Sun className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="font-medium">Light Mode</p>
                          <p className="text-sm text-gray-500">Clean and bright interface</p>
                        </div>
                      </div>
                    </label>
                    <label className={cn('relative cursor-pointer border-2 rounded-lg p-4 transition-colors', darkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200')}>
                      <input type="radio" name="theme" checked={darkMode} onChange={() => setDarkMode(true)} className="sr-only" />
                      <div className="flex items-center gap-4">
                        <Moon className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-gray-500">Easy on the eyes in low light</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Sidebar</h4>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span>Collapse sidebar by default</span>
                  </label>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Density</h4>
                  <Select defaultValue="comfortable" options={[
                    { value: 'compact', label: 'Compact' },
                    { value: 'comfortable', label: 'Comfortable' },
                    { value: 'spacious', label: 'Spacious' },
                  ]} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">General</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Hospital Name" defaultValue="Smart Hospital Management System" />
                    <Input label="Hospital Code" defaultValue="SHMS-001" />
                    <Input label="Timezone" defaultValue="America/New_York" />
                    <Select defaultValue="USD" options={[{ value: 'USD', label: 'USD ($)' }, { value: 'EUR', label: 'EUR (€)' }, { value: 'GBP', label: 'GBP (£)' }]} />
                  </div>
                </div>
                <hr />
                <div>
                  <h4 className="font-medium mb-4">Backup & Restore</h4>
                  <div className="flex gap-3">
                    <Button variant="outline"><Database className="h-4 w-4 mr-2" />Create Backup</Button>
                    <Button variant="outline"><Database className="h-4 w-4 mr-2" />Restore Backup</Button>
                  </div>
                </div>
                <hr />
                <div>
                  <h4 className="font-medium mb-4">Maintenance</h4>
                  <div className="flex gap-3">
                    <Button variant="outline">Clear Cache</Button>
                    <Button variant="outline">Optimize Database</Button>
                    <Button variant="destructive">Reset System</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}