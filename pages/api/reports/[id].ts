import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/mongodb'
import { sendCitizenUpdate } from '@/lib/email'
import Report from '@/models/Report'
import { v2 as cloudinary } from 'cloudinary'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB()
  const { id } = req.query

  const report = await Report.findOne({ reportId: id }).lean()
  if (!report) return res.status(404).json({ error: 'Report not found' })

  // ── GET ────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    return res.status(200).json(report)
  }

  // ── PATCH ──────────────────────────────────────────────────────────────
  if (req.method === 'PATCH') {
    const { status, reviewerNotes } = req.body
    const update: Record<string, unknown> = {}
    if (status) update.status = status
    if (reviewerNotes !== undefined) update.reviewerNotes = reviewerNotes

    const updated = await Report.findOneAndUpdate(
      { reportId: id },
      { $set: update },
      { new: true }
    ).lean()

    const r = report as { citizenEmail?: string; status?: string }
    if (status && r.citizenEmail && status !== r.status) {
      sendCitizenUpdate(r.citizenEmail, String(id), status).catch(console.error)
    }

    return res.status(200).json(updated)
  }

  // ── DELETE ─────────────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const r = report as { imageUrl?: string }
    if (r.imageUrl) {
      const publicId = r.imageUrl.split('/').slice(-2).join('/').replace(/\.[^.]+$/, '')
      cloudinary.uploader.destroy(publicId).catch(console.error)
    }
    await Report.deleteOne({ reportId: id })
    return res.status(200).json({ message: `Report ${id} deleted successfully` })
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
  res.status(405).json({ error: 'Method not allowed' })
}