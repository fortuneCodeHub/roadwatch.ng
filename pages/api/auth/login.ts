import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/mongodb'
import { signToken } from '@/lib/auth'
import User from '@/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  await connectDB()

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await user.comparePassword(password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  const token = await signToken({ userId: user._id.toString(), email: user.email, role: user.role })

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `rdw_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${secure}`)

  return res.status(200).json({ message: 'Login successful', user: { email: user.email, name: user.name } })
}
