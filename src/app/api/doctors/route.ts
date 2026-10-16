import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Doctor } from '@/models/Doctor';
import { generateId } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const specialization = searchParams.get('specialization');

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (department && department !== 'all') filter.department = department;
    if (specialization && specialization !== 'all') filter.specialization = specialization;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { doctorId: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    const doctors = await Doctor.find(filter).sort({ name: 1 }).lean();

    const transformed = doctors.map((d) => ({
      id: d.doctorId,
      name: d.name,
      email: d.email,
      phone: d.phone,
      specialization: d.specialization,
      department: d.department,
      qualification: d.qualification,
      experience: d.experience,
      consultationFee: d.consultationFee,
      availability: d.availability,
      status: d.status,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    }));

    return NextResponse.json({ doctors: transformed });
  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const doctorId = generateId('DOC');

    const doctor = await Doctor.create({
      doctorId,
      ...body,
    });

    return NextResponse.json({ doctor }, { status: 201 });
  } catch (error) {
    console.error('Create doctor error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
