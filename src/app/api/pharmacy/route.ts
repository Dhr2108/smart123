import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Medicine } from '@/models/Medicine';
import { generateId } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') filter.status = status;
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { medicineId: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
      ];
    }

    const medicines = await Medicine.find(filter).sort({ name: 1 }).lean();

    const transformed = medicines.map((m) => ({
      id: m.medicineId,
      name: m.name,
      genericName: m.genericName,
      category: m.category,
      manufacturer: m.manufacturer,
      batchNumber: m.batchNumber,
      expiryDate: m.expiryDate.toISOString().split('T')[0],
      quantity: m.quantity,
      unitPrice: m.unitPrice,
      reorderLevel: m.reorderLevel,
      location: m.location,
      status: m.status,
    }));

    return NextResponse.json({ medicines: transformed });
  } catch (error) {
    console.error('Get medicines error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const medicineId = generateId('MED');

    // Auto-determine status
    let status = 'In Stock';
    if (body.quantity === 0) status = 'Out of Stock';
    else if (body.quantity <= (body.reorderLevel || 50)) status = 'Low Stock';
    if (body.expiryDate && new Date(body.expiryDate) < new Date()) status = 'Expired';

    const medicine = await Medicine.create({
      medicineId,
      ...body,
      expiryDate: new Date(body.expiryDate),
      status,
    });

    return NextResponse.json({ medicine }, { status: 201 });
  } catch (error) {
    console.error('Create medicine error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
