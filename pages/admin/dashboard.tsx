import AdminLayout from '@/components/admin/AdminLayout'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const ReportMap = dynamic(() => import('@/components/admin/ReportMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-muted)', color: 'var(--text-faint)', fontSize: '0.875rem' }}>
      Loading map...
    </div>
  )
})

function TrendUpIcon() {
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
}
function ChartIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
}
function AlertIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" /></svg>
}
function ClockIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
}
function CheckCircleIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
function AlertTriangleIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.3 3.38c-.87 1.5.22 3.37 1.95 3.37h14.7c1.73 0 2.81-1.87 1.95-3.37L13.95 3.38c-.87-1.5-3.03-1.5-3.9 0L2.7 16.13zM12 15.75h.01" /></svg>
}

interface Stats {
  total: number; new: number; under_review: number; assigned: number; resolved: number
  high: number; medium: number; low: number
  recent: Array<{ reportId: string; damageType: string; severity: string; status: string; latitude: number; longitude: number; createdAt: string }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Reports', value: stats.total, sub: 'All time', icon: <ChartIcon />, color: '#0F2137', iconBg: 'rgba(100,116,139,0.12)', border: 'var(--border)' },
    { label: 'New', value: stats.new, sub: 'Awaiting review', icon: <AlertIcon />, color: '#DC2626', iconBg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.25)' },
    { label: 'Under Review', value: stats.under_review, sub: 'Being processed', icon: <ClockIcon />, color: '#D97706', iconBg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.25)' },
    { label: 'Resolved', value: stats.resolved, sub: 'Completed', icon: <CheckCircleIcon />, color: '#059669', iconBg: 'rgba(5,150,105,0.12)', border: 'rgba(5,150,105,0.25)' },
    { label: 'High Severity', value: stats.high, sub: 'Needs urgent action', icon: <AlertTriangleIcon />, color: '#DC2626', iconBg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.25)' },
  ] : []

  const statusLabels: Record<string, string> = { new: 'New', under_review: 'Under Review', assigned: 'Assigned', resolved: 'Resolved' }

  return (
    <AdminLayout title="Dashboard — RoadWatch">
      <div className="flex flex-col" style={{ gap: '1.5rem' }}>

        {/* Heading */}
        <div>
          <p className="eyebrow m-0">Overview</p>
          <h1 className="m-0" style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.2, margin: '0.5rem 0 0.25rem', transition: 'color 0.25s' }}>
            Dashboard
          </h1>
          <p className="m-0" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Road damage reports overview</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem' }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card" style={{ height: 108, animation: 'pulse 1.5s ease infinite' }} />
            ))
            : statCards.map(c => (
              <div key={c.label} className="card" style={{ border: `1px solid ${c.border}`, padding: '1.1rem 1.25rem' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                  <div className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, background: c.iconBg, color: c.color }}>
                    {c.icon}
                  </div>
                  <span style={{ color: 'var(--text-faint)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.04em' }}>{c.sub.toUpperCase()}</span>
                </div>
                <p className="m-0" style={{ color: 'var(--text)', fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, transition: 'color 0.25s' }}>{c.value}</p>
                <p className="m-0" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', marginTop: '0.3rem' }}>{c.label}</p>
              </div>
            ))
          }
        </div>

        {/* Map */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="flex items-center justify-between" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
            <div>
              <p className="m-0" style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem' }}>Report Map</p>
              <p className="m-0" style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginTop: '0.1rem' }}>All submitted damage reports</p>
            </div>
            <Link href="/admin/reports" className="no-underline flex items-center" style={{ color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 600, gap: '0.3rem' }}>
              View all <TrendUpIcon />
            </Link>
          </div>
          {/* Map legend */}
          <div className="flex flex-wrap" style={{ padding: '0.75rem 1.25rem', background: 'var(--bg-muted)', borderBottom: '1px solid var(--border)', gap: '1.5rem' }}>
            {[['#DC2626', 'New'], ['#D97706', 'Under Review'], ['#2563EB', 'Assigned'], ['#059669', 'Resolved']].map(([color, label]) => (
              <div key={label} className="flex items-center" style={{ gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                {label}
              </div>
            ))}
          </div>
          <div style={{ height: 420 }}>
            {stats?.recent
              ? <ReportMap reports={stats.recent} />
              : <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-muted)', color: 'var(--text-faint)', fontSize: '0.875rem' }}>Loading map...</div>}
          </div>
        </div>

        {/* Recent reports */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="flex items-center justify-between" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
            <p className="m-0" style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem' }}>Recent Reports</p>
            <Link href="/admin/reports" className="no-underline" style={{ color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 600 }}>See all</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full" style={{ borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-muted)' }}>
                  {['Report ID', 'Type', 'Severity', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="text-left" style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} style={{ padding: '0.75rem 1rem' }}><div style={{ height: 14, background: 'var(--bg-muted)', borderRadius: 4 }} /></td></tr>
                  ))
                  : stats?.recent.map(r => (
                    <tr
                      key={r.reportId}
                      style={{ borderTop: '1px solid var(--border)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-muted)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: '#3B82F6', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{r.reportId}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{r.damageType.replace(/_/g, ' ')}</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className={`badge-${r.severity}`} style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 9999, display: 'inline-block' }}>{r.severity?.toUpperCase()}</span></td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className={`badge-${r.status}`} style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 9999, display: 'inline-block' }}>{statusLabels[r.status]}</span></td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Link href={`/admin/reports/${r.reportId}`} className="no-underline" style={{ color: 'var(--amber)', fontWeight: 600, fontSize: '0.75rem' }}>View →</Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </AdminLayout>
  )
}