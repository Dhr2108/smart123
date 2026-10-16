import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IMedicine extends Document {
  medicineId: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: Date;
  quantity: number;
  unitPrice: number;
  reorderLevel: number;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    medicineId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    genericName: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    manufacturer: { type: String, required: true },
    batchNumber: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    reorderLevel: { type: Number, required: true, default: 50 },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Expired'],
      default: 'In Stock',
    },
  },
  { timestamps: true }
);

MedicineSchema.index({ medicineId: 1 });
MedicineSchema.index({ name: 'text', genericName: 'text' });
MedicineSchema.index({ status: 1 });
MedicineSchema.index({ category: 1 });

export const Medicine: Model<IMedicine> =
  mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);
