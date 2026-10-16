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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { mockLabTests, mockLabOrders, LabTest, LabOrder, LabOrderTest } from '@/lib/mockData';
import { formatCurrency, formatDateTime, formatDateTimeShort, generateId } from '@/lib/utils';
import { Plus, Search, Edit, Trash2, Eye, FlaskConical, FileText } from 'lucide-react';
import { labApi } from '@/lib/api';

const testCategories = ['Hematology', 'Biochemistry', 'Endocrinology', 'Radiology', 'Cardiology', 'Microbiology', 'Immunology', 'Other'];
const orderStatuses = ['Ordered', 'Sample Collected', 'In Progress', 'Completed', 'Cancelled'];
const testStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

export default function LabPage() {
  const [tests, setTests] = useState<LabTest[]>(mockLabTests);
  const [orders, setOrders] = useState<LabOrder[]>(mockLabOrders);

  useEffect(() => {
    Promise.all([
      labApi.listTests().catch(() => ({ tests: [] })),
      labApi.listOrders().catch(() => ({ orders: [] })),
    ]).then(([testsRes, ordersRes]) => {
      if (testsRes.tests && testsRes.tests.length > 0) {
        setTests(testsRes.tests as LabTest[]);
      }
      if (ordersRes.orders && ordersRes.orders.length > 0) {
        setOrders(ordersRes.orders as LabOrder[]);
      }
    });
  }, []);
  const [activeTab, setActiveTab] = useState<'tests' | 'orders'>('tests');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTest | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<LabOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<LabOrder | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'test' | 'order'; id: string } | null>(null);

  const [testFormData, setTestFormData] = useState<{
    name: string;
    category: string;
    description: string;
    price: number;
    preparationInstructions: string;
    reportTimeHours: number;
    status: 'Active' | 'Inactive';
  }>({
    name: '',
    category: '',
    description: '',
    price: 0,
    preparationInstructions: '',
    reportTimeHours: 24,
    status: 'Active',
  });

  const [orderFormData, setOrderFormData] = useState<{
    patientId: string;
    doctorId: string;
    tests: { testId: string; testName: string; status: LabOrderTest['status'] }[];
    status: 'Ordered' | 'Sample Collected' | 'In Progress' | 'Completed' | 'Cancelled';
    notes: string;
  }>({
    patientId: '',
    doctorId: '',
    tests: [],
    status: 'Ordered',
    notes: '',
  });

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || test.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || test.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenTestModal = (test?: LabTest) => {
    if (test) {
      setEditingTest(test);
      setTestFormData({
        name: test.name,
        category: test.category,
        description: test.description,
        price: test.price,
        preparationInstructions: test.preparationInstructions || '',
        reportTimeHours: test.reportTimeHours,
        status: test.status,
      });
    } else {
      setEditingTest(null);
      setTestFormData({
        name: '',
        category: '',
        description: '',
        price: 0,
        preparationInstructions: '',
        reportTimeHours: 24,
        status: 'Active',
      });
    }
    setIsTestModalOpen(true);
  };

  const handleOpenOrderModal = (order?: LabOrder) => {
    if (order) {
      setEditingOrder(order);
      setOrderFormData({
        patientId: order.patientId,
        doctorId: order.doctorId,
        tests: order.tests.map((t: LabOrderTest) => ({ testId: t.testId, testName: t.testName, status: t.status })),
        status: order.status,
        notes: order.notes || '',
      });
    } else {
      setEditingOrder(null);
      setOrderFormData({
        patientId: '',
        doctorId: '',
        tests: [],
        status: 'Ordered',
        notes: '',
      });
    }
    setIsOrderModalOpen(true);
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTest) {
      setTests((prev) =>
        prev.map((t) => (t.id === editingTest.id ? { ...t, ...testFormData } : t))
      );
    } else {
      const newTest: LabTest = {
        id: generateId('LT'),
        ...testFormData,
      };
      setTests((prev) => [newTest, ...prev]);
    }
    setIsTestModalOpen(false);
  };

  const addOrderTest = () => {
    setOrderFormData(prev => ({
      ...prev,
      tests: [...prev.tests, { testId: '', testName: '', status: 'Pending' }]
    }));
  };

  const removeOrderTest = (index: number) => {
    setOrderFormData(prev => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index)
    }));
  };

  const updateOrderTest = (index: number, field: 'testId' | 'status', value: string) => {
    setOrderFormData(prev => {
      const newTests = [...prev.tests];
      const test = tests.find(t => t.id === value);
      newTests[index] = { 
        ...newTests[index], 
        [field]: value,
        testName: field === 'testId' && test ? test.name : newTests[index].testName
      };
      return { ...prev, tests: newTests };
    });
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd get patient/doctor names from their IDs
    if (editingOrder) {
      setOrders((prev) =>
        prev.map((o) => (o.id === editingOrder.id ? { ...o, ...orderFormData, updatedAt: new Date().toISOString() } : o))
      );
    } else {
      const newOrder: LabOrder = {
        id: generateId('LO'),
        ...orderFormData,
        patientName: 'Patient Name', // Would come from patient lookup
        doctorName: 'Doctor Name',   // Would come from doctor lookup
        orderedAt: new Date().toISOString(),
      };
      setOrders((prev) => [newOrder, ...prev]);
    }
    setIsOrderModalOpen(false);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'test') {
        setTests((prev) => prev.filter((t) => t.id !== itemToDelete.id));
      } else {
        setOrders((prev) => prev.filter((o) => o.id !== itemToDelete.id));
      }
      setItemToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const updateOrderStatus = (id: string, status: LabOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => 
        o.id === id 
          ? { 
              ...o, 
              status, 
              collectedAt: status === 'Sample Collected' ? new Date().toISOString() : o.collectedAt,
              completedAt: status === 'Completed' ? new Date().toISOString() : o.completedAt,
              updatedAt: new Date().toISOString()
            } 
          : o
      )
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateTestStatus = (orderId: string, testId: string, status: LabOrderTest['status']) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, tests: o.tests.map((t: LabOrderTest) => t.testId === testId ? { ...t, status } : t), updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  return (
    <Layout title="Lab & Radiology">
      <div className="space-y-6">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as 'tests' | 'orders')} className="w-full">
          <TabsList>
            <TabsTrigger value="tests">
              <FlaskConical className="h-4 w-4 mr-2" />
              Lab Tests
            </TabsTrigger>
            <TabsTrigger value="orders">
              <FileText className="h-4 w-4 mr-2" />
              Lab Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tests">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Lab Tests</h2>
                  <p className="text-gray-500">Manage available laboratory tests</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    options={[{ value: 'All', label: 'All Categories' }, ...testCategories.map(c => ({ value: c, label: c }))]}
                    className="w-full sm:w-40"
                  />
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[{ value: 'All', label: 'All Status' }, { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
                    className="w-full sm:w-40"
                  />
                  <Button onClick={() => handleOpenTestModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Test
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table
                    columns={[
                      { key: 'id', header: 'ID', className: 'font-mono text-sm' },
                      { key: 'name', header: 'Test Name' },
                      { key: 'category', header: 'Category' },
                      { key: 'description', header: 'Description', render: (row) => <span className="max-w-xs truncate block">{row.description}</span> },
                      { key: 'price', header: 'Price', render: (row) => formatCurrency(row.price) },
                      { key: 'reportTimeHours', header: 'Report Time', render: (row) => `${row.reportTimeHours} hrs` },
                      { key: 'preparationInstructions', header: 'Preparation', render: (row) => row.preparationInstructions || '-' },
                      {
                        key: 'status',
                        header: 'Status',
                        render: (row) => (
                          <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge>
                        ),
                      },
                      {
                        key: 'actions',
                        header: '',
                        render: (row) => (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleOpenTestModal(row)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700" aria-label="Edit test"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => { setItemToDelete({ type: 'test', id: row.id }); setIsDeleteConfirmOpen(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600" aria-label="Delete test"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        ),
                      },
                    ]}
                    data={filteredTests}
                    keyExtractor={(row) => row.id}
                    emptyMessage="No lab tests found"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Lab Orders</h2>
                  <p className="text-gray-500">Manage laboratory test orders</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[{ value: 'All', label: 'All Status' }, ...orderStatuses.map(s => ({ value: s, label: s }))]}
                    className="w-full sm:w-40"
                  />
                  <Button onClick={() => handleOpenOrderModal()}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table
                    columns={[
                      { key: 'id', header: 'Order ID', className: 'font-mono text-sm' },
                      { key: 'patientName', header: 'Patient' },
                      { key: 'doctorName', header: 'Doctor' },
                      {
                        key: 'tests',
                        header: 'Tests',
                        render: (row) => (
                          <div className="space-y-1">
                            {row.tests.map((t: LabOrderTest, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <span>{t.testName}</span>
                                <Badge
                                  variant={
                                    t.status === 'Completed' ? 'success' :
                                    t.status === 'In Progress' ? 'warning' :
                                    t.status === 'Cancelled' ? 'danger' :
                                    'default'
                                  }
                                  className="text-xs"
                                >
                                  {t.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ),
                      },
                      { key: 'orderedAt', header: 'Ordered', render: (row) => formatDateTimeShort(row.orderedAt) },
                      { key: 'collectedAt', header: 'Collected', render: (row) => row.collectedAt ? formatDateTimeShort(row.collectedAt) : '-' },
                      { key: 'completedAt', header: 'Completed', render: (row) => row.completedAt ? formatDateTimeShort(row.completedAt) : '-' },
                      {
                        key: 'status',
                        header: 'Status',
                        render: (row) => (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                row.status === 'Completed' ? 'success' :
                                row.status === 'In Progress' || row.status === 'Sample Collected' ? 'warning' :
                                row.status === 'Cancelled' ? 'danger' :
                                'default'
                              }
                            >
                              {row.status}
                            </Badge>
                            <select
                              value={row.status}
                              onChange={(e) => updateOrderStatus(row.id, e.target.value as LabOrder['status'])}
                              className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
                            >
                              {orderStatuses.filter(s => s !== row.status).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        ),
                      },
                      {
                        key: 'actions',
                        header: '',
                        render: (row) => (
                          <div className="flex items-center gap-1">
                            <button onClick={() => setViewingOrder(row)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700" aria-label="View order"><Eye className="h-4 w-4" /></button>
                            <button onClick={() => handleOpenOrderModal(row)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700" aria-label="Edit order"><Edit className="h-4 w-4" /></button>
                            <button onClick={() => { setItemToDelete({ type: 'order', id: row.id }); setIsDeleteConfirmOpen(true); }} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600" aria-label="Delete order"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        ),
                      },
                    ]}
                    data={filteredOrders}
                    keyExtractor={(row) => row.id}
                    emptyMessage="No lab orders found"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Test Modal */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title={editingTest ? 'Edit Lab Test' : 'Add New Lab Test'}
        size="lg"
      >
        <form onSubmit={handleTestSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Test Name" value={testFormData.name} onChange={(e) => setTestFormData({...testFormData, name: e.target.value})} required />
            <Select
              label="Category"
              value={testFormData.category}
              onChange={(e) => setTestFormData({...testFormData, category: e.target.value})}
              options={testCategories.map(c => ({ value: c, label: c }))}
              placeholder="Select category"
              required
            />
            <Input label="Price ($)" type="number" step="0.01" value={testFormData.price} onChange={(e) => setTestFormData({...testFormData, price: parseFloat(e.target.value) || 0})} required />
            <Input label="Report Time (hours)" type="number" value={testFormData.reportTimeHours} onChange={(e) => setTestFormData({...testFormData, reportTimeHours: parseInt(e.target.value) || 24})} required />
          </div>
          <Input label="Description" value={testFormData.description} onChange={(e) => setTestFormData({...testFormData, description: e.target.value})} className="sm:col-span-2" required />
          <Input label="Preparation Instructions" value={testFormData.preparationInstructions} onChange={(e) => setTestFormData({...testFormData, preparationInstructions: e.target.value})} className="sm:col-span-2" />
          <Select
            label="Status"
            value={testFormData.status}
            onChange={(e) => setTestFormData({...testFormData, status: e.target.value as LabTest['status']})}
            options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]}
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setIsTestModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingTest ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title={editingOrder ? 'Edit Lab Order' : 'New Lab Order'}
        size="xl"
      >
        <form onSubmit={handleOrderSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Patient"
              value={orderFormData.patientId}
              onChange={(e) => setOrderFormData({...orderFormData, patientId: e.target.value})}
              options={mockLabOrders.flatMap(o => [{ value: o.patientId, label: o.patientName }])}
              placeholder="Select patient"
              required
            />
            <Select
              label="Doctor"
              value={orderFormData.doctorId}
              onChange={(e) => setOrderFormData({...orderFormData, doctorId: e.target.value})}
              options={mockLabOrders.flatMap(o => [{ value: o.doctorId, label: o.doctorName }])}
              placeholder="Select doctor"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Tests</h4>
              <Button type="button" variant="outline" size="sm" onClick={addOrderTest}>
                <Plus className="h-4 w-4 mr-1" />
                Add Test
              </Button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 px-2">
                <div className="col-span-5">Test</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-1"></div>
              </div>
              {orderFormData.tests.map((test: { testId: string; testName: string; status: LabOrderTest['status'] }, index: number) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <Select
                    value={test.testId}
                    onChange={(e) => updateOrderTest(index, 'testId', e.target.value)}
                    options={tests.map(t => ({ value: t.id, label: t.name }))}
                    placeholder="Select test"
                    className="col-span-5"
                  />
                  <Select
                    value={test.status}
                    onChange={(e) => updateOrderTest(index, 'status', e.target.value)}
                    options={testStatuses.map((s: string) => ({ value: s, label: s }))}
                    className="col-span-3"
                  />
                  <button type="button" onClick={() => removeOrderTest(index)} className="col-span-1 p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600" aria-label="Remove test"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              {orderFormData.tests.length === 0 && <div className="text-center py-4 text-gray-500">No tests added</div>}
            </div>
          </div>

          <Select
            label="Order Status"
            value={orderFormData.status}
            onChange={(e) => setOrderFormData({...orderFormData, status: e.target.value as LabOrder['status']})}
            options={orderStatuses.map((s: string) => ({ value: s, label: s }))}
          />
          <Input label="Notes" value={orderFormData.notes} onChange={(e) => setOrderFormData({...orderFormData, notes: e.target.value})} className="sm:col-span-2" />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setIsOrderModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingOrder ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      {/* View Order Modal */}
      <Modal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        title="Lab Order Details"
        size="xl"
      >
        {viewingOrder && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{viewingOrder.patientName}</h3>
                <p className="text-gray-500">{viewingOrder.id} • Ordered: {formatDateTimeShort(viewingOrder.orderedAt)}</p>
              </div>
              <Badge
                variant={
                  viewingOrder.status === 'Completed' ? 'success' :
                  viewingOrder.status === 'In Progress' || viewingOrder.status === 'Sample Collected' ? 'warning' :
                  viewingOrder.status === 'Cancelled' ? 'danger' :
                  'default'
                }
              >
                {viewingOrder.status}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p>{viewingOrder.patientName} ({viewingOrder.patientId})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p>{viewingOrder.doctorName} ({viewingOrder.doctorId})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{viewingOrder.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ordered</p>
                <p>{formatDateTime(viewingOrder.orderedAt)}</p>
              </div>
              {viewingOrder.collectedAt && (
                <div>
                  <p className="text-sm text-gray-500">Collected</p>
                  <p>{formatDateTime(viewingOrder.collectedAt)}</p>
                </div>
              )}
              {viewingOrder.completedAt && (
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p>{formatDateTime(viewingOrder.completedAt)}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Tests</h4>
              <div className="space-y-2">
                {viewingOrder.tests.map((test: LabOrderTest, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{test.testName}</p>
                      <p className="text-sm text-gray-500">{test.testId}</p>
                    </div>
                    <Badge
                      variant={
                        test.status === 'Completed' ? 'success' :
                        test.status === 'In Progress' ? 'warning' :
                        test.status === 'Cancelled' ? 'danger' :
                        'default'
                      }
                    >
                      {test.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {viewingOrder.notes && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">Notes</p>
                <p>{viewingOrder.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="secondary" onClick={() => { setViewingOrder(null); handleOpenOrderModal(viewingOrder); }}>
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </Layout>
  );
}