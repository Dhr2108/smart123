import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Patient } from '@/models/Patient';
import { generateId } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Patient.countDocuments(filter),
    ]);

    // Transform to match frontend types
    const transformed = patients.map((p) => ({
      id: p.patientId,
      name: p.name,
      email: p.email,
      phone: p.phone,
      dateOfBirth: p.dateOfBirth.toISOString().split('T')[0],
      gender: p.gender,
      bloodGroup: p.bloodGroup,
      address: p.address,
      emergencyContact: p.emergencyContact,
      insuranceProvider: p.insuranceProvider,
      insuranceNumber: p.insuranceNumber,
      status: p.status,
      medicalHistory: p.medicalHistory,
      allergies: p.allergies,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      patients: transformed,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get patients error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const patientId = generateId('PAT');

    const patient = await Patient.create({
      patientId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      dateOfBirth: new Date(body.dateOfBirth),
      gender: body.gender,
      bloodGroup: body.bloodGroup,
      address: body.address,
      emergencyContact: body.emergencyContact,
      insuranceProvider: body.insuranceProvider,
      insuranceNumber: body.insuranceNumber,
      status: body.status || 'Active',
      medicalHistory: body.medicalHistory || [],
      allergies: body.allergies || [],
    });

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
