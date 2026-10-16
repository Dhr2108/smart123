import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IDoctorAvailability {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface IDoctor extends Document {
  doctorId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  department: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  availability: IDoctorAvailability[];
  status: 'Active' | 'Inactive' | 'On Leave';
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorAvailabilitySchema = new Schema<IDoctorAvailability>(
  {
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const DoctorSchema = new Schema<IDoctor>(
  {
    doctorId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    department: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: Number, required: true },
    consultationFee: { type: Number, required: true },
    availability: [DoctorAvailabilitySchema],
    status: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

DoctorSchema.index({ doctorId: 1 });
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ department: 1 });
DoctorSchema.index({ status: 1 });

export const Doctor: Model<IDoctor> = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
