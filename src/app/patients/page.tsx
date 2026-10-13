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
import { mockPatients, Patient } from '@/lib/mockData';
import { formatDate, getStatusColor, getInitials, generateId } from '@/lib/utils';
import { ClientAge } from '@/components/ui/ClientAge';
import { Plus, Search, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female' | 'Other';
    bloodGroup: string;
    address: string;
    emergencyContact: string;
    insuranceProvider: string;
    insuranceNumber: string;
    status: 'Active' | 'Inactive' | 'Discharged';
  }>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
    insuranceProvider: '',
    insuranceNumber: '',
    status: 'Active',
  });

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        insuranceProvider: patient.insuranceProvider || '',
        insuranceNumber: patient.insuranceNumber || '',
        status: patient.status,
      });
    } else {
      setEditingPatient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: '',
        address: '',
        emergencyContact: '',
        insuranceProvider: '',
        insuranceNumber: '',
        status: 'Active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === editingPatient.id ? { ...p, ...formData, updatedAt: new Date().toISOString() } : p
        )
      );
    } else {
      const newPatient: Patient = {
        id: generateId('PAT'),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPatients((prev) => [newPatient, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (patientToDelete) {
      setPatients((prev) => prev.filter((p) => p.id !== patientToDelete));
      setPatientToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <Layout title="Patient Management">
      <div className="space-y-6">
        {/* Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
            <p className="text-gray-500">Manage patient records and information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
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
                { value: 'Discharged', label: 'Discharged' },
              ]}
              className="w-full sm:w-40"
            />
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Patients Table */}
        <Card>
          <CardContent className="p-0">
            <Table
              columns={[
                { key: 'id', header: 'ID', className: 'font-mono text-sm' },
                {
                  key: 'name',
                  header: 'Patient',
                  render: (row) => (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{getInitials(row.name)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{row.name}</p>
                        <p className="text-sm text-gray-500">{row.email}</p>
                      </div>
                    </div>
                  ),
                },
                { key: 'phone', header: 'Phone' },
                { key: 'dateOfBirth', header: 'DOB / Age', render: (row) => (<span>{formatDate(row.dateOfBirth)} (<ClientAge dateOfBirth={row.dateOfBirth} />)</span>) },
                { key: 'gender', header: 'Gender' },
                { key: 'bloodGroup', header: 'Blood Group' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => (
                    <Badge
                      variant={
                        row.status === 'Active' ? 'success' :
                        row.status === 'Discharged' ? 'info' :
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
                        onClick={() => setViewingPatient(row)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="View patient"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="Edit patient"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setPatientToDelete(row.id); setIsDeleteConfirmOpen(true); }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        aria-label="Delete patient"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={filteredPatients}
              keyExtractor={(row) => row.id}
              emptyMessage="No patients found"
            />
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
            <Input label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} required />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value as 'Male' | 'Female' | 'Other'})}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Select
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
              options={bloodGroups.map(bg => ({ value: bg, label: bg }))}
              placeholder="Select blood group"
            />
          </div>
          <Input label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="sm:col-span-2" />
          <Input label="Emergency Contact" type="tel" value={formData.emergencyContact} onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Insurance Provider" value={formData.insuranceProvider} onChange={(e) => setFormData({...formData, insuranceProvider: e.target.value})} />
            <Input label="Insurance Number" value={formData.insuranceNumber} onChange={(e) => setFormData({...formData, insuranceNumber: e.target.value})} />
          </div>
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Inactive' | 'Discharged'})}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Discharged', label: 'Discharged' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingPatient ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* View Patient Modal */}
      <Modal
        isOpen={!!viewingPatient}
        onClose={() => setViewingPatient(null)}
        title="Patient Details"
        size="lg"
      >
        {viewingPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">{getInitials(viewingPatient.name)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{viewingPatient.name}</h3>
                <p className="text-gray-500">{viewingPatient.id}</p>
              </div>
              <Badge
                variant={
                  viewingPatient.status === 'Active' ? 'success' :
                  viewingPatient.status === 'Discharged' ? 'info' :
                  'secondary'
                }
                className="ml-auto"
              >
                {viewingPatient.status}
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{viewingPatient.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{viewingPatient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p>{formatDate(viewingPatient.dateOfBirth)} (Age: <ClientAge dateOfBirth={viewingPatient.dateOfBirth} />)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p>{viewingPatient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p>{viewingPatient.bloodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Emergency Contact</p>
                <p>{viewingPatient.emergencyContact}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p>{viewingPatient.address}</p>
              </div>
              {viewingPatient.insuranceProvider && (
                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Insurance</p>
                  <p>{viewingPatient.insuranceProvider} - {viewingPatient.insuranceNumber}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="secondary" onClick={() => { setViewingPatient(null); handleOpenModal(viewingPatient); }}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Patient"
        description="Are you sure you want to delete this patient? This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </Layout>
  );
}