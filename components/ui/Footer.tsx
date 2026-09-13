import Link from 'next/link'

function RoadIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l3-17 3 17M3 10h18" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#0A1929', color: '#64748B' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4" style={{ color: '#F59E0B' }}>
              <RoadIcon />
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>RoadWatch Nigeria</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '320px' }}>
              A citizen-powered road damage detection and reporting platform. Helping Nigerian road agencies maintain safer roads through community data and AI.
            </p>
          </div>
          <div>
            <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              PLATFORM
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['/', 'Home'], ['/report', 'Report Damage'], ['/my-reports', 'Track Report'], ['/about', 'How It Works']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} style={{ color: '#64748B', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#ffffff'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = '#64748B'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              AGENCIES
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              {['FERMA', 'FRSC', 'State Ministries of Works', 'LGA Engineering Depts'].map(a => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1E293B', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
          <span>© {new Date().getFullYear()} RoadWatch Nigeria. Nnamdi Azikiwe University, Awka.</span>
          <Link href="/admin/login" style={{ color: '#475569', textDecoration: 'none' }}>Admin Portal</Link>
        </div>
      </div>
    </footer>
  )
}