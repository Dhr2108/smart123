import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IPatient extends Document {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  status: 'Active' | 'Inactive' | 'Discharged';
  medicalHistory?: string[];
  allergies?: string[];
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    patientId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String, required: true },
    address: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    insuranceProvider: { type: String },
    insuranceNumber: { type: String },
    status: { type: String, enum: ['Active', 'Inactive', 'Discharged'], default: 'Active' },
    medicalHistory: [{ type: String }],
    allergies: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

PatientSchema.index({ patientId: 1 });
PatientSchema.index({ name: 'text', email: 'text' });
PatientSchema.index({ status: 1 });

export const Patient: Model<IPatient> = mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
