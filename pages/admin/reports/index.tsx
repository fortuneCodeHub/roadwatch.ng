import AdminLayout from '@/components/admin/AdminLayout'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

interface Report {
  reportId: string; damageType: string; severity: string; status: string
  latitude: number; longitude: number; createdAt: string; confidence: number
}

const STATUSES = ['all', 'new', 'under_review', 'assigned', 'resolved']
const TYPES = ['all', 'pothole', 'longitudinal_crack', 'transverse_crack', 'alligator_crack']
const SEVERITIES = ['all', 'high', 'medium', 'low']

export default function ReportsListPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const [status, setStatus] = useState('all')
  const [damageType, setDamageType] = useState('all')
  const [severity, setSeverity] = useState('all')
  const [search, setSearch] = useState('')

  const load = useCallback(async (pg = 1) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(pg), limit: '20', status, damageType, severity })
    if (search) params.set('search', search)
    const res = await fetch(`/api/reports?${params}`)
    const data = await res.json()
    setReports(data.reports || [])
    setTotal(data.total || 0)
    setPage(data.page || 1)
    setPages(data.pages || 1)
    setLoading(false)
  }, [status, damageType, severity, search])

  useEffect(() => { load(1) }, [load])

  const exportCSV = () => {
    const headers = ['Report ID', 'Damage Type', 'Severity', 'Status', 'Latitude', 'Longitude', 'Confidence', 'Submitted']
    const rows = reports.map((r) => [
      r.reportId, r.damageType.replace(/_/g, ' '), r.severity, r.status,
      r.latitude, r.longitude, (r.confidence * 100).toFixed(0) + '%',
      new Date(r.createdAt).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `roadwatch-reports-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <AdminLayout title="All Reports — RoadWatch Admin">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} reports found</p>
          </div>
          <button onClick={exportCSV} className="btn-secondary text-sm py-2 px-4">
            ⬇ Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            className="input text-sm col-span-2 md:col-span-1"
            placeholder="Search by Report ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(1)}
          />
          <select className="input text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ')}</option>)}
          </select>
          <select className="input text-sm" value={damageType} onChange={(e) => setDamageType(e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t === 'all' ? 'All Types' : t.replace(/_/g, ' ')}</option>)}
          </select>
          <select className="input text-sm" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            {SEVERITIES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Severities' : s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  {['Report ID', 'Damage Type', 'Severity', 'Status', 'Confidence', 'Location', 'Date', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : reports.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No reports found</td></tr>
                ) : reports.map((r) => (
                  <tr key={r.reportId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-blue-800 whitespace-nowrap">{r.reportId}</td>
                    <td className="px-4 py-3 capitalize whitespace-nowrap">{r.damageType.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3"><span className={`badge-${r.severity}`}>{r.severity?.toUpperCase()}</span></td>
                    <td className="px-4 py-3"><span className={`badge-${r.status}`}>{r.status.replace(/_/g, ' ')}</span></td>
                    <td className="px-4 py-3 text-gray-600">{(r.confidence * 100).toFixed(0)}%</td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{r.latitude.toFixed(3)}° N</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/reports/${r.reportId}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <p className="text-sm text-gray-500">Page {page} of {pages}</p>
              <div className="flex gap-2">
                <button onClick={() => load(page - 1)} disabled={page <= 1} className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40">← Prev</button>
                <button onClick={() => load(page + 1)} disabled={page >= pages} className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40">Next →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
