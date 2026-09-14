import AdminLayout from '@/components/admin/AdminLayout'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import Report from '@/models/Report'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import ConfirmModal from '@/components/ui/ConfirmModal'

const ReportMap = dynamic(() => import('@/components/admin/ReportMap'), { ssr: false })

interface ReportData {
  reportId: string; imageUrl: string; latitude: number; longitude: number
  damageType: string; severity: string; confidence: number; status: string
  description?: string; citizenEmail?: string; reviewerNotes?: string
  createdAt: string; updatedAt: string
}

const STATUSES = ['new', 'under_review', 'assigned', 'resolved']
const statusLabels: Record<string, string> = {
  new: 'New', under_review: 'Under Review', assigned: 'Assigned', resolved: 'Resolved',
}

export default function ReportDetailPage({ report: initial }: { report: ReportData }) {
  const [report, setReport] = useState(initial)
  const [newStatus, setNewStatus] = useState(initial.status)
  const [notes, setNotes] = useState(initial.reviewerNotes || '')
  const [saving, setSaving] = useState(false)

  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const router = useRouter()

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/reports/${report.reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reviewerNotes: notes }),
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setReport(updated)
      toast.success('Report updated')
    } catch {
      toast.error('Failed to update report')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/reports/${report.reportId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('Report deleted')
      router.push('/admin/reports')
    } catch {
      toast.error('Failed to delete report')
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const severityColor = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' }[report.severity] || ''

  return (
    <AdminLayout title={`${report.reportId} — RoadWatch Admin`}>
      <div className="max-w-5xl space-y-6">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <Link href="/admin/reports" style={{ color: '#94A3B8', marginTop: 2, display: 'flex' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 style={{ color: '#0F2137', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'monospace' }}>
                {report.reportId}
              </h1>
              <p style={{ color: 'var(--text-muted, #64748B)', fontSize: '0.8rem', marginTop: 2 }}>
                Submitted {new Date(report.createdAt).toLocaleString('en-NG')}
              </p>
            </div>
            <span className={`badge-${report.status} text-sm px-3 py-1`}>{statusLabels[report.status]}</span>
          </div>

          {/* Delete button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.55rem 1rem',
              background: '#FEE2E2', color: '#DC2626',
              border: '1px solid #FECACA', borderRadius: 8,
              fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DC2626'; (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEE2E2'; (e.currentTarget as HTMLButtonElement).style.color = '#DC2626' }}
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Report
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left col */}
          <div className="space-y-5">
            {/* Photo */}
            <div className="card overflow-hidden">
              <div className="relative h-64 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={report.imageUrl} alt="Road damage" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`${severityColor} text-xs px-2.5 py-1`}>{report.severity?.toUpperCase()} SEVERITY</span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Damage Type</p>
                  <p className="font-semibold capitalize">{report.damageType.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">AI Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(report.confidence * 100).toFixed(0)}%` }} />
                    </div>
                    <span className="text-xs font-medium">{(report.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                {report.description && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">Citizen Description</p>
                    <p className="text-gray-700">{report.description}</p>
                  </div>
                )}
                {report.citizenEmail && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">Citizen Email</p>
                    <p className="text-gray-700">{report.citizenEmail}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="card overflow-hidden h-52">
              <ReportMap reports={[report]} />
            </div>
            <div className="text-center">
              <a
                href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                📍 Open in Google Maps — {report.latitude.toFixed(5)}° N, {report.longitude.toFixed(5)}° E
              </a>
            </div>
          </div>

          {/* Right col — actions */}
          <div className="space-y-5">
            {/* Status update */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Update Report Status</h2>
              <div className="space-y-3 mb-4">
                {STATUSES.map((s) => (
                  <label key={s} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${newStatus === s ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="status" value={s} checked={newStatus === s} onChange={() => setNewStatus(s)} className="text-blue-600" />
                    <div>
                      <p className={`text-sm font-medium badge-${s} inline-block mb-0.5`}>{statusLabels[s]}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Reviewer Notes</label>
                <textarea
                  className="input resize-none h-24"
                  placeholder="Add notes about this report (e.g. assigned to Awka South LGA Works, expected repair date)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <button onClick={save} disabled={saving} className="w-full btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Status timeline */}
            <div className="card p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Status Progress</h2>
              <div className="space-y-3">
                {STATUSES.map((s, i) => {
                  const currentIdx = STATUSES.indexOf(report.status)
                  const done = i <= currentIdx
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${done ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {done ? '✓' : i + 1}
                      </div>
                      <p className={`text-sm ${done ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{statusLabels[s]}</p>
                      {report.status === s && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Current</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Meta */}
            <div className="card p-5 text-sm space-y-2">
              <h2 className="font-semibold text-gray-900 mb-3">Report Details</h2>
              {[
                ['Report ID', report.reportId],
                ['Submitted', new Date(report.createdAt).toLocaleString('en-NG')],
                ['Last Updated', new Date(report.updatedAt).toLocaleString('en-NG')],
                ['GPS Latitude', `${report.latitude.toFixed(6)}°`],
                ['GPS Longitude', `${report.longitude.toFixed(6)}°`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-400">{k}</span>
                  <span className="text-gray-700 font-medium text-right max-w-[200px] truncate">{v}</span>
                </div>
              ))}
              {report.reviewerNotes && (
                <div className="pt-3 border-t">
                  <p className="text-gray-400 mb-1">Reviewer Notes</p>
                  <p className="text-gray-700">{report.reviewerNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={showDeleteModal}
        title="Delete this report?"
        message={`Report ${report.reportId} will be permanently removed from the database. This action cannot be undone.`}
        confirmLabel="Yes, Delete Report"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await connectDB()
  const report = await Report.findOne({ reportId: params?.id }).lean()
  if (!report) return { notFound: true }
  return { props: { report: JSON.parse(JSON.stringify(report)) } }
}
