'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { User, Mail, Phone, MapPin, Calendar, Save, Camera, Shield, Bell, Key, LogOut } from 'lucide-react';

const mockUser = {
  id: 'USR-001',
  name: 'Dr. Admin',
  email: 'admin@hospital.com',
  phone: '+1-555-0001',
  role: 'Administrator',
  department: 'Administration',
  employeeId: 'EMP-001',
  joinDate: '2023-01-15',
  avatar: null,
  address: '123 Hospital Ave, Medical City, MC 10001',
  emergencyContact: '+1-555-0002',
  bloodGroup: 'O+',
  lastLogin: '2024-10-14 08:30:00',
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'activity'>('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    department: mockUser.department,
    address: mockUser.address,
    emergencyContact: mockUser.emergencyContact,
    bloodGroup: mockUser.bloodGroup,
  });

  const handleSave = () => {
    // In a real app, this would call an API
    alert('Profile saved successfully!');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Layout title="My Profile">
      <div className="max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <Avatar name={mockUser.name} size="xl" className="bg-blue-100" />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors" aria-label="Change avatar">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <h1 className="text-2xl font-bold text-gray-900">{mockUser.name}</h1>
                  <Badge variant="secondary">{mockUser.role}</Badge>
                </div>
                <p className="text-gray-500 mt-1">{mockUser.email}</p>
                <p className="text-sm text-gray-400">Employee ID: {mockUser.employeeId} • Department: {mockUser.department}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline"><LogOut className="h-4 w-4 mr-2" />Sign Out</Button>
                <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as 'profile' | 'security' | 'activity')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
            <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
            <TabsTrigger value="activity"><Bell className="h-4 w-4 mr-2" />Activity</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                      <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      <Input label="Department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                      <Input label="Blood Group" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} />
                      <Input label="Emergency Contact" type="tel" value={formData.emergencyContact} onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})} />
                    </div>
                    <Input label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="sm:col-span-2" />
                    <div className="flex justify-end">
                      <Button type="submit"><Save className="h-4 w-4 mr-2" />Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p className="font-medium">{mockUser.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Join Date</p>
                      <p className="font-medium">{new Date(mockUser.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="font-medium">{new Date(mockUser.lastLogin).toLocaleString('en-US')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Current Password" type="password" />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm New Password" type="password" />
                  </div>
                  <Button><Key className="h-4 w-4 mr-2" />Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-500">Add an extra layer of security to your account</p>
                  <Button variant="outline"><Shield className="h-4 w-4 mr-2" />Enable 2FA</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">Chrome on Windows • Just now</p>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <div className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Logged in', time: '2 minutes ago', ip: '192.168.1.100', device: 'Chrome on Windows' },
                      { action: 'Updated patient record', details: 'Patient PAT-001', time: '1 hour ago', ip: '192.168.1.100', device: 'Chrome on Windows' },
                      { action: 'Created appointment', details: 'Appointment APT-045', time: '3 hours ago', ip: '192.168.1.100', device: 'Chrome on Windows' },
                      { action: 'Viewed billing report', details: 'Monthly revenue', time: 'Yesterday', ip: '192.168.1.100', device: 'Chrome on Windows' },
                      { action: 'Logged in', time: '2 days ago', ip: '192.168.1.50', device: 'Mobile Safari on iOS' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            {activity.details && <p className="text-sm text-gray-500">{activity.details}</p>}
                            <p className="text-xs text-gray-400">{activity.time} • {activity.device} • {activity.ip}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}