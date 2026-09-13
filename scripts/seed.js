/**
 * Seed script — creates the initial admin user in MongoDB Atlas
 * Run: npx ts-node --project tsconfig.json scripts/seed.ts
 * Or:  node -r esbuild-register scripts/seed.ts
 */
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI || ''

async function seed() {
  if (!MONGODB_URI) {
    console.error('Set MONGODB_URI in .env.local first')
    process.exit(1)
  }

  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')

  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    name: { type: String, required: true },
  }, { timestamps: true })

  const User = mongoose.models.User || mongoose.model('User', UserSchema)

  const existing = await User.findOne({ email: 'admin@roadwatch.ng' })
  if (existing) {
    console.log('Admin user already exists:', existing.email)
  } else {
    const password = await bcrypt.hash('Admin@2026', 12)
    await User.create({ email: 'admin@roadwatch.ng', password, name: 'Admin', role: 'admin' })
    console.log('✅ Admin user created:')
    console.log('   Email:    admin@roadwatch.ng')
    console.log('   Password: Admin@2026')
    console.log('   Change this password after first login!')
  }

  await mongoose.disconnect()
}

seed().catch(console.error)
