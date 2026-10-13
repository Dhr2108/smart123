'use client';

import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/layout/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockDashboardStats, mockAppointments, mockPatients, mockBills } from '@/lib/mockData';
import { formatDate, formatTime, formatCurrency, getStatusColor } from '@/lib/utils';
import {
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Patients',
      value: mockDashboardStats.totalPatients,
      icon: <Users className="h-6 w-6" />,
      trend: { value: 12, label: 'vs last month', positive: true },
      color: 'blue' as const,
    },
    {
      title: 'Total Doctors',
      value: mockDashboardStats.totalDoctors,
      icon: <UserPlus className="h-6 w-6" />,
      trend: { value: 2, label: 'vs last month', positive: true },
      color: 'green' as const,
    },
    {
      title: "Today's Appointments",
      value: mockDashboardStats.todayAppointments,
      icon: <Calendar className="h-6 w-6" />,
      trend: { value: 5, label: 'vs yesterday', positive: true },
      color: 'purple' as const,
    },
    {
      title: 'Revenue Today',
      value: mockDashboardStats.revenueToday,
      icon: <DollarSign className="h-6 w-6" />,
      trend: { value: 8, label: 'vs yesterday', positive: true },
      color: 'yellow' as const,
    },
    {
      title: 'Pending Bills',
      value: mockDashboardStats.pendingBills,
      icon: <AlertTriangle className="h-6 w-6" />,
      trend: { value: 3, label: 'vs last week', positive: false },
      color: 'red' as const,
    },
    {
      title: 'Low Stock Medicines',
      value: mockDashboardStats.lowStockMedicines,
      icon: <TrendingUp className="h-6 w-6" />,
      trend: { value: 2, label: 'vs last week', positive: false },
      color: 'orange' as const,
    },
  ];

  const recentAppointments = mockAppointments.slice(0, 5);
  const recentPatients = mockPatients.slice(0, 5);
  const pendingBills = mockBills.filter((b) => b.status === 'Pending' || b.status === 'Partial').slice(0, 5);

  return (
    <Layout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Recent Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today&apos;s Appointments</CardTitle>
            <Link href="/appointments" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { key: 'time', header: 'Time', className: 'font-medium' },
                { key: 'patientName', header: 'Patient' },
                { key: 'doctorName', header: 'Doctor' },
                { key: 'type', header: 'Type' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => (
                    <Badge variant={getStatusColor(row.status).includes('green') ? 'success' : getStatusColor(row.status).includes('yellow') ? 'warning' : getStatusColor(row.status).includes('blue') ? 'info' : 'default'}>
                      {row.status}
                    </Badge>
                  ),
                },
                {
                  key: 'actions',
                  header: '',
                  render: (row) => (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  ),
                },
              ]}
              data={recentAppointments}
              keyExtractor={(row) => row.id}
              onRowClick={(row) => console.log('Appointment clicked', row.id)}
            />
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Patients</CardTitle>
            <Link href="/patients" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-medium text-blue-600">{patient.name.split(' ').map((n: string) => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{patient.name}</p>
                    <p className="text-xs text-gray-500">{patient.email}</p>
                  </div>
                  <Badge variant={patient.status === 'Active' ? 'success' : patient.status === 'Discharged' ? 'info' : 'secondary'}>
                    {patient.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Bills */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Bills</CardTitle>
            <Link href="/billing" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { key: 'id', header: 'Bill ID', className: 'font-mono text-sm' },
                { key: 'patientName', header: 'Patient' },
                { key: 'total', header: 'Amount', render: (row) => formatCurrency(row.total) },
                { key: 'paidAmount', header: 'Paid', render: (row) => formatCurrency(row.paidAmount) },
                { key: 'dueDate', header: 'Due Date', render: (row) => formatDate(row.dueDate) },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => (
                    <Badge
                      variant={
                        row.status === 'Paid' ? 'success' :
                        row.status === 'Partial' ? 'warning' :
                        'default'
                      }
                    >
                      {row.status}
                    </Badge>
                  ),
                },
              ]}
              data={pendingBills}
              keyExtractor={(row) => row.id}
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/patients/new">
                <Button variant="outline" className="h-20 w-full justify-start gap-3">
                  <Users className="h-5 w-5" />
                  <span>Register Patient</span>
                </Button>
              </Link>
              <Link href="/appointments/new">
                <Button variant="outline" className="h-20 w-full justify-start gap-3">
                  <Calendar className="h-5 w-5" />
                  <span>New Appointment</span>
                </Button>
              </Link>
              <Link href="/billing/new">
                <Button variant="outline" className="h-20 w-full justify-start gap-3">
                  <DollarSign className="h-5 w-5" />
                  <span>Create Bill</span>
                </Button>
              </Link>
              <Link href="/pharmacy/new">
                <Button variant="outline" className="h-20 w-full justify-start gap-3">
                  <TrendingUp className="h-5 w-5" />
                  <span>Add Medicine</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}