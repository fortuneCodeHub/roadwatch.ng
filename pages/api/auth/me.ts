import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.rdw_token
  if (!token) return res.status(401).json({ error: 'Not authenticated' })
  const payload = await verifyToken(token)
  if (!payload) return res.status(401).json({ error: 'Invalid or expired session' })
  return res.status(200).json({ user: payload })
}
