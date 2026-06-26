'use client'
import Link from 'next/link'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Navbar() {
  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    scrollTo(id)
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
      background: 'rgba(253,250,245,0.82)',
      borderBottom: '1px solid rgba(26,24,21,0.07)',
    }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 12px' }}>
        <nav style={{
          minHeight: 60, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 6,
        }}>

          {/* Brand — icon always, text only on sm+ */}
          <a href="#home" onClick={e => handleNav(e, 'home')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1A1815', flexShrink: 0 }}>
            <span style={{ width: 24, height: 24, borderRadius: 7, overflow: 'hidden', flexShrink: 0 }}>
              <img src="/strudl-partner/Logo_Strudl_no_Background.svg" alt="Strudl" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </span>
            {/* no inline display here — Tailwind controls this */}
            <span className="hidden sm:inline" style={{ fontWeight: 800, letterSpacing: '-0.03em', fontSize: '1.3rem' }}>
              Strudl
            </span>
          </a>

          {/* Nav links — always visible, compact on mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={e => handleNav(e, l.href.slice(1))}
                style={{
                  color: '#7A7060', fontWeight: 500, textDecoration: 'none',
                  padding: '6px 8px', fontSize: '0.82rem', whiteSpace: 'nowrap',
                  transition: 'color 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A1815')}
                onMouseLeave={e => (e.currentTarget.style.color = '#7A7060')}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Dashboard — always visible, compact */}
          <Link href="/dashboard"
            style={{
              borderRadius: 999, padding: '8px 12px', fontWeight: 700,
              fontSize: '0.82rem', whiteSpace: 'nowrap', flexShrink: 0,
              background: '#1A1815', color: '#FDFAF5', border: '1px solid #1A1815',
              textDecoration: 'none',
            }}
          >
            Dashboard →
          </Link>

        </nav>
      </div>
    </header>
  )
}
