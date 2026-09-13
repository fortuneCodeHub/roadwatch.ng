import mongoose, { Schema, Document } from 'mongoose'
import { nanoid } from 'nanoid'

export interface IReport extends Document {
  reportId: string
  imageUrl: string
  latitude: number
  longitude: number
  damageType: 'pothole' | 'longitudinal_crack' | 'transverse_crack' | 'alligator_crack' | 'no_damage_detected'
  severity: 'low' | 'medium' | 'high' | null
  confidence: number
  status: 'new' | 'under_review' | 'assigned' | 'resolved'
  description?: string
  citizenEmail?: string
  reviewerNotes?: string
  submittedAt: Date
  updatedAt: Date
}

const ReportSchema = new Schema<IReport>(
  {
    reportId: {
      type: String,
      default: () => `RPT-${Date.now().toString(36).toUpperCase()}-${nanoid(4).toUpperCase()}`,
      unique: true,
      index: true,
    },
    imageUrl: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    damageType: {
      type: String,
      enum: ['pothole', 'longitudinal_crack', 'transverse_crack', 'alligator_crack', 'no_damage_detected'],
      required: true,
    },
    severity: { type: String, enum: ['low', 'medium', 'high', null], default: null },
    confidence: { type: Number, min: 0, max: 1, default: 0 },
    status: {
      type: String,
      enum: ['new', 'under_review', 'assigned', 'resolved'],
      default: 'new',
    },
    description: { type: String, maxlength: 500 },
    citizenEmail: { type: String },
    reviewerNotes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema)
