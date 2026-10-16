import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Patient } from '@/models/Patient';
import { Doctor } from '@/models/Doctor';
import { Appointment } from '@/models/Appointment';
import { Bill } from '@/models/Bill';
import { Medicine } from '@/models/Medicine';
import { LabOrder } from '@/models/Lab';

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalPatients,
      totalDoctors,
      todayAppointments,
      pendingBills,
      lowStockMedicines,
      pendingLabTests,
      todayPaidBills,
      monthPaidBills,
    ] = await Promise.all([
      Patient.countDocuments({ status: 'Active' }),
      Doctor.countDocuments({ status: { $ne: 'Inactive' } }),
      Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      Bill.countDocuments({ status: { $in: ['Pending', 'Partial'] } }),
      Medicine.countDocuments({ status: 'Low Stock' }),
      LabOrder.countDocuments({ status: { $in: ['Ordered', 'Sample Collected', 'In Progress'] } }),
      Bill.aggregate([
        { $match: { status: 'Paid', updatedAt: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$paidAmount' } } },
      ]),
      Bill.aggregate([
        { $match: { status: 'Paid', updatedAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$paidAmount' } } },
      ]),
    ]);

    const revenueToday = todayPaidBills[0]?.total || 0;
    const revenueThisMonth = monthPaidBills[0]?.total || 0;

    return NextResponse.json({
      stats: {
        totalPatients,
        totalDoctors,
        todayAppointments,
        pendingBills,
        lowStockMedicines,
        pendingLabTests,
        revenueToday,
        revenueThisMonth,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
