'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { mockAppointments, mockPatients, mockDoctors, Appointment } from '@/lib/mockData';
import { formatDate, formatTime, generateId } from '@/lib/utils';
import { Plus, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { appointmentsApi } from '@/lib/api';

const appointmentTypes = ['Consultation', 'Follow-up', 'Emergency', 'Telemedicine'];
const appointmentStatuses = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  useEffect(() => {
    appointmentsApi
      .list()
      .then((res) => {
        if (res.appointments && res.appointments.length > 0) {
          setAppointments(res.appointments as Appointment[]);
        }
      })
      .catch(() => {
        // Fall back gracefully to mock data
      });
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    patientId: string;
    doctorId: string;
    date: string;
    time: string;
    duration: number;
    type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Telemedicine';
    status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
    notes: string;
  }>({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    duration: 30,
    type: 'Consultation',
    status: 'Scheduled',
    notes: '',
  });

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const matchesDate = !dateFilter || apt.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleOpenModal = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes || '',
      });
    } else {
      setEditingAppointment(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        patientId: '',
        doctorId: '',
        date: today,
        time: '09:00',
        duration: 30,
        type: 'Consultation',
        status: 'Scheduled',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const patient = mockPatients.find(p => p.id === formData.patientId);
    const doctor = mockDoctors.find(d => d.id === formData.doctorId);
    
    if (editingAppointment) {
      const updated = {
        ...editingAppointment,
        ...formData,
        patientName: patient?.name || '',
        doctorName: doctor?.name || '',
        updatedAt: new Date().toISOString(),
      };
      setAppointments((prev) =>
        prev.map((a) => (a.id === editingAppointment.id ? updated : a))
      );
      try {
        await appointmentsApi.update(editingAppointment.id, formData);
      } catch {
        // Handled locally
      }
    } else {
      const newAppointment: Appointment = {
        id: generateId('APT'),
        ...formData,
        patientName: patient?.name || '',
        doctorName: doctor?.name || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAppointments((prev) => [newAppointment, ...prev]);
      try {
        await appointmentsApi.create(newAppointment);
      } catch {
        // Handled locally
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (appointmentToDelete) {
      const id = appointmentToDelete;
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setAppointmentToDelete(null);
      try {
        await appointmentsApi.delete(id);
      } catch {
        // Handled locally
      }
    }
    setIsDeleteConfirmOpen(false);
  };

  const updateStatus = async (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a))
    );
    try {
      await appointmentsApi.update(id, { status });
    } catch {
      // Handled locally
    }
  };

  return (
    <Layout title="Appointment Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
            <p className="text-gray-500">Manage patient appointments and schedules</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[{ value: 'All', label: 'All Status' }, ...appointmentStatuses.map(s => ({ value: s, label: s }))]}
              className="w-full sm:w-40"
            />
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full sm:w-40" />
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table
              columns={[
                { key: 'id', header: 'ID', className: 'font-mono text-sm' },
                {
                  key: 'dateTime',
                  header: 'Date & Time',
                  render: (row) => (
                    <div>
                      <p className="font-medium">{formatDate(row.date)}</p>
                      <p className="text-sm text-gray-500">{formatTime(row.time)} ({row.duration} min)</p>
                    </div>
                  ),
                },
                {
                  key: 'patientName',
                  header: 'Patient',
                  render: (row) => (
                    <div>
                      <p className="font-medium">{row.patientName}</p>
                      <p className="text-sm text-gray-500">{row.patientId}</p>
                    </div>
                  ),
                },
                {
                  key: 'doctorName',
                  header: 'Doctor',
                  render: (row) => (
                    <div>
                      <p className="font-medium">{row.doctorName}</p>
                      <p className="text-sm text-gray-500">{row.doctorId}</p>
                    </div>
                  ),
                },
                { key: 'type', header: 'Type' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          row.status === 'Completed' ? 'success' :
                          row.status === 'In Progress' ? 'warning' :
                          row.status === 'Cancelled' || row.status === 'No Show' ? 'danger' :
                          row.status === 'Confirmed' ? 'info' :
                          'default'
                        }
                      >
                        {row.status}
                      </Badge>
                      {row.status !== 'Completed' && row.status !== 'Cancelled' && row.status !== 'No Show' && (
                        <select
                          value={row.status}
                          onChange={(e) => updateStatus(row.id, e.target.value as Appointment['status'])}
                          className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
                        >
                          {appointmentStatuses.filter(s => s !== row.status).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'actions',
                  header: '',
                  render: (row) => (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingAppointment(row)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="View appointment"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="Edit appointment"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setAppointmentToDelete(row.id); setIsDeleteConfirmOpen(true); }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        aria-label="Delete appointment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={filteredAppointments}
              keyExtractor={(row) => row.id}
              emptyMessage="No appointments found"
            />
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAppointment ? 'Edit Appointment' : 'New Appointment'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Patient"
              value={formData.patientId}
              onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              options={mockPatients.map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))}
              placeholder="Select patient"
              required
            />
            <Select
              label="Doctor"
              value={formData.doctorId}
              onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
              options={mockDoctors.filter(d => d.status === 'Active').map(d => ({ value: d.id, label: `${d.name} (${d.specialization})` }))}
              placeholder="Select doctor"
              required
            />
            <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            <Input label="Time" type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
            <Input label="Duration (minutes)" type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 30})} required />
            <Select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as Appointment['type']})}
              options={appointmentTypes.map(t => ({ value: t, label: t }))}
            />
          </div>
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as Appointment['status']})}
            options={appointmentStatuses.map(s => ({ value: s, label: s }))}
          />
          <Input label="Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="sm:col-span-2" />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingAppointment ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!viewingAppointment}
        onClose={() => setViewingAppointment(null)}
        title="Appointment Details"
        size="lg"
      >
        {viewingAppointment && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{viewingAppointment.patientName} - {viewingAppointment.doctorName}</h3>
                <p className="text-gray-500">{viewingAppointment.id}</p>
              </div>
              <Badge
                variant={
                  viewingAppointment.status === 'Completed' ? 'success' :
                  viewingAppointment.status === 'In Progress' ? 'warning' :
                  viewingAppointment.status === 'Cancelled' || viewingAppointment.status === 'No Show' ? 'danger' :
                  viewingAppointment.status === 'Confirmed' ? 'info' :
                  'default'
                }
                className="ml-auto"
              >
                {viewingAppointment.status}
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p>{formatDate(viewingAppointment.date)} at {formatTime(viewingAppointment.time)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p>{viewingAppointment.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p>{viewingAppointment.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p>{viewingAppointment.patientName} ({viewingAppointment.patientId})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p>{viewingAppointment.doctorName} ({viewingAppointment.doctorId})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{viewingAppointment.status}</p>
              </div>
              {viewingAppointment.notes && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p>{viewingAppointment.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="secondary" onClick={() => { setViewingAppointment(null); handleOpenModal(viewingAppointment); }}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Appointment"
        description="Are you sure you want to delete this appointment? This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </Layout>
  );
}