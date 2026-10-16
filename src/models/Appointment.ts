import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IAppointment extends Document {
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
  duration: number;
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Telemedicine';
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  notes?: string;
  queuePosition?: number;
  estimatedWaitTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true, default: 30 },
    type: {
      type: String,
      required: true,
      enum: ['Consultation', 'Follow-up', 'Emergency', 'Telemedicine'],
      default: 'Consultation',
    },
    status: {
      type: String,
      required: true,
      enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
      default: 'Scheduled',
    },
    notes: { type: String },
    queuePosition: { type: Number },
    estimatedWaitTime: { type: Number },
  },
  { timestamps: true }
);

AppointmentSchema.index({ appointmentId: 1 });
AppointmentSchema.index({ patientId: 1 });
AppointmentSchema.index({ doctorId: 1 });
AppointmentSchema.index({ date: 1, doctorId: 1 });
AppointmentSchema.index({ status: 1 });

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
