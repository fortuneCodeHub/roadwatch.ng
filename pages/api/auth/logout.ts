import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'rdw_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax')
  return res.status(200).json({ message: 'Logged out' })
}
