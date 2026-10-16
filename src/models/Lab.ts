import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ILabTest extends Document {
  testId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  preparationInstructions?: string;
  reportTimeHours: number;
  status: 'Active' | 'Inactive';
}

export interface ILabOrderTest {
  testId: string;
  testName: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled' | 'Sample Collected';
  result?: string;
  referenceRange?: string;
  unit?: string;
}

export interface ILabOrder extends Document {
  orderId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  tests: ILabOrderTest[];
  status: 'Ordered' | 'Sample Collected' | 'In Progress' | 'Completed' | 'Cancelled';
  orderedAt: Date;
  collectedAt?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LabTestSchema = new Schema<ILabTest>(
  {
    testId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    preparationInstructions: { type: String },
    reportTimeHours: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const LabOrderTestSchema = new Schema<ILabOrderTest>(
  {
    testId: { type: String, required: true },
    testName: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled', 'Sample Collected'],
      default: 'Pending',
    },
    result: { type: String },
    referenceRange: { type: String },
    unit: { type: String },
  },
  { _id: false }
);

const LabOrderSchema = new Schema<ILabOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    tests: [LabOrderTestSchema],
    status: {
      type: String,
      enum: ['Ordered', 'Sample Collected', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Ordered',
    },
    orderedAt: { type: Date, required: true, default: Date.now },
    collectedAt: { type: Date },
    completedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

LabTestSchema.index({ testId: 1 });
LabTestSchema.index({ category: 1 });
LabOrderSchema.index({ orderId: 1 });
LabOrderSchema.index({ patientId: 1 });
LabOrderSchema.index({ status: 1 });

export const LabTest: Model<ILabTest> = mongoose.models.LabTest || mongoose.model<ILabTest>('LabTest', LabTestSchema);
export const LabOrder: Model<ILabOrder> = mongoose.models.LabOrder || mongoose.model<ILabOrder>('LabOrder', LabOrderSchema);
