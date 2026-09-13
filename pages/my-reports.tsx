import { useState, useEffect, useRef } from 'react'
import Layout from '@/components/ui/Layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import gsap from 'gsap'

function MapPinIcon() {
  return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
}
function SearchIcon() {
  return <svg width="44" height="44" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" /></svg>
}
function CheckIcon({ size = 12 }: { size?: number }) {
  return <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
}
function SpinnerIcon() {
  return <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24"><circle opacity=".25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path opacity=".75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
}
function CloseIcon({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
}
function FileIcon() {
  return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h1m4-5H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /></svg>
}

const STORAGE_KEY = 'roadwatch_reports'

const statusLabels: Record<string, { label: string; dot: string }> = {
  new: { label: 'New — Awaiting Review', dot: '#DC2626' },
  under_review: { label: 'Under Review', dot: '#D97706' },
  assigned: { label: 'Assigned to Maintenance', dot: '#2563EB' },
  resolved: { label: 'Resolved', dot: '#059669' },
}

interface Report {
  reportId: string
  damageType: string
  severity: string
  confidence: number
  status: string
  imageUrl: string
  latitude: number
  longitude: number
  description?: string
  createdAt: string
  citizenEmail: string
}

interface StoredReport {
  reportId: string
  damageType: string
  severity: string
  status: string
  createdAt: string
  citizenEmail: string
}

export default function MyReportsPage() {
  const router = useRouter()
  const [reportId, setReportId] = useState(String(router.query.id || ''))
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [myReports, setMyReports] = useState<StoredReport[]>([])
  const scope = useRef<HTMLDivElement>(null)

  /* Load this device's report history from localStorage */
  useEffect(() => {
    try {
      setMyReports(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
    } catch { setMyReports([]) }
  }, [])

  /* Page entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.track-header > *', { y: 26, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.1 })
      gsap.from('.lookup-card', { y: 36, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 })
      gsap.from('.history-card', { y: 36, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.45 })
    }, scope)
    return () => ctx.revert()
  }, [])

  /* Result card entrance — runs whenever a report loads */
  useEffect(() => {
    if (!report) return
    const ctx = gsap.context(() => {
      gsap.from('.result-card', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' })
      gsap.from('.timeline-step', { x: -18, opacity: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out', delay: 0.3 })
    }, scope)
    return () => ctx.revert()
  }, [report])

  const lookupById = async (id: string) => {
    if (!id.trim()) return
    setLoading(true)
    setError('')
    setReport(null)
    try {
      const res = await fetch(`/api/reports/${id.trim()}`)
      if (!res.ok) throw new Error('Report not found. Check your reference number.')
      setReport(await res.json())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error looking up report')
    } finally {
      setLoading(false)
    }
  }

  const lookup = (e: React.FormEvent) => {
    e.preventDefault()
    lookupById(reportId)
  }

  const removeStored = (id: string) => {
    const next = myReports.filter(r => r.reportId !== id)
    setMyReports(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  const clearAll = () => {
    setMyReports([])
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  return (
    <Layout>
      <Head>
        <title>Track My Report — RoadWatch Nigeria</title>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Head>

      <div ref={scope} className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="track-header mb-8">
          <p className="eyebrow m-0">Report Tracking</p>
          <h1 className="m-0" style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.75rem', margin: '0.5rem 0 0.4rem', transition: 'color 0.25s' }}>Track My Report</h1>
          <p className="m-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter your report reference number to check its current status.</p>
        </div>

        {/* Search — kept exactly as before */}
        <form onSubmit={lookup} className="lookup-card card mb-6" style={{ padding: '1.5rem' }}>
          <label className="block mb-2" style={{ color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600 }}>Report Reference Number</label>
          <div className="flex gap-3">
            <input
              type="text"
              className="input flex-1"
              placeholder="e.g. RPT-M5X2K1-AB3C"
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
              {loading ? <SpinnerIcon /> : 'Search'}
            </button>
          </div>
          {error && <p className="m-0 mt-3" style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{error}</p>}
        </form>

        {/* ── My Reports — from this device's localStorage ── */}
        <div className="history-card card mb-6" style={{ padding: '1.25rem 1.5rem' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="m-0" style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem' }}>
              My Reports
              {myReports.length > 0 && (
                <span className="badge ml-2" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>{myReports.length}</span>
              )}
            </p>
            {myReports.length > 0 && (
              <button onClick={clearAll} className="bg-transparent border-0 cursor-pointer" style={{ color: 'var(--text-faint)', fontSize: '0.75rem', textDecoration: 'underline' }}>
                Clear all
              </button>
            )}
          </div>

          {myReports.length === 0 ? (
            <p className="m-0" style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>
              No reports on this device yet. Reports you submit will appear here automatically.
            </p>
          ) : (
            <div className="flex flex-col" style={{ gap: '0.5rem' }}>
              {myReports.map(r => (
                <div
                  key={r.reportId}
                  className="flex items-center"
                  style={{
                    gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: 10, cursor: 'pointer',
                    border: '1px solid var(--border)', background: 'var(--bg-muted)', transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--amber)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  onClick={() => { setReportId(r.reportId); lookupById(r.reportId) }}
                >
                  <span className="flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                    <FileIcon />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="m-0" style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem', color: '#3B82F6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.reportId}
                    </p>
                    <p className="m-0" style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.78rem', color: '#3B82F6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      For: {r.citizenEmail || 'Anonymous'} | Status: {statusLabels[r.status]?.label || r.status}
                    </p>
                    <p className="m-0" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {r.damageType?.replace(/_/g, ' ')} · {new Date(r.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`badge-${r.severity} flex-shrink-0`} style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 9999 }}>
                    {r.severity?.toUpperCase()}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeStored(r.reportId) }}
                    aria-label={`Remove ${r.reportId}`}
                    className="flex items-center justify-center flex-shrink-0 bg-transparent border-0 cursor-pointer"
                    style={{ width: 26, height: 26, borderRadius: 7, color: 'var(--text-faint)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; e.currentTarget.style.color = 'var(--danger)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-faint)' }}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {report && (
          <div className="result-card card overflow-hidden">
            {/* Image */}
            <div className="relative" style={{ height: 224, background: 'var(--bg-muted)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={report.imageUrl} alt="Damage report" className="w-full h-full object-cover" />
              <div className="absolute" style={{ top: 12, right: 12 }}>
                <span className="badge flex items-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <span className="inline-block" style={{ width: 8, height: 8, borderRadius: '50%', background: statusLabels[report.status]?.dot, marginRight: 6 }} />
                  <span style={{ color: 'var(--text)' }}>{statusLabels[report.status]?.label}</span>
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col" style={{ gap: '1rem' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="m-0 mb-1" style={{ fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>REPORT ID</p>
                  <p className="m-0" style={{ fontFamily: 'monospace', fontWeight: 700, color: '#3B82F6', fontSize: '1rem' }}>{report.reportId}</p>
                </div>
                <div className="text-right">
                  <p className="m-0 mb-1" style={{ fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>SUBMITTED</p>
                  <p className="m-0" style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{new Date(report.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div>
                  <p className="m-0 mb-1" style={{ fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>DAMAGE TYPE</p>
                  <p className="m-0" style={{ fontWeight: 600, color: 'var(--text)', textTransform: 'capitalize' }}>{report.damageType.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="m-0 mb-1" style={{ fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>SEVERITY</p>
                  <span className={`badge-${report.severity}`} style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 9999, display: 'inline-block' }}>
                    {report.severity?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="m-0 mb-1" style={{ fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>AI CONFIDENCE</p>
                  <p className="m-0" style={{ fontWeight: 600, color: 'var(--text)' }}>{(report.confidence * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="m-0 mb-1" style={{ fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>LOCATION</p>
                  <p className="m-0" style={{ fontSize: '0.8rem', color: 'var(--text)' }}>{report.latitude.toFixed(4)}° N, {report.longitude.toFixed(4)}° E</p>
                </div>
              </div>

              {report.description && (
                <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="m-0 mb-1" style={{ fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.04em' }}>YOUR DESCRIPTION</p>
                  <p className="m-0" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{report.description}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="m-0 mb-3" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>STATUS TIMELINE</p>
                <div className="flex flex-col" style={{ gap: '0.5rem' }}>
                  {['new', 'under_review', 'assigned', 'resolved'].map((s, i) => {
                    const statuses = ['new', 'under_review', 'assigned', 'resolved']
                    const currentIdx = statuses.indexOf(report.status)
                    const done = i <= currentIdx
                    const isLast = i === statuses.length - 1
                    return (
                      <div key={s} className="timeline-step flex items-center" style={{ gap: '0.75rem' }}>
                        <div
                          className="flex items-center justify-center flex-shrink-0"
                          style={{
                            width: 22, height: 22, borderRadius: '50%', fontSize: '0.7rem', fontWeight: 700,
                            background: done ? '#0F2137' : 'var(--bg-muted)',
                            color: done ? '#F59E0B' : 'var(--text-faint)',
                            border: done ? 'none' : '1.5px solid var(--border)',
                          }}
                        >
                          {done ? <CheckIcon size={11} /> : i + 1}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: done ? 600 : 400, color: done ? 'var(--text)' : 'var(--text-faint)' }}>
                          {statusLabels[s]?.label}
                        </span>
                        {done && !isLast && (
                          <span className="ml-auto" style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 9999, background: '#FEF3C7', color: '#92400E' }}>
                            {i < currentIdx ? 'DONE' : 'CURRENT'}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 no-underline"
                  style={{ color: 'var(--amber)', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  <MapPinIcon /> View on Google Maps →
                </a>
              </div>
            </div>
          </div>
        )}

        {!report && !loading && (
          <div className="text-center" style={{ padding: '3rem 0' }}>
            <div className="inline-flex items-center justify-center mb-4" style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
              <SearchIcon />
            </div>
            <p className="m-0 mb-2" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Enter your reference number above, or pick one from My Reports</p>
            <p className="m-0 mb-6" style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>Don&apos;t have a reference number? You&apos;ll receive one when you submit a report.</p>
            <Link href="/report" className="btn-primary">Submit a Report</Link>
          </div>
        )}
      </div>
    </Layout>
  )
}