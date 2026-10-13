'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { mockBills, mockPatients, Bill, BillItem } from '@/lib/mockData';
import { formatCurrency, formatDate, generateId, getStatusColor } from '@/lib/utils';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, FileText, CreditCard, Download } from 'lucide-react';

const billStatuses = ['Pending', 'Paid', 'Partial', 'Cancelled', 'Refunded'];
const paymentMethods = ['Cash', 'Card', 'Insurance', 'Online', 'UPI'];
const billCategories = ['Consultation', 'Lab Test', 'Medicine', 'Procedure', 'Room', 'Other'];

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [viewingBill, setViewingBill] = useState<Bill | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    patientId: string;
    items: BillItem[];
    tax: number;
    discount: number;
    status: 'Pending' | 'Paid' | 'Partial' | 'Cancelled' | 'Refunded';
    paymentMethod: 'Cash' | 'Card' | 'Insurance' | 'Online' | 'UPI' | undefined;
    paidAmount: number;
    dueDate: string;
  }>({
    patientId: '',
    items: [],
    tax: 10,
    discount: 0,
    status: 'Pending',
    paymentMethod: undefined,
    paidAmount: 0,
    dueDate: '',
  });

  // Initialize dueDate on mount to avoid build-time Date.now()
  useEffect(() => {
    if (!formData.dueDate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: initializing dueDate on mount
      setFormData(prev => ({
        ...prev,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }));
    }
  }, []);

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
  const total = subtotal + (subtotal * formData.tax / 100) - formData.discount;

  const handleOpenModal = (bill?: Bill) => {
    if (bill) {
      setEditingBill(bill);
      setFormData({
        patientId: bill.patientId,
        items: [...bill.items],
        tax: (bill.tax / bill.subtotal) * 100,
        discount: bill.discount,
        status: bill.status,
        paymentMethod: bill.paymentMethod,
        paidAmount: bill.paidAmount,
        dueDate: bill.dueDate,
      });
    } else {
      setEditingBill(null);
      setFormData({
        patientId: '',
        items: [],
        tax: 10,
        discount: 0,
        status: 'Pending',
        paymentMethod: undefined,
        paidAmount: 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: generateId('BI'), description: '', quantity: 1, unitPrice: 0, total: 0, category: 'Consultation' }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof BillItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
      }
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = mockPatients.find(p => p.id === formData.patientId);
    
    if (editingBill) {
      setBills((prev) =>
        prev.map((b) =>
          b.id === editingBill.id
            ? { ...b, ...formData, patientName: patient?.name || '', subtotal, total, updatedAt: new Date().toISOString() }
            : b
        )
      );
    } else {
      const newBill: Bill = {
        id: generateId('BIL'),
        patientId: formData.patientId,
        patientName: patient?.name || '',
        items: formData.items,
        subtotal,
        tax: subtotal * formData.tax / 100,
        discount: formData.discount,
        total,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        paidAmount: formData.paidAmount,
        dueDate: formData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBills((prev) => [newBill, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (billToDelete) {
      setBills((prev) => prev.filter((b) => b.id !== billToDelete));
      setBillToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  return (
    <Layout title="Billing & Payments">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Billing & Payments</h2>
            <p className="text-gray-500">Manage invoices and payments</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[{ value: 'All', label: 'All Status' }, ...billStatuses.map(s => ({ value: s, label: s }))]}
              className="w-full sm:w-40"
            />
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Bill
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table
              columns={[
                { key: 'id', header: 'Bill ID', className: 'font-mono text-sm' },
                { key: 'patientName', header: 'Patient' },
                { key: 'subtotal', header: 'Subtotal', render: (row) => formatCurrency(row.subtotal) },
                { key: 'tax', header: 'Tax', render: (row) => formatCurrency(row.tax) },
                { key: 'discount', header: 'Discount', render: (row) => formatCurrency(row.discount) },
                { key: 'total', header: 'Total', render: (row) => formatCurrency(row.total), className: 'font-bold' },
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
                        row.status === 'Cancelled' || row.status === 'Refunded' ? 'danger' :
                        'default'
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
                        onClick={() => setViewingBill(row)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="View bill"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        aria-label="Edit bill"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setBillToDelete(row.id); setIsDeleteConfirmOpen(true); }}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        aria-label="Delete bill"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={filteredBills}
              keyExtractor={(row) => row.id}
              emptyMessage="No bills found"
            />
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBill ? 'Edit Bill' : 'Create New Bill'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Patient"
            value={formData.patientId}
            onChange={(e) => setFormData({...formData, patientId: e.target.value})}
            options={mockPatients.map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))}
            placeholder="Select patient"
            required
          />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Bill Items</h4>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 px-2">
                <div className="col-span-4">Description</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Qty</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-1"></div>
              </div>
              {formData.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Description"
                    className="col-span-4"
                  />
                  <Select
                    value={item.category}
                    onChange={(e) => updateItem(index, 'category', e.target.value)}
                    options={billCategories.map(c => ({ value: c, label: c }))}
                    className="col-span-2"
                  />
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="col-span-1"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="col-span-2"
                  />
                  <div className="col-span-2 font-medium text-gray-900">
                    {formatCurrency(item.total)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="col-span-1 p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {formData.items.length === 0 && (
                <div className="text-center py-8 text-gray-500">No items added yet. Click &apos;Add Item&apos; to start.</div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 border-t pt-4">
            <div className="sm:col-span-2"></div>
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax ({formData.tax}%):</span>
                <span className="font-medium">{formatCurrency(subtotal * formData.tax / 100)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Discount:</span>
                <span className="font-medium">-{formatCurrency(formData.discount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Tax (%)"
              type="number"
              step="0.1"
              value={formData.tax}
              onChange={(e) => setFormData({...formData, tax: parseFloat(e.target.value) || 0})}
            />
            <Input
              label="Discount"
              type="number"
              step="0.01"
              value={formData.discount}
              onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
            />
            <Input label="Due Date" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as Bill['status']})}
              options={billStatuses.map(s => ({ value: s, label: s }))}
            />
            <Select
              label="Payment Method"
              value={formData.paymentMethod || ''}
              onChange={(e) => setFormData({...formData, paymentMethod: (e.target.value || undefined) as 'Cash' | 'Card' | 'Insurance' | 'Online' | 'UPI' | undefined})}
              options={[{ value: '', label: 'Not Paid' }, ...paymentMethods.map(m => ({ value: m, label: m }))]}
            />
            <Input
              label="Paid Amount"
              type="number"
              step="0.01"
              value={formData.paidAmount}
              onChange={(e) => setFormData({...formData, paidAmount: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingBill ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!viewingBill}
        onClose={() => setViewingBill(null)}
        title="Bill Details"
        size="xl"
      >
        {viewingBill && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{viewingBill.patientName}</h3>
                <p className="text-gray-500">{viewingBill.id} • {formatDate(viewingBill.createdAt)}</p>
              </div>
              <Badge
                variant={
                  viewingBill.status === 'Paid' ? 'success' :
                  viewingBill.status === 'Partial' ? 'warning' :
                  viewingBill.status === 'Cancelled' || viewingBill.status === 'Refunded' ? 'danger' :
                  'default'
                }
              >
                {viewingBill.status}
              </Badge>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Items</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1">Qty</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-2">Total</div>
                </div>
                {viewingBill.items.map((item: BillItem) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 text-sm">
                    <div className="col-span-5">{item.description}</div>
                    <div className="col-span-2"><Badge variant="secondary">{item.category}</Badge></div>
                    <div className="col-span-1">{item.quantity}</div>
                    <div className="col-span-2">{formatCurrency(item.unitPrice)}</div>
                    <div className="col-span-2 font-medium">{formatCurrency(item.total)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
              <div className="sm:col-span-1"></div>
              <div className="space-y-2 text-right">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span>{formatCurrency(viewingBill.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax:</span><span>{formatCurrency(viewingBill.tax)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Discount:</span><span>-{formatCurrency(viewingBill.discount)}</span></div>
                <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total:</span><span>{formatCurrency(viewingBill.total)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Paid:</span><span>{formatCurrency(viewingBill.paidAmount)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Balance:</span><span className="text-red-600">{formatCurrency(viewingBill.total - viewingBill.paidAmount)}</span></div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 border-t pt-4">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p>{viewingBill.paymentMethod || 'Not Paid'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p>{formatDate(viewingBill.dueDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{viewingBill.status}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="secondary" onClick={() => { setViewingBill(null); handleOpenModal(viewingBill); }}>
                Edit
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Bill"
        description="Are you sure you want to delete this bill? This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </Layout>
  );
}
