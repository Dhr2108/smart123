import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { Medicine } from '@/models/Medicine';

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await _req.json();

    const updateData: Record<string, unknown> = { ...body };
    if (body.expiryDate) updateData.expiryDate = new Date(body.expiryDate);

    // Auto-update status based on quantity changes
    if (body.quantity !== undefined) {
      const medicine = await Medicine.findOne({ medicineId: id });
      if (!medicine) {
        return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
      }

      const qty = body.quantity;
      const reorderLevel = body.reorderLevel ?? medicine.reorderLevel;
      const expiry = body.expiryDate ? new Date(body.expiryDate) : medicine.expiryDate;

      if (expiry < new Date()) {
        updateData.status = 'Expired';
      } else if (qty === 0) {
        updateData.status = 'Out of Stock';
      } else if (qty <= reorderLevel) {
        updateData.status = 'Low Stock';
      } else {
        updateData.status = 'In Stock';
      }
    }

    const medicine = await Medicine.findOneAndUpdate(
      { medicineId: id },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!medicine) {
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json({ medicine });
  } catch (error) {
    console.error('Update medicine error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const medicine = await Medicine.findOneAndDelete({ medicineId: id });
    if (!medicine) {
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Delete medicine error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
