'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { mockDoctors, Doctor, DoctorAvailability } from '@/lib/mockData';
import { formatDate, getStatusColor, getInitials, generateId } from '@/lib/utils';
import { Plus, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react';

const specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine', 'Gynecology', 'Psychiatry', 'Radiology', 'Anesthesiology'];
const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine', 'Gynecology', 'Psychiatry', 'Radiology', 'Anesthesiology', 'Emergency', 'ICU'];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    specialization: string;
    department: string;
    qualification: string;
    experience: number;
    consultationFee: number;
    status: 'Active' | 'Inactive' | 'On Leave';
  }>({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    department: '',
    qualification: '',
    experience: 0,
    consultationFee: 0,
    status: 'Active',
  });

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || doctor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        department: doctor.department,
        qualification: doctor.qualification,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        status: doctor.status,
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        department: '',
        qualification: '',
        experience: 0,
        consultationFee: 0,
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === editingDoctor.id ? { ...d, ...formData, updatedAt: new Date().toISOString() } : d
        )
      );
    } else {
      const newDoctor: Doctor = {
        id: generateId('DOC'),
        ...formData,
        availability: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDoctors((prev) => [newDoctor, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (doctorToDelete) {
      setDoctors((prev) => prev.filter((d) => d.id !== doctorToDelete));
      setDoctorToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  return (
    <Layout title="Doctor Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Doctors</h2>
            <p className="text-gray-500">Manage doctor profiles and schedules</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'On Leave', label: 'On Leave' },
              ]}
              className="w-full sm:w-40"
            />
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table
              columns={[
                { key: 'id', header: 'ID', className: 'font-mono text-sm' },
                {
                  key: 'name',
                  header: 'Doctor',
                  render: (row) => (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">{getInitials(row.name)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{row.name}</p>
                        <p className="text-sm text-gray-500">{row.email}</p>
                      </div>
                    </div>
                  ),
                },
                { key: 'specialization', header: 'Specialization' },
                { key: 'department', header: 'Department' },
                { key: 'experience', header: 'Experience', render: (row) => `${row.experience} years` },
                { key: 'consultationFee', header: 'Fee', render: (row) => `$${row.consultationFee}` },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => (
                    <Badge
                      variant={
                        row.status === 'Active' ? 'success' :
                        row.status === 'On Leave' ? 'warning' :
                        'secondary'
                      }
                    >
                      {row.status}
                    </Badge>
                  ),
                },
                {
                  key: 'actions',
                  header: '',
                  render: (row) => (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingDoctor(row)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="View doctor"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="Edit doctor"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setDoctorToDelete(row.id); setIsDeleteConfirmOpen(true); }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        aria-label="Delete doctor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={filteredDoctors}
              keyExtractor={(row) => row.id}
              emptyMessage="No doctors found"
            />
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
            <Select
              label="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              options={specializations.map(s => ({ value: s, label: s }))}
              placeholder="Select specialization"
              required
            />
            <Select
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              options={departments.map(d => ({ value: d, label: d }))}
              placeholder="Select department"
              required
            />
            <Input label="Qualification" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} placeholder="e.g., MD, FACC" required />
            <Input label="Experience (Years)" type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value) || 0})} required />
            <Input label="Consultation Fee ($)" type="number" value={formData.consultationFee} onChange={(e) => setFormData({...formData, consultationFee: parseFloat(e.target.value) || 0})} required />
          </div>
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive' | 'On Leave'})}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'On Leave', label: 'On Leave' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingDoctor ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!viewingDoctor}
        onClose={() => setViewingDoctor(null)}
        title="Doctor Details"
        size="lg"
      >
        {viewingDoctor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{getInitials(viewingDoctor.name)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{viewingDoctor.name}</h3>
                <p className="text-gray-500">{viewingDoctor.id}</p>
              </div>
              <Badge
                variant={
                  viewingDoctor.status === 'Active' ? 'success' :
                  viewingDoctor.status === 'On Leave' ? 'warning' :
                  'secondary'
                }
                className="ml-auto"
              >
                {viewingDoctor.status}
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{viewingDoctor.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{viewingDoctor.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p>{viewingDoctor.specialization}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p>{viewingDoctor.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Qualification</p>
                <p>{viewingDoctor.qualification}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p>{viewingDoctor.experience} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultation Fee</p>
                <p>${viewingDoctor.consultationFee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{viewingDoctor.status}</p>
              </div>
              {viewingDoctor.availability.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Availability</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewingDoctor.availability.map((avail: DoctorAvailability, i: number) => (
                      <Badge key={i} variant={avail.isAvailable ? 'success' : 'secondary'}>
                        {avail.day}: {avail.startTime} - {avail.endTime}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="secondary" onClick={() => { setViewingDoctor(null); handleOpenModal(viewingDoctor); }}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Doctor"
        description="Are you sure you want to delete this doctor? This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </Layout>
  );
}