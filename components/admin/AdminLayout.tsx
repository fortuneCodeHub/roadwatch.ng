import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Head from 'next/head'

function DashboardIcon() {
  return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
}
function ListIcon() {
  return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
}
function GlobeIcon() {
  return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
}
function LogOutIcon() {
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
}
function MenuIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
}
function CloseIcon() {
  return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
}
function RoadIcon() {
  return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l3-17 3 17M3 10h18" /></svg>
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/admin/reports', label: 'All Reports', icon: <ListIcon /> },
]

function Sidebar({ onClose }: { onClose?: () => void }) {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Signed out')
    router.push('/admin/login')
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#0A1929' }}>
      {/* Logo */}
      <div className="flex items-center justify-between" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1E293B' }}>
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 no-underline" onClick={onClose}>
          <span style={{ color: '#F59E0B' }}><RoadIcon /></span>
          <div>
            <p className="m-0" style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>RoadWatch</p>
            <p className="m-0" style={{ color: '#475569', fontSize: '0.7rem', lineHeight: 1 }}>Admin Portal</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} aria-label="Close menu" className="bg-transparent border-0 cursor-pointer lg:hidden" style={{ color: '#94A3B8', padding: '0.25rem' }}>
            <CloseIcon />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col" style={{ padding: '1rem 0.75rem', gap: '0.25rem' }}>
        {navItems.map(item => {
          const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href} onClick={onClose} className={`sidebar-link ${active ? 'active' : ''}`}>
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid #1E293B' }}>
        <Link href="/" className="sidebar-link" onClick={onClose}>
          <GlobeIcon />
          Public Portal
        </Link>
        <button
          onClick={logout}
          className="sidebar-link"
          style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', color: '#EF4444', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOutIcon />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children, title = 'Admin — RoadWatch' }: { children: React.ReactNode; title?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <>
      <Head><title>{title}</title></Head>

      <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-muted)', transition: 'background 0.25s' }}>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <Sidebar />
        </aside>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(10,25,41,0.6)', backdropFilter: 'blur(2px)' }}
              onClick={closeSidebar}
            />
            <aside className="absolute left-0 top-0 h-full w-60" style={{ background: '#0A1929', boxShadow: '4px 0 24px rgba(0,0,0,0.35)' }}>
              <Sidebar onClose={closeSidebar} />
            </aside>
          </div>
        )}

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Top bar — theme-aware */}
          <header
            className="flex items-center justify-between shrink-0"
            style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', height: 56, transition: 'background 0.25s, border-color 0.25s' }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex lg:hidden bg-transparent border-0 cursor-pointer"
                style={{ color: 'var(--text-muted)', padding: '0.25rem' }}
                aria-label="Open menu"
              >
                <MenuIcon />
              </button>
              <p className="m-0 lg:hidden" style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.9rem' }}>
                {title.split('—')[0].trim()}
              </p>
              <p className="m-0 hidden lg:block" style={{ fontWeight: 500, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Road Damage Management Portal
              </p>
            </div>
            <div className="flex items-center" style={{ gap: '0.75rem' }}>
              <div className="flex items-center justify-center" style={{ width: 32, height: 32, background: '#0F2137', borderRadius: '50%' }}>
                <span style={{ color: '#F59E0B', fontSize: '0.75rem', fontWeight: 700 }}>A</span>
              </div>
              <span className="hidden sm:inline" style={{ color: 'var(--text)', fontSize: '0.875rem', fontWeight: 500 }}>Admin</span>
            </div>
          </header>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto" style={{ padding: '1.5rem' }}>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}