import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { Bill } from '@/models/Bill';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const bill = await Bill.findOne({ billId: id }).lean();
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    return NextResponse.json({ bill });
  } catch (error) {
    console.error('Get bill error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await _req.json();

    // Handle payment updates
    if (body.paymentAmount) {
      const bill = await Bill.findOne({ billId: id });
      if (!bill) {
        return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
      }

      bill.paidAmount += body.paymentAmount;
      if (body.paymentMethod) bill.paymentMethod = body.paymentMethod;

      if (bill.paidAmount >= bill.total) {
        bill.status = 'Paid';
        bill.paidAmount = bill.total;
      } else if (bill.paidAmount > 0) {
        bill.status = 'Partial';
      }

      await bill.save();
      return NextResponse.json({ bill });
    }

    // General update
    const updateData: Record<string, unknown> = { ...body };
    if (body.dueDate) updateData.dueDate = new Date(body.dueDate);

    const bill = await Bill.findOneAndUpdate(
      { billId: id },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    return NextResponse.json({ bill });
  } catch (error) {
    console.error('Update bill error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
