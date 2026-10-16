import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IBillItem {
  _id?: unknown;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'Consultation' | 'Lab Test' | 'Medicine' | 'Procedure' | 'Room' | 'Other';
}

export interface IBill extends Document {
  billId: string;
  patientId: string;
  patientName: string;
  items: IBillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Paid' | 'Partial' | 'Cancelled' | 'Refunded';
  paymentMethod?: 'Cash' | 'Card' | 'Insurance' | 'Online' | 'UPI';
  paidAmount: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BillItemSchema = new Schema<IBillItem>(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Consultation', 'Lab Test', 'Medicine', 'Procedure', 'Room', 'Other'],
    },
  },
  { _id: true }
);

const BillSchema = new Schema<IBill>(
  {
    billId: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    items: [BillItemSchema],
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Partial', 'Cancelled', 'Refunded'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Insurance', 'Online', 'UPI'],
    },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

BillSchema.index({ billId: 1 });
BillSchema.index({ patientId: 1 });
BillSchema.index({ status: 1 });
BillSchema.index({ dueDate: 1 });

export const Bill: Model<IBill> = mongoose.models.Bill || mongoose.model<IBill>('Bill', BillSchema);
