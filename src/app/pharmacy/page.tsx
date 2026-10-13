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
import { mockMedicines, Medicine } from '@/lib/mockData';
import { formatCurrency, formatDate, generateId, getStatusColor } from '@/lib/utils';
import { Plus, Search, Edit, Trash2, Eye, Pill, AlertTriangle, Package } from 'lucide-react';

const medicineCategories = ['Antihypertensive', 'Antibiotic', 'Antidiabetic', 'NSAID', 'Statin', 'PPI', 'Anticoagulant', 'Bronchodilator', 'Antidepressant', 'Other'];
const medicineStatuses = ['In Stock', 'Low Stock', 'Out of Stock', 'Expired'];

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [viewingMedicine, setViewingMedicine] = useState<Medicine | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    genericName: string;
    category: string;
    manufacturer: string;
    batchNumber: string;
    expiryDate: string;
    quantity: number;
    unitPrice: number;
    reorderLevel: number;
    location: string;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';
  }>({
    name: '',
    genericName: '',
    category: '',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    quantity: 0,
    unitPrice: 0,
    reorderLevel: 10,
    location: '',
    status: 'In Stock',
  });

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || med.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || med.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockCount = medicines.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock').length;
  const expiredCount = medicines.filter(m => m.status === 'Expired').length;

  const handleOpenModal = (medicine?: Medicine) => {
    if (medicine) {
      setEditingMedicine(medicine);
      setFormData({
        name: medicine.name,
        genericName: medicine.genericName,
        category: medicine.category,
        manufacturer: medicine.manufacturer,
        batchNumber: medicine.batchNumber,
        expiryDate: medicine.expiryDate,
        quantity: medicine.quantity,
        unitPrice: medicine.unitPrice,
        reorderLevel: medicine.reorderLevel,
        location: medicine.location,
        status: medicine.status,
      });
    } else {
      setEditingMedicine(null);
      setFormData({
        name: '',
        genericName: '',
        category: '',
        manufacturer: '',
        batchNumber: '',
        expiryDate: '',
        quantity: 0,
        unitPrice: 0,
        reorderLevel: 10,
        location: '',
        status: 'In Stock',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const status = formData.quantity === 0 ? 'Out of Stock' : 
                   new Date(formData.expiryDate) < new Date() ? 'Expired' :
                   formData.quantity <= formData.reorderLevel ? 'Low Stock' : 'In Stock';
    
    if (editingMedicine) {
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === editingMedicine.id ? { ...m, ...formData, status } : m
        )
      );
    } else {
      const newMedicine: Medicine = {
        id: generateId('MED'),
        ...formData,
        status,
      };
      setMedicines((prev) => [newMedicine, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (medicineToDelete) {
      setMedicines((prev) => prev.filter((m) => m.id !== medicineToDelete));
      setMedicineToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  return (
    <Layout title="Pharmacy & Inventory">
      <div className="space-y-6">
        {/* Alert Cards */}
        {(lowStockCount > 0 || expiredCount > 0) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {lowStockCount > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
                    <p className="text-sm text-yellow-700">{lowStockCount} medicines are below reorder level</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {expiredCount > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-3 rounded-full bg-red-100">
                    <Package className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800">Expired Medicines</h3>
                    <p className="text-sm text-red-700">{expiredCount} medicines have expired</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Medicine Inventory</h2>
            <p className="text-gray-500">Manage pharmacy stock and inventory</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[{ value: 'All', label: 'All Categories' }, ...medicineCategories.map(c => ({ value: c, label: c }))]}
              className="w-full sm:w-40"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[{ value: 'All', label: 'All Status' }, ...medicineStatuses.map(s => ({ value: s, label: s }))]}
              className="w-full sm:w-40"
            />
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
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
                  header: 'Medicine',
                  render: (row) => (
                    <div>
                      <p className="font-medium">{row.name}</p>
                      <p className="text-sm text-gray-500">{row.genericName}</p>
                    </div>
                  ),
                },
                { key: 'category', header: 'Category' },
                { key: 'manufacturer', header: 'Manufacturer' },
                { key: 'batchNumber', header: 'Batch No.' },
                { key: 'expiryDate', header: 'Expiry', render: (row) => formatDate(row.expiryDate) },
                { key: 'quantity', header: 'Qty' },
                { key: 'unitPrice', header: 'Unit Price', render: (row) => formatCurrency(row.unitPrice) },
                { key: 'reorderLevel', header: 'Reorder Level' },
                { key: 'location', header: 'Location' },
                {
                  key: 'status',
                  header: 'Status',
                  render: (row) => (
                    <Badge
                      variant={
                        row.status === 'In Stock' ? 'success' :
                        row.status === 'Low Stock' ? 'warning' :
                        row.status === 'Out of Stock' ? 'danger' :
                        'danger'
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
                        onClick={() => setViewingMedicine(row)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="View medicine"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="Edit medicine"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setMedicineToDelete(row.id); setIsDeleteConfirmOpen(true); }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        aria-label="Delete medicine"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={filteredMedicines}
              keyExtractor={(row) => row.id}
              emptyMessage="No medicines found"
            />
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Brand Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <Input label="Generic Name" value={formData.genericName} onChange={(e) => setFormData({...formData, genericName: e.target.value})} required />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              options={medicineCategories.map(c => ({ value: c, label: c }))}
              placeholder="Select category"
              required
            />
            <Input label="Manufacturer" value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} required />
            <Input label="Batch Number" value={formData.batchNumber} onChange={(e) => setFormData({...formData, batchNumber: e.target.value})} required />
            <Input label="Expiry Date" type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} required />
            <Input label="Quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} required />
            <Input label="Unit Price" type="number" step="0.01" value={formData.unitPrice} onChange={(e) => setFormData({...formData, unitPrice: parseFloat(e.target.value) || 0})} required />
            <Input label="Reorder Level" type="number" value={formData.reorderLevel} onChange={(e) => setFormData({...formData, reorderLevel: parseInt(e.target.value) || 10})} />
            <Input label="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g., Aisle A, Shelf 1" />
          </div>
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value as Medicine['status']})}
            options={medicineStatuses.map(s => ({ value: s, label: s }))}
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingMedicine ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!viewingMedicine}
        onClose={() => setViewingMedicine(null)}
        title="Medicine Details"
        size="lg"
      >
        {viewingMedicine && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Pill className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{viewingMedicine.name}</h3>
                <p className="text-gray-500">{viewingMedicine.genericName} • {viewingMedicine.id}</p>
              </div>
              <Badge
                variant={
                  viewingMedicine.status === 'In Stock' ? 'success' :
                  viewingMedicine.status === 'Low Stock' ? 'warning' :
                  'danger'
                }
                className="ml-auto"
              >
                {viewingMedicine.status}
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p>{viewingMedicine.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Manufacturer</p>
                <p>{viewingMedicine.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Batch Number</p>
                <p>{viewingMedicine.batchNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expiry Date</p>
                <p>{formatDate(viewingMedicine.expiryDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p>{viewingMedicine.quantity} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reorder Level</p>
                <p>{viewingMedicine.reorderLevel} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unit Price</p>
                <p>{formatCurrency(viewingMedicine.unitPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p>{viewingMedicine.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{viewingMedicine.status}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="secondary" onClick={() => { setViewingMedicine(null); handleOpenModal(viewingMedicine); }}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Medicine"
        description="Are you sure you want to delete this medicine? This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </Layout>
  );
}