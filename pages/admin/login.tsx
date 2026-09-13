import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import toast from 'react-hot-toast'

function RoadIcon() {
  return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l3-17 3 17M3 10h18" /></svg>
}
function EyeIcon({ show }: { show: boolean }) {
  return show
    ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
    : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
}

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      toast.success('Welcome back!')
      router.push((router.query.redirect as string) || '/admin/dashboard')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Admin Login — RoadWatch Nigeria</title></Head>
      <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr', fontFamily: 'Inter, sans-serif' }}>

        {/* Left panel */}
        <div style={{ background: '#0F2137', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }} className="lg:flex lg:col-span-1" id="login-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#F59E0B' }}>
            <RoadIcon />
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>RoadWatch Nigeria</span>
          </div>
          <div>
            <h2 style={{ color: '#ffffff', fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '1rem' }}>
              Road damage data,<br />organised for action.
            </h2>
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Manage damage reports from citizens across Nigeria. View reports on the map, update statuses, and coordinate maintenance.
            </p>
          </div>
          <p style={{ color: '#1E3A5F', fontSize: '0.75rem' }}>Nnamdi Azikiwe University, Department of Computer Science</p>
        </div>

        {/* Right panel — form */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#F8FAFC', minHeight: '100vh' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            {/* Mobile logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem' }} className="lg:hidden">
              <span style={{ color: '#F59E0B' }}><RoadIcon /></span>
              <span style={{ color: '#0F2137', fontWeight: 700, fontSize: '1.1rem' }}>RoadWatch Nigeria</span>
            </div>

            <h1 style={{ color: '#0F2137', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Sign in</h1>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '2rem' }}>Admin access only. Contact your administrator for credentials.</p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', color: '#374151', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email address</label>
                <input
                  type="email"
                  className="input"
                  placeholder="admin@ferma.gov.ng"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#374151', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="input"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '3rem' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                    <EyeIcon show={showPass} />
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24"><circle opacity=".25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path opacity=".75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </form>

            <p style={{ marginTop: '2rem', color: '#94A3B8', fontSize: '0.8rem', textAlign: 'center' }}>
              Not an admin?{' '}
              <a href="/" style={{ color: '#0F2137', fontWeight: 600, textDecoration: 'none' }}>Go to public portal</a>
            </p>
          </div>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (min-width: 1024px) {
            #login-left { display: flex !important; }
            body > div > div { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </div>
    </>
  )
}