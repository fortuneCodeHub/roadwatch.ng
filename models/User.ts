import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  email: string
  password: string
  role: 'admin'
  name: string
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin'], default: 'admin' },
    name: { type: String, required: true },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12)
  }
})

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
