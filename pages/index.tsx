import { useEffect, useRef } from 'react'
import Layout from '@/components/ui/Layout'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

// ── SVG Icons ────────────────────────────────────────────────────────────
function CameraIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}
function MapPinIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
function CpuIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
    </svg>
  )
}
function BellIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}
function AlertCircleIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
    </svg>
  )
}
function ZapIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}
function GridIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
function ArrowRightIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}
function EyeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────
const stats = [
  { label: 'Road Network (km)', value: '195,000+' },
  { label: 'Reports This Month', value: '2,400+' },
  { label: 'Defects Resolved', value: '1,800+' },
  { label: 'States Covered', value: '36' },
]

const steps = [
  { Icon: CameraIcon, title: 'Photograph the Damage', desc: 'Open the app and take a clear photo of the road defect using your smartphone.' },
  { Icon: MapPinIcon, title: 'GPS is Captured Automatically', desc: 'Your exact location is recorded automatically. No manual entry needed.' },
  { Icon: CpuIcon, title: 'AI Classifies the Defect', desc: 'Our computer vision model identifies the damage type and severity within seconds.' },
  { Icon: BellIcon, title: 'Agency is Notified', desc: 'The relevant road management agency receives an instant notification and your report.' },
]

const damageTypes = [
  { name: 'Pothole', Icon: AlertCircleIcon },
  { name: 'Longitudinal Crack', Icon: ZapIcon },
  { name: 'Transverse Crack', Icon: ZapIcon },
  { name: 'Alligator Crack', Icon: GridIcon },
]

