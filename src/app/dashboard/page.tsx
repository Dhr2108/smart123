'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/layout/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockDashboardStats, mockAppointments, mockPatients, mockBills } from '@/lib/mockData';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { dashboardApi } from '@/lib/api';
import {
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState(mockDashboardStats);

  useEffect(() => {
    dashboardApi
      .getStats()
      .then((res) => {
        if (res.stats) {
          setDashboardStats((prev) => ({
            ...prev,
            ...res.stats,
          }));
        }
      })
      .catch(() => {
        // Fall back to mock stats gracefully
      });
  }, []);

  const stats = [
    {
      title: 'Total Patients',
      value: dashboardStats.totalPatients,
      icon: <Users className="h-6 w-6" />,
      trend: { value: 12, label: 'vs last month', positive: true },
      color: 'blue' as const,
    },
    {
      title: 'Total Doctors',
      value: dashboardStats.totalDoctors,
      icon: <UserPlus className="h-6 w-6" />,
      trend: { value: 2, label: 'vs last month', positive: true },
      color: 'green' as const,
    },
    {
      title: "Today's Appointments",
      value: dashboardStats.todayAppointments,
      icon: <Calendar className="h-6 w-6" />,
      trend: { value: 5, label: 'vs yesterday', positive: true },
      color: 'purple' as const,
    },
    {
      title: 'Revenue Today',
      value: dashboardStats.revenueToday,
      icon: <DollarSign className="h-6 w-6" />,
      trend: { value: 8, label: 'vs yesterday', positive: true },
      color: 'yellow' as const,
    },
    {
      title: 'Pending Bills',
      value: dashboardStats.pendingBills,
      icon: <AlertTriangle className="h-6 w-6" />,
      trend: { value: 3, label: 'vs last week', positive: false },
      color: 'red' as const,
    },
    {
      title: 'Low Stock Medicines',
      value: dashboardStats.lowStockMedicines,
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
            <Link href="/appointments" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
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
                  render: () => (
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
            <Link href="/patients" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/40">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{patient.name.split(' ').map((n: string) => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-gray-900 dark:text-white">{patient.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{patient.email}</p>
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
            <Link href="/billing" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
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
              <Link href="/triage" className="sm:col-span-2">
                <Button className="h-16 w-full justify-start gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white dark:text-black font-semibold shadow-sm shadow-emerald-600/20">
                  <Sparkles className="h-5 w-5 text-emerald-100 dark:text-black" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">AI Clinical Triage</p>
                    <p className="text-xs text-emerald-100/90 dark:text-black/80 font-medium">Assess patient symptoms & urgency</p>
                  </div>
                </Button>
              </Link>
              <Link href="/patients">
                <Button variant="outline" className="h-16 w-full justify-start gap-3">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Patients</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage records</p>
                  </div>
                </Button>
              </Link>
              <Link href="/appointments">
                <Button variant="outline" className="h-16 w-full justify-start gap-3">
                  <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Appointments</p>
                    <p className="text-xs text-gray-500">Schedule slots</p>
                  </div>
                </Button>
              </Link>
              <Link href="/billing">
                <Button variant="outline" className="h-16 w-full justify-start gap-3">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Invoices & Bills</p>
                    <p className="text-xs text-gray-500">Process payments</p>
                  </div>
                </Button>
              </Link>
              <Link href="/pharmacy">
                <Button variant="outline" className="h-16 w-full justify-start gap-3">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  <div className="text-left">
                    <p className="font-medium text-sm">Pharmacy Stock</p>
                    <p className="text-xs text-gray-500">Inventory alerts</p>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}