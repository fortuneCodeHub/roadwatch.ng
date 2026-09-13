import Layout from '@/components/ui/Layout'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function MobileIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2" /><path strokeLinecap="round" d="M11 18h2" /></svg>
}
function CpuIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path strokeLinecap="round" d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" /></svg>
}
function MapIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
}
function PotholeIcon() {
  return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><ellipse cx="12" cy="14" rx="7" ry="4" /><path strokeLinecap="round" d="M8 8l1.5-2M13 7l1-2M17 9l1.5-1.5" /></svg>
}
function LongCrackIcon() {
  return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeDasharray="3 2.5" d="M4 8h16M4 16h16" /></svg>
}
function TransCrackIcon() {
  return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeDasharray="3 2.5" d="M8 3v6l-2 3 2 3v6M16 3v5l2 4-2 4v5" /></svg>
}
function AlligatorIcon() {
  return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M3 9h7v6H3zM10 5h6v7h-6zM14 12h7v7h-7zM6 15h8v6H6z" /></svg>
}

const techStack = [
  { icon: <MobileIcon />, title: 'Progressive Web App', desc: 'Accessible on any smartphone browser without app store installation. GPS and camera captured through browser APIs.' },
  { icon: <CpuIcon />, title: 'YOLOv8n AI Model', desc: 'State-of-the-art object detection model fine-tuned on the RDD2022 road damage dataset. Classifies damage in under 2 seconds.' },
  { icon: <MapIcon />, title: 'Leaflet.js Dashboard', desc: 'Interactive map-based administrative dashboard allowing road agencies to view, filter, and manage damage reports geographically.' },
]

const damageTypes = [
  { type: 'Pothole', desc: 'Bowl-shaped holes caused by water infiltration and traffic load', icon: <PotholeIcon />, risk: 'HIGH RISK', riskColor: '#DC2626' },
  { type: 'Longitudinal Crack', desc: 'Cracks running parallel to the road direction', icon: <LongCrackIcon />, risk: 'MEDIUM RISK', riskColor: '#D97706' },
  { type: 'Transverse Crack', desc: 'Cracks running perpendicular to the road direction', icon: <TransCrackIcon />, risk: 'MEDIUM RISK', riskColor: '#D97706' },
  { type: 'Alligator Crack', desc: 'Network of interconnected cracks resembling alligator scales', icon: <AlligatorIcon />, risk: 'HIGH RISK', riskColor: '#DC2626' },
]