// ── Page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroBadgeRef = useRef<HTMLDivElement>(null)
  const heroH1Ref = useRef<HTMLHeadingElement>(null)
  const heroParaRef = useRef<HTMLParagraphElement>(null)
  const heroBtnsRef = useRef<HTMLDivElement>(null)
  const heroImgRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const aiSectionRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamically import GSAP so SSR is not affected
    const initGSAP = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Hero — staggered entrance (fromTo guarantees a defined end state)
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .fromTo(heroBadgeRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 })
        .fromTo(heroH1Ref.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.3')
        .fromTo(heroParaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.35')
        .fromTo(heroBtnsRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo(heroImgRef.current, { opacity: 0, x: 40, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 0.75 }, '-=0.55')

      // Stats — fade up on scroll
      gsap.fromTo(
        statsRef.current?.querySelectorAll('.stat-item') ?? [],
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true } }
      )

      // How it works cards
      gsap.fromTo(
        stepsRef.current?.querySelectorAll('.step-card') ?? [],
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 80%', once: true } }
      )

      // AI section
      gsap.fromTo(
        aiSectionRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: aiSectionRef.current, start: 'top 80%', once: true } }
      )

      // Testimonials
      gsap.fromTo(
        testimonialsRef.current?.querySelectorAll('.testimonial-card') ?? [],
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.13, ease: 'power2.out',
          scrollTrigger: { trigger: testimonialsRef.current, start: 'top 82%', once: true } }
      )
    }

    initGSAP()
  }, [])

  return (
    <Layout>
      <Head>
        <title>RoadWatch Nigeria — Report Road Damage</title>
        <meta name="description" content="Crowd-sourced road damage detection and reporting system for Nigeria. Report potholes, cracks, and road defects using your smartphone." />
      </Head>

      {/* ── HERO ── theme colors come from --hero-* variables in globals.css */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'var(--hero-bg)', minHeight: '90vh', display: 'flex', alignItems: 'center', transition: 'background 0.25s' }}
      >
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=80"
            alt="Nigerian road"
            fill
            className="object-cover"
            style={{ opacity: 'var(--hero-img-opacity)' }}
            priority
          />
        </div>

        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Amber radial glow */}
        <div className="absolute pointer-events-none" style={{
          top: '-8%', right: '8%', width: 560, height: 560,
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="hero-grid">

            {/* LEFT — text */}
            <div style={{ maxWidth: 560 }}>
              <div ref={heroBadgeRef} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full mb-6" style={{
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.28)',
                color: '#F59E0B',
              }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#F59E0B', flexShrink: 0 }} />
                Powered by YOLOv8 Computer Vision
              </div>

              <h1 ref={heroH1Ref} className="font-bold leading-tight mb-6" style={{
                color: 'var(--hero-heading)',
                fontSize: 'clamp(2rem, 4.8vw, 3.5rem)',
                transition: 'color 0.25s',
              }}>
                Help Fix Nigeria&apos;s Roads.{' '}
                <span style={{ color: '#F59E0B' }}>One Report at a Time.</span>
              </h1>

              <p ref={heroParaRef} className="leading-relaxed mb-10" style={{
                color: 'var(--hero-para)',
                fontSize: '1.05rem',
                maxWidth: 480,
                transition: 'color 0.25s',
              }}>
                Photograph a road defect, submit a report, and our AI instantly classifies the
                damage and alerts the relevant road agency. Together we build safer roads.
              </p>

              <div ref={heroBtnsRef} className="flex flex-col sm:flex-row gap-4">
                <Link href="/report" className="btn-primary text-center text-base px-7 py-3.5 inline-flex items-center gap-2">
                  <CameraIcon size={18} />
                  Report Road Damage
                </Link>
                <Link href="/my-reports" className="btn-white text-center text-base px-7 py-3.5 inline-flex items-center gap-2">
                  <EyeIcon size={16} />
                  Track My Reports
                </Link>
              </div>
            </div>

            {/* RIGHT — road damage photo */}
            <div ref={heroImgRef} className="hero-right" style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 20, overflow: 'hidden', position: 'relative', height: 420,
                boxShadow: '0 32px 80px rgba(0,0,0,0.45)', border: '1px solid var(--hero-card-border)',
                transition: 'border-color 0.25s',
              }}>
                <Image
                  src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80"
                  alt="Road damage detected by AI"
                  fill
                  className="object-cover"
                />
                <div className="absolute" style={{ bottom: 0, left: 0, right: 0, height: '55%', background: 'var(--hero-overlay-gradient)' }} />
                {/* AI overlay */}
                <div style={{
                  position: 'absolute', bottom: 16, left: 16, right: 16,
                  background: 'var(--hero-overlay-bg)',
                  backdropFilter: 'blur(14px)',
                  borderRadius: 12, padding: '14px 16px',
                  border: '1px solid var(--hero-overlay-border)',
                  transition: 'background 0.25s, border-color 0.25s',
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="m-0" style={{ color: 'var(--hero-overlay-sub)', fontSize: '0.68rem', marginBottom: 2 }}>AI Detection Result</p>
                      <p className="m-0" style={{ color: 'var(--hero-overlay-text)', fontWeight: 700, fontSize: '0.95rem' }}>Pothole Detected</p>
                    </div>
                    <span style={{ background: '#EF4444', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>HIGH</span>
                  </div>
                  <div style={{ background: 'var(--hero-overlay-track)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                    <div style={{ background: '#10B981', height: '100%', width: '87%', borderRadius: 4 }} />
                  </div>
                  <p className="m-0" style={{ color: 'var(--hero-overlay-sub)', fontSize: '0.68rem', marginTop: 5 }}>Confidence: 87% · Classified in 1.2s by YOLOv8n</p>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute" style={{
                top: -16, right: -12,
                background: 'var(--hero-card-bg)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--hero-card-border)',
                borderRadius: 12, padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                transition: 'background 0.25s, border-color 0.25s',
              }}>
                <p className="m-0" style={{ color: '#F59E0B', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>2,400+</p>
                <p className="m-0" style={{ color: 'var(--hero-card-sub)', fontSize: '0.68rem', marginTop: 3 }}>Reports this month</p>
              </div>

              {/* Floating GPS card */}
              <div className="absolute flex items-center" style={{
                bottom: 90, left: -16,
                background: 'var(--hero-card-bg)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 12, padding: '10px 14px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                gap: 8,
                transition: 'background 0.25s',
              }}>
                <span className="flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                  <MapPinIcon size={16} />
                </span>
                <div>
                  <p className="m-0" style={{ color: 'var(--hero-card-text)', fontWeight: 600, fontSize: '0.75rem' }}>GPS Captured</p>
                  <p className="m-0" style={{ color: 'var(--hero-card-sub)', fontSize: '0.65rem' }}>6.2209° N, 7.0671° E</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', transition: 'background 0.25s' }}>
        <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="stat-item text-center">
                <p className="text-3xl font-bold m-0" style={{ color: 'var(--text)', transition: 'color 0.25s' }}>{s.value}</p>
                <p className="text-sm mt-1 m-0" style={{ color: 'var(--text-muted)', transition: 'color 0.25s' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20" style={{ background: 'var(--bg-muted)', transition: 'background 0.25s' }} id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="eyebrow">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold m-0 mt-2" style={{ color: 'var(--text)', transition: 'color 0.25s' }}>
              Four simple steps to action
            </h2>
            <p className="max-w-xl mx-auto mt-3" style={{ color: 'var(--text-muted)' }}>
              From damaged road to government action.
            </p>
          </div>
          <div ref={stepsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="step-card card p-6 relative">
                <span className="absolute w-8 h-8 text-white text-sm font-bold rounded-full flex items-center justify-center" style={{ background: '#0F2137', top: -12, left: -12 }}>
                  {i + 1}
                </span>
                <div className="mb-4" style={{ color: '#F59E0B' }}>
                  <step.Icon size={28} />
                </div>
                <h3 className="font-bold m-0 mb-2" style={{ color: 'var(--text)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed m-0" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section ref={aiSectionRef} className="py-20" style={{ background: 'var(--bg)', transition: 'background 0.25s' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow m-0">Capabilities</p>
              <h2 className="text-3xl sm:text-4xl font-bold m-0 mt-2 mb-6" style={{ color: 'var(--text)', transition: 'color 0.25s' }}>
                AI That Understands Road Damage
              </h2>
              <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Our YOLOv8n computer vision model is trained on thousands of road damage images
                and can detect four major damage categories with high accuracy in under 2 seconds.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {damageTypes.map((d) => (
                  <div key={d.name} className="damage-card card p-4">
                    <span style={{ color: 'var(--text-muted)' }}>
                      <d.Icon size={22} />
                    </span>
                    <p className="text-sm font-semibold mt-2 m-0" style={{ color: 'var(--text)' }}>{d.name}</p>
                  </div>
                ))}
              </div>

              <Link href="/report" className="btn-primary inline-flex items-center gap-2">
                Submit Your First Report <ArrowRightIcon size={16} />
              </Link>
            </div>

            <div className="relative h-80 lg:h-[480px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80"
                alt="Road damage example"
                fill
                className="object-cover"
              />
              <div className="absolute rounded-xl p-4" style={{ bottom: 16, left: 16, right: 16, background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(10px)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-300 m-0">AI Detection Result</p>
                    <p className="font-bold text-white m-0">Pothole Detected</p>
                  </div>
                  <span className="text-white text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#EF4444' }}>HIGH</span>
                </div>
                <div className="mt-2 rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <div className="h-1.5 rounded-full" style={{ width: '87%', background: '#10B981' }} />
                </div>
                <p className="text-xs text-gray-400 mt-1 m-0">Confidence: 87%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── theme-adaptive (was always navy before) */}
      <section className="py-20" style={{ background: 'var(--bg-muted)', transition: 'background 0.25s' }}>
        <div ref={testimonialsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="eyebrow">Why It Matters</p>
          <h2 className="text-3xl font-bold m-0 mt-2 mb-4" style={{ color: 'var(--text)', transition: 'color 0.25s' }}>Voices From the Road</h2>
          <p className="max-w-2xl mx-auto mb-12" style={{ color: 'var(--text-muted)' }}>
            Poor road conditions cost Nigeria billions in vehicle damage and lost
            productivity every year. Citizen reporting creates real-time data that
            agencies can act on.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: 'This is exactly the kind of civic tech Nigeria needs. I reported a pothole and it was fixed within a week.', name: 'Chukwuemeka A.', city: 'Awka, Anambra' },
              { quote: 'Simple to use. I submitted a report while stuck in traffic. The GPS captured everything automatically.', name: 'Fatima I.', city: 'Abuja, FCT' },
              { quote: 'Our maintenance team now receives structured, GPS-tagged reports instead of vague complaints. Huge improvement.', name: 'Engr. Obi N.', city: 'FERMA, Enugu District' },
            ].map((t) => (
              <div key={t.name} className="testimonial-card card p-6 text-left">
                <p className="text-sm leading-relaxed mb-4 m-0" style={{ color: 'var(--text-muted)' }}>&ldquo;{t.quote}&rdquo;</p>
                <p className="font-semibold m-0" style={{ color: 'var(--text)' }}>{t.name}</p>
                <p className="text-xs m-0" style={{ color: 'var(--text-faint)' }}>{t.city}</p>
              </div>
            ))}
          </div>
          <Link href="/report" className="btn-primary inline-flex items-center gap-2 mt-12 text-lg px-8 py-4">
            Start Reporting Now — It&apos;s Free <ArrowRightIcon size={18} />
          </Link>
        </div>
      </section>
    </Layout>
  )
}