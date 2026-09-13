import { useState, useRef, useCallback, useEffect } from 'react'
import Layout from '@/components/ui/Layout'
import Head from 'next/head'
import toast from 'react-hot-toast'
import Link from 'next/link'
import gsap from 'gsap'

/* Standard "upload your image" illustration — no emojis, pure SVG */
function UploadIllustration() {
  return (
    <svg width="130" height="96" viewBox="0 0 130 96" fill="none" aria-hidden="true">
      {/* Back card */}
      <rect x="18" y="14" width="72" height="56" rx="8" fill="var(--bg-muted)" stroke="var(--border)" strokeWidth="1.5" transform="rotate(-6 18 14)" />
      {/* Front card */}
      <rect x="34" y="20" width="72" height="56" rx="8" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="1.5" />
      {/* Mountain scene */}
      <path d="M42 66l14-18 10 12 8-9 16 15" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="52" cy="34" r="4" fill="#F59E0B" opacity="0.85" />
      {/* Upload arrow */}
      <circle cx="98" cy="26" r="16" fill="#F59E0B" />
      <path d="M98 33V19M92.5 24.5L98 19l5.5 5.5" stroke="#0F2137" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
function LocationIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
}
function CheckCircleIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
function ArrowRight() {
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
}
function SpinnerIcon() {
  return <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" fill="none" viewBox="0 0 24 24"><circle opacity=".25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path opacity=".75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
}
function CloseIcon() {
  return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
}

interface GeoPos { lat: number; lng: number }
interface Result { reportId: string; damageType: string; severity: string; confidence: number; status: string; citizenEmail?: string }

const STORAGE_KEY = 'roadwatch_reports'

function saveReportToStorage(data: Result) {
  try {
    const stored: Array<Record<string, string>> = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    stored.unshift({
      reportId: data.reportId,
      damageType: data.damageType,
      severity: data.severity,
      status: data.status,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored.slice(0, 50)))
  } catch { /* storage unavailable — non-fatal */ }
}

export default function ReportPage() {
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [gps, setGps] = useState<GeoPos | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const [description, setDescription] = useState('')
  const [citizenEmail, setCitizenEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const scope = useRef<HTMLDivElement>(null)

  /* Entrance animations for the form */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.report-header > *', { y: 26, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.1 })
      gsap.from('.report-card', { y: 44, opacity: 0, duration: 0.7, stagger: 0.14, ease: 'power3.out', delay: 0.25 })
      gsap.from('.report-submit', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.7 })
    }, scope)
    return () => ctx.revert()
  }, [])

  /* Entrance animation for the success screen */
  useEffect(() => {
    if (!result) return
    const ctx = gsap.context(() => {
      gsap.from('.success-el', { y: 28, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
    }, scope)
    return () => ctx.revert()
  }, [result])

  const handlePhoto = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return toast.error('Only JPEG, PNG, or WebP allowed')
    if (file.size > 10 * 1024 * 1024) return toast.error('Image must be under 10MB')
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handlePhoto(file)
  }, [])

  const getGPS = () => {
    setGpsLoading(true); setGpsError('')
    if (!navigator.geolocation) { setGpsError('Geolocation not supported'); setGpsLoading(false); return }
    navigator.geolocation.getCurrentPosition(
      pos => { setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGpsLoading(false); toast.success('Location captured') },
      err => { setGpsError(`Could not get location: ${err.message}`); setGpsLoading(false) },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photo) return toast.error('Please select a photo')
    if (!gps) return toast.error('Please capture your GPS location')
    const fd = new FormData()
    fd.append('photo', photo)
    fd.append('latitude', String(gps.lat))
    fd.append('longitude', String(gps.lng))
    if (description) fd.append('description', description)
    if (citizenEmail) fd.append('citizenEmail', citizenEmail)
    setSubmitting(true)
    try {
      const res = await fetch('/api/reports', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setResult(data)
      saveReportToStorage(data)
      toast.success('Report submitted!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => { setResult(null); setPhoto(null); setPreview(null); setGps(null); setDescription(''); setCitizenEmail('') }

  if (result) {
    return (
      <Layout>
        <div ref={scope} className="flex items-center justify-center" style={{ minHeight: '80vh', padding: '2rem', background: 'var(--bg-muted)', transition: 'background 0.25s' }}>
          <div className="card success-el" style={{ maxWidth: 460, width: '100%', padding: '2.5rem', textAlign: 'center' }}>
            <div className="success-el flex items-center justify-center" style={{ width: 56, height: 56, background: 'var(--success-bg)', border: `1px solid var(--success-border)`, borderRadius: '50%', margin: '0 auto 1.5rem', color: 'var(--success)' }}>
              <CheckCircleIcon />
            </div>
            <h1 className="success-el m-0" style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Report Submitted</h1>
            <p className="success-el m-0" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>Your report has been forwarded to the relevant road agency.</p>

            <div className="success-el" style={{ background: 'var(--bg-muted)', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              {[
                ['Reference No.', result.reportId],
                ['Damage Type', result.damageType.replace(/_/g, ' ')],
                ['Confidence', `${(result.confidence * 100).toFixed(0)}%`],
                ['Citizen Email', result.citizenEmail || 'Anonymous'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{k}</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between" style={{ padding: '0.5rem 0' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Severity</span>
                <span className={`badge-${result.severity}`} style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 9999, display: 'inline-block' }}>
                  {result.severity?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="success-el flex flex-col" style={{ gap: '0.75rem' }}>
              <button onClick={reset} className="btn-primary" style={{ justifyContent: 'center' }}>Submit Another Report</button>
              <Link href={`/my-reports?id=${result.reportId}`} className="btn-ghost" style={{ justifyContent: 'center' }}>Track This Report <ArrowRight /></Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const stepDone = (n: number) => n === 1 ? !!photo : n === 2 ? !!gps : false

  return (
    <Layout>
      <Head>
        <title>Report Road Damage — RoadWatch Nigeria</title>
      </Head>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div ref={scope} style={{ background: 'var(--bg-muted)', minHeight: '100vh', padding: '2.5rem 0', transition: 'background 0.25s' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 1rem' }}>

          {/* Header */}
          <div className="report-header" style={{ marginBottom: '2rem' }}>
            <p className="eyebrow m-0">Citizen Report</p>
            <h1 className="m-0" style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.75rem', margin: '0.5rem 0 0.4rem', transition: 'color 0.25s' }}>Report Road Damage</h1>
            <p className="m-0" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Takes less than 2 minutes. No registration required.</p>
          </div>

          {/* Progress */}
          <div className="report-card flex" style={{ gap: '0.5rem', marginBottom: '1.75rem' }}>
            {['Photo', 'Location', 'Details'].map((s, i) => (
              <div key={s} title={s} style={{ flex: 1, height: 4, borderRadius: 2, transition: 'background 0.3s', background: stepDone(i + 1) ? 'var(--amber)' : 'var(--border)' }} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '1.25rem' }}>

            {/* Step 1 */}
            <div className="report-card card" style={{ padding: '1.5rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <h2 className="m-0" style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.95rem' }}>Step 1 — Upload Photo</h2>
                {photo && <span className="flex items-center" style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600, gap: '0.3rem' }}><CheckCircleIcon /> Done</span>}
              </div>

              {preview ? (
                <div className="relative" style={{ height: 220, borderRadius: 10, overflow: 'hidden', marginBottom: '0.75rem' }}>
                  {/* Plain <img> required — Next.js <Image> blocks blob: URLs */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <button type="button" onClick={() => { setPhoto(null); setPreview(null) }}
                    aria-label="Remove photo"
                    style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(10,25,41,0.75)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <div
                  style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onClick={() => fileRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--amber)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <div className="flex justify-center" style={{ marginBottom: '0.75rem' }}>
                    <UploadIllustration />
                  </div>
                  <p className="m-0" style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Drag and drop or click to upload</p>
                  <p className="m-0" style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>JPEG, PNG, WebP — max 10MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} capture="environment" />
              {!preview && (
                <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
                  Choose Photo
                </button>
              )}
            </div>

            {/* Step 2 */}
            <div className="report-card card" style={{ padding: '1.5rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <h2 className="m-0" style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.95rem' }}>Step 2 — Capture Location</h2>
                {gps && <span className="flex items-center" style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600, gap: '0.3rem' }}><CheckCircleIcon /> Done</span>}
              </div>

              {gps ? (
                <div className="flex items-center justify-between" style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 8, padding: '0.875rem 1rem' }}>
                  <div className="flex items-center" style={{ gap: '0.6rem', color: 'var(--success)' }}>
                    <LocationIcon />
                    <div>
                      <p className="m-0" style={{ fontWeight: 600, fontSize: '0.8rem' }}>Location captured</p>
                      <p className="m-0" style={{ fontSize: '0.75rem', opacity: 0.8 }}>{gps.lat.toFixed(5)}° N, {gps.lng.toFixed(5)}° E</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setGps(null)} style={{ background: 'none', border: 'none', color: 'var(--success)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>Reset</button>
                </div>
              ) : (
                <>
                  <button type="button" onClick={getGPS} disabled={gpsLoading} className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                    {gpsLoading ? <><SpinnerIcon /> Getting location...</> : <><LocationIcon /> Capture My Location</>}
                  </button>
                  {gpsError && <p className="m-0" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.6rem' }}>{gpsError}</p>}
                  <p className="m-0" style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginTop: '0.6rem' }}>Your browser will request location permission. This routes your report to the correct authority.</p>
                </>
              )}
            </div>

            {/* Step 3 */}
            <div className="report-card card" style={{ padding: '1.5rem' }}>
              <h2 className="m-0" style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>Step 3 — Optional Details</h2>
              <div className="flex flex-col" style={{ gap: '1rem' }}>
                <div>
                  <label className="block" style={{ color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>Description</label>
                  <textarea className="input" style={{ resize: 'none', height: 88 }} placeholder="Describe the damage briefly, e.g. large pothole on right lane, very dangerous at night" maxLength={500} value={description} onChange={e => setDescription(e.target.value)} />
                  <p className="m-0" style={{ color: 'var(--text-faint)', fontSize: '0.7rem', marginTop: '0.25rem' }}>{description.length}/500</p>
                </div>
                <div>
                  <label className="block" style={{ color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>Your Email <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(optional — for status updates)</span></label>
                  <input type="email" className="input" placeholder="you@example.com" value={citizenEmail} onChange={e => setCitizenEmail(e.target.value)} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={submitting || !photo || !gps} className="report-submit btn-primary" style={{ justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem', opacity: (!photo || !gps) ? 0.5 : 1 }}>
              {submitting ? <><SpinnerIcon /> Uploading and analysing...</> : <>Submit Report <ArrowRight /></>}
            </button>
            {(!photo || !gps) && (
              <p className="m-0 text-center" style={{ color: 'var(--text-faint)', fontSize: '0.8rem' }}>
                {!photo && !gps ? 'Photo and location required' : !photo ? 'Photo required' : 'Location required'}
              </p>
            )}
          </form>
        </div>
      </div>
    </Layout>
  )
}