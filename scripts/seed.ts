import connectDB from '../src/lib/db';
import { User } from '../src/models/User';
import { Patient } from '../src/models/Patient';
import { Doctor } from '../src/models/Doctor';
import { Appointment } from '../src/models/Appointment';
import { Bill } from '../src/models/Bill';
import { Medicine } from '../src/models/Medicine';
import { LabTest, LabOrder } from '../src/models/Lab';
import { Notification } from '../src/models/Notification';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');
  await connectDB();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Patient.deleteMany({}),
    Doctor.deleteMany({}),
    Appointment.deleteMany({}),
    Bill.deleteMany({}),
    Medicine.deleteMany({}),
    LabTest.deleteMany({}),
    LabOrder.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log('  ✓ Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const users = await User.insertMany([
    { name: 'Admin User', email: 'admin@hospital.com', password: hashedPassword, role: 'Admin', department: 'Administration' },
    { name: 'Dr. Amanda Carter', email: 'a.carter@hospital.com', password: hashedPassword, role: 'Doctor', department: 'Cardiology' },
    { name: 'Dr. James Anderson', email: 'j.anderson@hospital.com', password: hashedPassword, role: 'Doctor', department: 'Neurology' },
    { name: 'Dr. Lisa Thompson', email: 'l.thompson@hospital.com', password: hashedPassword, role: 'Doctor', department: 'Pediatrics' },
    { name: 'Dr. David Martinez', email: 'd.martinez@hospital.com', password: hashedPassword, role: 'Doctor', department: 'Orthopedics' },
    { name: 'Dr. Jennifer Lee', email: 'j.lee@hospital.com', password: hashedPassword, role: 'Doctor', department: 'Dermatology' },
    { name: 'Jane Nurse', email: 'nurse@hospital.com', password: hashedPassword, role: 'Nurse', department: 'General' },
    { name: 'Reception Desk', email: 'reception@hospital.com', password: hashedPassword, role: 'Receptionist', department: 'Front Desk' },
    { name: 'Pharmacy Staff', email: 'pharmacy@hospital.com', password: hashedPassword, role: 'Pharmacist', department: 'Pharmacy' },
    { name: 'Lab Technician', email: 'lab@hospital.com', password: hashedPassword, role: 'Lab Technician', department: 'Laboratory' },
  ]);

  console.log(`  ✓ Created ${users.length} users`);

  // Create patients
  const patients = await Patient.insertMany([
    {
      patientId: 'PAT001', name: 'John Smith', email: 'john.smith@email.com', phone: '+1-555-0101',
      dateOfBirth: new Date('1985-03-15'), gender: 'Male', bloodGroup: 'O+',
      address: '123 Main St, New York, NY 10001', emergencyContact: '+1-555-0102',
      insuranceProvider: 'HealthCare Plus', insuranceNumber: 'HCP-789456', status: 'Active',
      medicalHistory: ['Hypertension', 'Type 2 Diabetes'], allergies: ['Penicillin'],
    },
    {
      patientId: 'PAT002', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1-555-0201',
      dateOfBirth: new Date('1992-07-22'), gender: 'Female', bloodGroup: 'A-',
      address: '456 Oak Ave, Los Angeles, CA 90001', emergencyContact: '+1-555-0202',
      insuranceProvider: 'MediCover', insuranceNumber: 'MC-321654', status: 'Active',
      medicalHistory: ['Asthma'], allergies: [],
    },
    {
      patientId: 'PAT003', name: 'Michael Brown', email: 'm.brown@email.com', phone: '+1-555-0301',
      dateOfBirth: new Date('1978-11-05'), gender: 'Male', bloodGroup: 'B+',
      address: '789 Pine Rd, Chicago, IL 60601', emergencyContact: '+1-555-0302',
      insuranceProvider: 'Wellness Insurance', insuranceNumber: 'WI-987321', status: 'Discharged',
      medicalHistory: ['Knee Surgery (2024)'], allergies: ['Sulfa drugs'],
    },
    {
      patientId: 'PAT004', name: 'Emily Davis', email: 'emily.davis@email.com', phone: '+1-555-0401',
      dateOfBirth: new Date('2000-01-30'), gender: 'Female', bloodGroup: 'AB+',
      address: '321 Elm St, Houston, TX 77001', emergencyContact: '+1-555-0402',
      status: 'Active', medicalHistory: [], allergies: [],
    },
    {
      patientId: 'PAT005', name: 'Robert Wilson', email: 'r.wilson@email.com', phone: '+1-555-0501',
      dateOfBirth: new Date('1965-09-12'), gender: 'Male', bloodGroup: 'O-',
      address: '654 Maple Dr, Phoenix, AZ 85001', emergencyContact: '+1-555-0502',
      insuranceProvider: 'Senior Health Plan', insuranceNumber: 'SHP-456789', status: 'Active',
      medicalHistory: ['Heart Disease', 'High Cholesterol'], allergies: ['Aspirin'],
    },
  ]);

  console.log(`  ✓ Created ${patients.length} patients`);

  // Create doctors
  const doctors = await Doctor.insertMany([
    {
      doctorId: 'DOC001', name: 'Dr. Amanda Carter', email: 'a.carter@hospital.com', phone: '+1-555-1001',
      specialization: 'Cardiology', department: 'Cardiology', qualification: 'MD, FACC', experience: 15,
      consultationFee: 200, status: 'Active', userId: users[1]._id,
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '13:00', isAvailable: true },
        { day: 'Wednesday', startTime: '09:00', endTime: '13:00', isAvailable: true },
        { day: 'Friday', startTime: '14:00', endTime: '18:00', isAvailable: true },
      ],
    },
    {
      doctorId: 'DOC002', name: 'Dr. James Anderson', email: 'j.anderson@hospital.com', phone: '+1-555-1002',
      specialization: 'Neurology', department: 'Neurology', qualification: 'MD, PhD', experience: 12,
      consultationFee: 250, status: 'Active', userId: users[2]._id,
      availability: [
        { day: 'Tuesday', startTime: '10:00', endTime: '14:00', isAvailable: true },
        { day: 'Thursday', startTime: '10:00', endTime: '14:00', isAvailable: true },
        { day: 'Saturday', startTime: '09:00', endTime: '12:00', isAvailable: true },
      ],
    },
    {
      doctorId: 'DOC003', name: 'Dr. Lisa Thompson', email: 'l.thompson@hospital.com', phone: '+1-555-1003',
      specialization: 'Pediatrics', department: 'Pediatrics', qualification: 'MD, FAAP', experience: 10,
      consultationFee: 150, status: 'Active', userId: users[3]._id,
      availability: [
        { day: 'Monday', startTime: '08:00', endTime: '12:00', isAvailable: true },
        { day: 'Wednesday', startTime: '08:00', endTime: '12:00', isAvailable: true },
        { day: 'Friday', startTime: '08:00', endTime: '12:00', isAvailable: true },
      ],
    },
    {
      doctorId: 'DOC004', name: 'Dr. David Martinez', email: 'd.martinez@hospital.com', phone: '+1-555-1004',
      specialization: 'Orthopedics', department: 'Orthopedics', qualification: 'MD, FRCS', experience: 18,
      consultationFee: 300, status: 'On Leave', userId: users[4]._id,
      availability: [
        { day: 'Tuesday', startTime: '14:00', endTime: '18:00', isAvailable: true },
        { day: 'Thursday', startTime: '14:00', endTime: '18:00', isAvailable: true },
      ],
    },
    {
      doctorId: 'DOC005', name: 'Dr. Jennifer Lee', email: 'j.lee@hospital.com', phone: '+1-555-1005',
      specialization: 'Dermatology', department: 'Dermatology', qualification: 'MD, FAAD', experience: 8,
      consultationFee: 180, status: 'Active', userId: users[5]._id,
      availability: [
        { day: 'Monday', startTime: '13:00', endTime: '17:00', isAvailable: true },
        { day: 'Wednesday', startTime: '13:00', endTime: '17:00', isAvailable: true },
        { day: 'Friday', startTime: '13:00', endTime: '17:00', isAvailable: true },
      ],
    },
  ]);

  console.log(`  ✓ Created ${doctors.length} doctors`);

  // Create appointments
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = await Appointment.insertMany([
    {
      appointmentId: 'APT001', patientId: 'PAT001', patientName: 'John Smith',
      doctorId: 'DOC001', doctorName: 'Dr. Amanda Carter',
      date: today, time: '09:30', duration: 30, type: 'Consultation', status: 'Confirmed',
      notes: 'Follow-up for hypertension', queuePosition: 1, estimatedWaitTime: 0,
    },
    {
      appointmentId: 'APT002', patientId: 'PAT002', patientName: 'Sarah Johnson',
      doctorId: 'DOC003', doctorName: 'Dr. Lisa Thompson',
      date: today, time: '10:00', duration: 20, type: 'Consultation', status: 'Scheduled',
      notes: 'Child vaccination', queuePosition: 2, estimatedWaitTime: 15,
    },
    {
      appointmentId: 'APT003', patientId: 'PAT003', patientName: 'Michael Brown',
      doctorId: 'DOC004', doctorName: 'Dr. David Martinez',
      date: today, time: '15:00', duration: 45, type: 'Follow-up', status: 'Completed',
      notes: 'Post-surgery checkup',
    },
    {
      appointmentId: 'APT004', patientId: 'PAT004', patientName: 'Emily Davis',
      doctorId: 'DOC005', doctorName: 'Dr. Jennifer Lee',
      date: today, time: '14:00', duration: 30, type: 'Consultation', status: 'In Progress',
      notes: 'Skin rash evaluation', queuePosition: 1, estimatedWaitTime: 0,
    },
    {
      appointmentId: 'APT005', patientId: 'PAT005', patientName: 'Robert Wilson',
      doctorId: 'DOC001', doctorName: 'Dr. Amanda Carter',
      date: tomorrow, time: '10:30', duration: 30, type: 'Follow-up', status: 'Scheduled',
      notes: 'Cardiac monitoring', queuePosition: 3, estimatedWaitTime: 30,
    },
  ]);

  console.log(`  ✓ Created ${appointments.length} appointments`);

  // Create bills
  const bills = await Bill.insertMany([
    {
      billId: 'BIL001', patientId: 'PAT001', patientName: 'John Smith',
      items: [
        { description: 'Cardiology Consultation', quantity: 1, unitPrice: 200, total: 200, category: 'Consultation' },
        { description: 'ECG Test', quantity: 1, unitPrice: 100, total: 100, category: 'Lab Test' },
        { description: 'Blood Pressure Medication', quantity: 30, unitPrice: 2, total: 60, category: 'Medicine' },
      ],
      subtotal: 360, tax: 36, discount: 0, total: 396,
      status: 'Paid', paymentMethod: 'Card', paidAmount: 396,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      billId: 'BIL002', patientId: 'PAT002', patientName: 'Sarah Johnson',
      items: [
        { description: 'Pediatric Consultation', quantity: 1, unitPrice: 150, total: 150, category: 'Consultation' },
        { description: 'Vaccination - MMR', quantity: 1, unitPrice: 80, total: 80, category: 'Medicine' },
      ],
      subtotal: 230, tax: 23, discount: 20, total: 233,
      status: 'Pending', paidAmount: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      billId: 'BIL003', patientId: 'PAT003', patientName: 'Michael Brown',
      items: [
        { description: 'Orthopedic Surgery', quantity: 1, unitPrice: 5000, total: 5000, category: 'Procedure' },
        { description: 'Hospital Stay (3 days)', quantity: 3, unitPrice: 400, total: 1200, category: 'Room' },
        { description: 'Pain Medication', quantity: 10, unitPrice: 5, total: 50, category: 'Medicine' },
        { description: 'Physiotherapy Sessions', quantity: 5, unitPrice: 75, total: 375, category: 'Procedure' },
      ],
      subtotal: 6625, tax: 662.5, discount: 500, total: 6787.5,
      status: 'Partial', paymentMethod: 'Insurance', paidAmount: 4000,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    {
      billId: 'BIL004', patientId: 'PAT004', patientName: 'Emily Davis',
      items: [
        { description: 'Dermatology Consultation', quantity: 1, unitPrice: 180, total: 180, category: 'Consultation' },
        { description: 'Skin Biopsy', quantity: 1, unitPrice: 250, total: 250, category: 'Lab Test' },
        { description: 'Topical Cream', quantity: 2, unitPrice: 35, total: 70, category: 'Medicine' },
      ],
      subtotal: 500, tax: 50, discount: 0, total: 550,
      status: 'Pending', paidAmount: 0,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
  ]);

  console.log(`  ✓ Created ${bills.length} bills`);

  // Create medicines
  const medicines = await Medicine.insertMany([
    { medicineId: 'MED001', name: 'Lisinopril 10mg', genericName: 'Lisinopril', category: 'Antihypertensive', manufacturer: 'PharmaCorp', batchNumber: 'LCP2024001', expiryDate: new Date('2026-12-31'), quantity: 500, unitPrice: 0.50, reorderLevel: 100, location: 'Aisle A, Shelf 1', status: 'In Stock' },
    { medicineId: 'MED002', name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'Antibiotic', manufacturer: 'MediPharm', batchNumber: 'AMP2024002', expiryDate: new Date('2025-08-15'), quantity: 45, unitPrice: 1.20, reorderLevel: 50, location: 'Aisle B, Shelf 3', status: 'Low Stock' },
    { medicineId: 'MED003', name: 'Metformin 500mg', genericName: 'Metformin', category: 'Antidiabetic', manufacturer: 'DiabetCare', batchNumber: 'MTC2024003', expiryDate: new Date('2027-01-31'), quantity: 800, unitPrice: 0.35, reorderLevel: 150, location: 'Aisle C, Shelf 2', status: 'In Stock' },
    { medicineId: 'MED004', name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'NSAID', manufacturer: 'PainRelief Inc', batchNumber: 'IBP2024004', expiryDate: new Date('2024-03-01'), quantity: 0, unitPrice: 0.25, reorderLevel: 100, location: 'Aisle A, Shelf 4', status: 'Expired' },
    { medicineId: 'MED005', name: 'Atorvastatin 20mg', genericName: 'Atorvastatin', category: 'Statin', manufacturer: 'CardioMeds', batchNumber: 'ATV2024005', expiryDate: new Date('2026-06-30'), quantity: 30, unitPrice: 0.80, reorderLevel: 50, location: 'Aisle D, Shelf 1', status: 'Low Stock' },
    { medicineId: 'MED006', name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'PPI', manufacturer: 'GastroHealth', batchNumber: 'OMP2024006', expiryDate: new Date('2025-11-30'), quantity: 200, unitPrice: 0.45, reorderLevel: 75, location: 'Aisle B, Shelf 1', status: 'In Stock' },
  ]);

  console.log(`  ✓ Created ${medicines.length} medicines`);

  // Create lab tests
  const labTests = await LabTest.insertMany([
    { testId: 'LT001', name: 'Complete Blood Count (CBC)', category: 'Hematology', description: 'Measures red blood cells, white blood cells, and platelets', price: 50, preparationInstructions: 'No fasting required', reportTimeHours: 4, status: 'Active' },
    { testId: 'LT002', name: 'Lipid Profile', category: 'Biochemistry', description: 'Measures cholesterol and triglyceride levels', price: 75, preparationInstructions: '12-hour fasting required', reportTimeHours: 6, status: 'Active' },
    { testId: 'LT003', name: 'Liver Function Test (LFT)', category: 'Biochemistry', description: 'Assesses liver health by measuring enzymes and proteins', price: 80, preparationInstructions: 'No special preparation', reportTimeHours: 8, status: 'Active' },
    { testId: 'LT004', name: 'Kidney Function Test (KFT)', category: 'Biochemistry', description: 'Evaluates kidney function through creatinine and urea', price: 70, preparationInstructions: 'No special preparation', reportTimeHours: 6, status: 'Active' },
    { testId: 'LT005', name: 'Thyroid Function Test (TFT)', category: 'Endocrinology', description: 'Measures TSH, T3, and T4 levels', price: 90, preparationInstructions: 'No fasting required', reportTimeHours: 8, status: 'Active' },
    { testId: 'LT006', name: 'HbA1c (Glycated Hemoglobin)', category: 'Endocrinology', description: 'Average blood sugar over 2-3 months', price: 60, preparationInstructions: 'No fasting required', reportTimeHours: 4, status: 'Active' },
    { testId: 'LT007', name: 'Chest X-Ray', category: 'Radiology', description: 'Imaging of chest organs and structures', price: 100, preparationInstructions: 'Remove metal objects', reportTimeHours: 2, status: 'Active' },
    { testId: 'LT008', name: 'ECG', category: 'Cardiology', description: 'Records electrical activity of the heart', price: 40, preparationInstructions: 'No special preparation', reportTimeHours: 1, status: 'Active' },
  ]);

  console.log(`  ✓ Created ${labTests.length} lab tests`);

  // Create lab orders
  const labOrders = await LabOrder.insertMany([
    {
      orderId: 'LO001', patientId: 'PAT001', patientName: 'John Smith',
      doctorId: 'DOC001', doctorName: 'Dr. Amanda Carter',
      tests: [
        { testId: 'LT001', testName: 'Complete Blood Count (CBC)', status: 'Completed', result: 'Normal', referenceRange: 'WBC: 4.5-11.0 K/uL', unit: 'K/uL' },
        { testId: 'LT002', testName: 'Lipid Profile', status: 'Completed', result: 'Borderline High', referenceRange: 'Total Chol: <200 mg/dL', unit: 'mg/dL' },
      ],
      status: 'Completed', orderedAt: new Date(Date.now() - 86400000),
      collectedAt: new Date(Date.now() - 84600000), completedAt: new Date(Date.now() - 72000000),
      notes: 'Routine cardiac checkup',
    },
    {
      orderId: 'LO002', patientId: 'PAT002', patientName: 'Sarah Johnson',
      doctorId: 'DOC003', doctorName: 'Dr. Lisa Thompson',
      tests: [
        { testId: 'LT005', testName: 'Thyroid Function Test (TFT)', status: 'In Progress' },
        { testId: 'LT006', testName: 'HbA1c (Glycated Hemoglobin)', status: 'Pending' },
      ],
      status: 'In Progress', orderedAt: new Date(),
      collectedAt: new Date(), notes: 'Thyroid screening',
    },
    {
      orderId: 'LO003', patientId: 'PAT004', patientName: 'Emily Davis',
      doctorId: 'DOC005', doctorName: 'Dr. Jennifer Lee',
      tests: [
        { testId: 'LT003', testName: 'Liver Function Test (LFT)', status: 'Sample Collected' },
      ],
      status: 'Sample Collected', orderedAt: new Date(),
      collectedAt: new Date(), notes: 'Pre-medication baseline',
    },
  ]);

  console.log(`  ✓ Created ${labOrders.length} lab orders`);

  // Create notifications
  const notifications = await Notification.insertMany([
    { title: 'New Appointment', message: 'John Smith has a confirmed appointment at 9:30 AM today', type: 'info', category: 'appointment', isRead: false },
    { title: 'Low Stock Alert', message: 'Amoxicillin 500mg is running low (45 units remaining)', type: 'warning', category: 'pharmacy', isRead: false, link: '/pharmacy' },
    { title: 'Lab Results Ready', message: 'CBC and Lipid Profile results for John Smith are ready', type: 'success', category: 'lab', isRead: false, link: '/lab' },
    { title: 'Payment Received', message: 'Payment of $396.00 received from John Smith (Card)', type: 'success', category: 'billing', isRead: true, link: '/billing' },
    { title: 'Pending Bill', message: 'Emily Davis has an unpaid bill of $550.00', type: 'warning', category: 'billing', isRead: false, link: '/billing' },
    { title: 'Appointment Completed', message: 'Michael Brown\'s follow-up appointment has been completed', type: 'info', category: 'appointment', isRead: true },
    { title: 'Medicine Expired', message: 'Ibuprofen 400mg (Batch IBP2024004) has expired', type: 'error', category: 'pharmacy', isRead: false, link: '/pharmacy' },
    { title: 'Queue Update', message: 'Sarah Johnson is next in the queue for Dr. Lisa Thompson', type: 'info', category: 'queue', isRead: false },
  ]);

  console.log(`  ✓ Created ${notifications.length} notifications`);

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📋 Default login credentials:');
  console.log('   Admin:        admin@hospital.com / password123');
  console.log('   Doctor:       a.carter@hospital.com / password123');
  console.log('   Receptionist: reception@hospital.com / password123');
  console.log('   Pharmacist:   pharmacy@hospital.com / password123');
  console.log('   Lab Tech:     lab@hospital.com / password123');

  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
