import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

function MenuIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
}
function CloseIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
}
function RoadIcon() {
  return <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l3-17 3 17M3 10h18" /></svg>
}
function SunIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/report', label: 'Report Damage' },
  { href: '/my-reports', label: 'Track Report' },
  { href: '/about', label: 'How It Works' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const router = useRouter()

  /* Persist theme across page loads */
  useEffect(() => {
    const saved = localStorage.getItem('rdw-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem('rdw-theme', next ? 'dark' : 'light')
  }

  const linkColor = (href: string) => router.pathname === href ? '#F59E0B' : '#94A3B8'

  return (
    <nav style={{ background: '#0F2137', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <span style={{ color: '#F59E0B' }}><RoadIcon /></span>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem' }}>RoadWatch</span>
            <span style={{ color: '#475569', fontSize: '0.72rem' }}>Nigeria</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'none', alignItems: 'center', gap: 4 }} className="nav-desktop">
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                color: linkColor(l.href), fontSize: '0.85rem', fontWeight: 500,
                padding: '0.4rem 0.875rem', borderRadius: 6, textDecoration: 'none',
                transition: 'color 0.15s',
              }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="nav-desktop">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '0.45rem',
                cursor: 'pointer',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link href="/admin/login" style={{
              color: '#64748B', fontSize: '0.8rem', fontWeight: 600,
              padding: '0.5rem 1rem', border: '1px solid #1E3A5F',
              borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s',
            }}>
              Admin
            </Link>
            <Link href="/report" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1.1rem' }}>
              Report Now
            </Link>
          </div>

          {/* Mobile right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="nav-mobile">
            <button onClick={toggleTheme} aria-label="Toggle theme" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.4rem', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', padding: '0.25rem' }} aria-label="Toggle menu">
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ paddingBottom: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #1E293B' }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
                display: 'block', padding: '0.65rem 0.5rem',
                color: linkColor(l.href), fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none',
              }}>
                {l.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <Link href="/admin/login" style={{ flex: 1, textAlign: 'center', padding: '0.6rem', border: '1px solid #1E3A5F', borderRadius: 8, color: '#64748B', fontSize: '0.8rem', textDecoration: 'none' }}>Admin</Link>
              <Link href="/report" className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}>Report Now</Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 1065px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  )
}