import type { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/lib/mongodb'
import Report from '@/models/Report'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  await connectDB()

  const [total, byStatus, bySeverity, byType, recent] = await Promise.all([
    Report.countDocuments(),
    Report.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Report.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
    Report.aggregate([{ $group: { _id: '$damageType', count: { $sum: 1 } } }]),
    Report.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])

  const statusMap: Record<string, number> = {}
  byStatus.forEach((s: { _id: string; count: number }) => { statusMap[s._id] = s.count })

  const severityMap: Record<string, number> = {}
  bySeverity.forEach((s: { _id: string; count: number }) => { severityMap[s._id] = s.count })

  return res.status(200).json({
    total,
    new: statusMap.new || 0,
    under_review: statusMap.under_review || 0,
    assigned: statusMap.assigned || 0,
    resolved: statusMap.resolved || 0,
    high: severityMap.high || 0,
    medium: severityMap.medium || 0,
    low: severityMap.low || 0,
    byType,
    recent,
  })
}
