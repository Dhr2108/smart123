import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Bill } from '@/models/Bill';
import { generateId } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const patientId = searchParams.get('patientId');

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (patientId) filter.patientId = patientId;
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { billId: { $regex: search, $options: 'i' } },
      ];
    }

    const bills = await Bill.find(filter).sort({ createdAt: -1 }).lean();

    const transformed = bills.map((b) => ({
      id: b.billId,
      patientId: b.patientId,
      patientName: b.patientName,
      items: b.items.map((item) => ({
        id: String(item._id || generateId('BI')),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        category: item.category,
      })),
      subtotal: b.subtotal,
      tax: b.tax,
      discount: b.discount,
      total: b.total,
      status: b.status,
      paymentMethod: b.paymentMethod,
      paidAmount: b.paidAmount,
      dueDate: b.dueDate.toISOString().split('T')[0],
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));

    return NextResponse.json({ bills: transformed });
  } catch (error) {
    console.error('Get bills error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const billId = generateId('BIL');

    // Calculate totals
    const items = body.items || [];
    const subtotal = items.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
    const tax = body.tax ?? subtotal * 0.1;
    const discount = body.discount ?? 0;
    const total = subtotal + tax - discount;

    const bill = await Bill.create({
      billId,
      patientId: body.patientId,
      patientName: body.patientName,
      items,
      subtotal,
      tax,
      discount,
      total,
      status: 'Pending',
      paidAmount: 0,
      dueDate: body.dueDate ? new Date(body.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return NextResponse.json({ bill }, { status: 201 });
  } catch (error) {
    console.error('Create bill error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
