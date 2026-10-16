import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { LabTest, LabOrder } from '@/models/Lab';
import { generateId } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource') || 'orders';
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    if (resource === 'tests') {
      const filter: Record<string, unknown> = {};
      if (status && status !== 'all') filter.status = status;
      if (category && category !== 'all') filter.category = category;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { testId: { $regex: search, $options: 'i' } },
        ];
      }

      const tests = await LabTest.find(filter).sort({ name: 1 }).lean();
      const transformed = tests.map((t) => ({
        id: t.testId,
        name: t.name,
        category: t.category,
        description: t.description,
        price: t.price,
        preparationInstructions: t.preparationInstructions,
        reportTimeHours: t.reportTimeHours,
        status: t.status,
      }));

      return NextResponse.json({ tests: transformed });
    }

    // Orders
    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { doctorName: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await LabOrder.find(filter).sort({ orderedAt: -1 }).lean();
    const transformed = orders.map((o) => ({
      id: o.orderId,
      patientId: o.patientId,
      patientName: o.patientName,
      doctorId: o.doctorId,
      doctorName: o.doctorName,
      tests: o.tests,
      status: o.status,
      orderedAt: o.orderedAt.toISOString(),
      collectedAt: o.collectedAt?.toISOString(),
      completedAt: o.completedAt?.toISOString(),
      notes: o.notes,
    }));

    return NextResponse.json({ orders: transformed });
  } catch (error) {
    console.error('Get lab error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const orderId = generateId('LO');

    const order = await LabOrder.create({
      orderId,
      patientId: body.patientId,
      patientName: body.patientName,
      doctorId: body.doctorId,
      doctorName: body.doctorName,
      tests: body.tests || [],
      status: 'Ordered',
      orderedAt: new Date(),
      notes: body.notes,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Create lab order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
