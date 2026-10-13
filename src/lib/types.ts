export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  status: 'Active' | 'Inactive' | 'Discharged';
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  department: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  availability: DoctorAvailability[];
  status: 'Active' | 'Inactive' | 'On Leave';
  createdAt: string;
  updatedAt: string;
}

export interface DoctorAvailability {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number;
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Telemedicine';
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Paid' | 'Partial' | 'Cancelled' | 'Refunded';
  paymentMethod?: 'Cash' | 'Card' | 'Insurance' | 'Online' | 'UPI';
  paidAmount: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'Consultation' | 'Lab Test' | 'Medicine' | 'Procedure' | 'Room' | 'Other';
}

export interface Medicine {
  id: string;
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
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  preparationInstructions?: string;
  reportTimeHours: number;
  status: 'Active' | 'Inactive';
}

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  tests: LabOrderTest[];
  status: 'Ordered' | 'Sample Collected' | 'In Progress' | 'Completed' | 'Cancelled';
  orderedAt: string;
  collectedAt?: string;
  completedAt?: string;
  notes?: string;
}

export interface LabOrderTest {
  testId: string;
  testName: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Sample Collected';
  result?: string;
  referenceRange?: string;
  unit?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Doctor' | 'Nurse' | 'Receptionist' | 'Pharmacist' | 'Lab Technician' | 'Accountant';
  department: string;
  avatar?: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  pendingBills: number;
  lowStockMedicines: number;
  pendingLabTests: number;
  revenueToday: number;
  revenueThisMonth: number;
}