export default function AboutPage() {
  const scope = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      /* Hero entrance */
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.about-eyebrow', { y: 20, opacity: 0, duration: 0.5 })
        .from('.about-title', { y: 36, opacity: 0, duration: 0.7 }, '-=0.2')
        .from('.about-sub', { y: 24, opacity: 0, duration: 0.6 }, '-=0.35')

      /* Problem section */
      gsap.from('.problem-text > *', {
        y: 32, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.problem-grid', start: 'top 80%' },
      })
      gsap.from('.problem-img', {
        y: 48, opacity: 0, scale: 0.97, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.problem-grid', start: 'top 80%' },
      })

      /* Tech stack cards */
      gsap.from('.tech-card', {
        y: 48, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.tech-grid', start: 'top 82%' },
      })

      /* Damage category cards */
      gsap.from('.cat-card', {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.cat-grid', start: 'top 82%' },
      })

      /* CTA */
      gsap.from('.about-cta > *', {
        y: 32, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-cta', start: 'top 85%' },
      })
    }, scope)

    return () => ctx.revert()
  }, [])

  return (
    <Layout>
      <Head>
        <title>How It Works — RoadWatch Nigeria</title>
      </Head>
      <div ref={scope}>

        {/* Hero — theme-adaptive via --hero-* variables */}
        <section className="relative overflow-hidden" style={{ background: 'var(--hero-bg)', padding: '6rem 0', transition: 'background 0.25s' }}>
          <div className="absolute pointer-events-none" style={{ inset: 0, backgroundImage: 'linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
            <p className="about-eyebrow eyebrow">About The System</p>
            <h1 className="about-title m-0" style={{ color: 'var(--hero-heading)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15, margin: '0.75rem 0 1.25rem', transition: 'color 0.25s' }}>
              How RoadWatch Works
            </h1>
            <p className="about-sub m-0 mx-auto" style={{ color: 'var(--hero-para)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '640px', transition: 'color 0.25s' }}>
              RoadWatch combines citizen crowd-sourcing with YOLOv8 computer vision to create a real-time
              road damage monitoring and reporting pipeline for Nigerian road agencies.
            </p>
          </div>
        </section>

        <section style={{ padding: '5rem 0', background: 'var(--bg)', transition: 'background 0.25s' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="problem-grid grid items-center mb-20" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              <div className="problem-text">
                <p className="eyebrow">The Problem</p>
                <h2 className="m-0" style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.75rem', margin: '0.75rem 0 1.25rem', transition: 'color 0.25s' }}>
                  The Problem We Solve
                </h2>
                <div className="flex flex-col" style={{ gap: '1rem', color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.95rem' }}>
                  <p className="m-0">Nigeria has approximately 195,000 kilometres of road network — one of the largest in Sub-Saharan Africa. Yet a significant proportion of these roads are in poor condition, causing accidents, vehicle damage, and economic losses worth billions of naira annually.</p>
                  <p className="m-0">Current road inspection methods are manual, infrequent, and expensive. Citizens have no formal channel to report defects, and road agencies lack real-time data about conditions on the ground.</p>
                </div>
              </div>
              <div className="problem-img relative" style={{ height: 300, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 40px rgba(15,33,55,0.15)' }}>
                <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80" alt="Road damage" fill className="object-cover" />
              </div>
            </div>

            {/* Technology stack */}
            <div className="mb-20">
              <div className="text-center" style={{ marginBottom: '2.5rem' }}>
                <p className="eyebrow">Technology</p>
                <h2 className="m-0" style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.75rem', marginTop: '0.75rem', transition: 'color 0.25s' }}>The Technology Stack</h2>
              </div>
              <div className="tech-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {techStack.map((t) => (
                  <div key={t.title} className="tech-card card" style={{ padding: '1.75rem' }}>
                    <div className="flex items-center justify-center mb-4" style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                      {t.icon}
                    </div>
                    <h3 className="m-0 mb-2" style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1rem' }}>{t.title}</h3>
                    <p className="m-0" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Damage categories — theme-adaptive section */}
        <section style={{ padding: '5rem 0', background: 'var(--bg-muted)', transition: 'background 0.25s' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center" style={{ marginBottom: '2.5rem' }}>
              <p className="eyebrow">Detection Categories</p>
              <h2 className="m-0" style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.75rem', marginTop: '0.75rem', transition: 'color 0.25s' }}>Damage Categories Detected</h2>
            </div>
            <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {damageTypes.map((d) => (
                <div key={d.type} className="cat-card card" style={{ padding: '1.5rem' }}>
                  <div className="flex items-start justify-between mb-3">
                    <span style={{ color: '#F59E0B' }}>{d.icon}</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: d.riskColor, background: d.risk === 'HIGH RISK' ? 'rgba(220,38,38,0.1)' : 'rgba(217,119,6,0.1)', padding: '0.2rem 0.55rem', borderRadius: '20px' }}>{d.risk}</span>
                  </div>
                  <h4 className="m-0 mb-2" style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem' }}>{d.type}</h4>
                  <p className="m-0" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '5rem 0', background: 'var(--bg)', transition: 'background 0.25s' }}>
          <div className="about-cta max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="m-0" style={{ color: 'var(--text)', fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.75rem', transition: 'color 0.25s' }}>
              Ready to Make a Difference?
            </h2>
            <p className="m-0" style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.7 }}>Every report you submit helps make Nigerian roads safer.</p>
            <Link href="/report" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>Submit a Report Now</Link>
          </div>
        </section>
      </div>
    </Layout>
  )
}