import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { LabOrder } from '@/models/Lab';

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await _req.json();

    const updateData: Record<string, unknown> = {};

    if (body.status) {
      updateData.status = body.status;
      if (body.status === 'Sample Collected') {
        updateData.collectedAt = new Date();
      } else if (body.status === 'Completed') {
        updateData.completedAt = new Date();
      }
    }

    if (body.tests) {
      updateData.tests = body.tests;
    }

    if (body.notes) {
      updateData.notes = body.notes;
    }

    const order = await LabOrder.findOneAndUpdate(
      { orderId: id },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: 'Lab order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Update lab order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
