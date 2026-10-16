import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Appointment } from '@/models/Appointment';
import { generateId } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    const date = searchParams.get('date');

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.type = type;
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;
    if (date) {
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      filter.date = { $gte: dateStart, $lte: dateEnd };
    }
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { doctorName: { $regex: search, $options: 'i' } },
        { appointmentId: { $regex: search, $options: 'i' } },
      ];
    }

    const appointments = await Appointment.find(filter).sort({ date: -1, time: 1 }).lean();

    const transformed = appointments.map((a) => ({
      id: a.appointmentId,
      patientId: a.patientId,
      patientName: a.patientName,
      doctorId: a.doctorId,
      doctorName: a.doctorName,
      date: a.date.toISOString().split('T')[0],
      time: a.time,
      duration: a.duration,
      type: a.type,
      status: a.status,
      notes: a.notes,
      queuePosition: a.queuePosition,
      estimatedWaitTime: a.estimatedWaitTime,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));

    return NextResponse.json({ appointments: transformed });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Check for conflicting appointments
    const dateStart = new Date(body.date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(body.date);
    dateEnd.setHours(23, 59, 59, 999);

    const conflict = await Appointment.findOne({
      doctorId: body.doctorId,
      date: { $gte: dateStart, $lte: dateEnd },
      time: body.time,
      status: { $nin: ['Cancelled', 'No Show'] },
    });

    if (conflict) {
      return NextResponse.json(
        { error: 'This time slot is already booked for this doctor' },
        { status: 409 }
      );
    }

    const appointmentId = generateId('APT');

    const appointment = await Appointment.create({
      appointmentId,
      patientId: body.patientId,
      patientName: body.patientName,
      doctorId: body.doctorId,
      doctorName: body.doctorName,
      date: new Date(body.date),
      time: body.time,
      duration: body.duration || 30,
      type: body.type || 'Consultation',
      status: 'Scheduled',
      notes: body.notes,
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
