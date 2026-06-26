'use client'
import { useState } from 'react'
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
  const [open, setOpen] = useState(false)

  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    setOpen(false)
    scrollTo(id)
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        background: 'rgba(253,250,245,0.82)',
        borderBottom: '1px solid rgba(26,24,21,0.07)',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 16px' }}>
        <nav style={{ minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          {/* Brand */}
          <a href="#home" onClick={e => handleNav(e, 'home')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, letterSpacing: '-0.03em', fontSize: '1.45rem', textDecoration: 'none', color: '#1A1815' }}>
            <span style={{ width: 48, height: 48, borderRadius: 14, overflow: 'hidden', flexShrink: 0, transition: 'transform 240ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(-6deg) scale(1.04)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}>
              <img src="/strudl-partner/Logo_Strudl_no_Background.svg" alt="Strudl logo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </span>
            Strudl
          </a>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: '0.97rem' }} className="hidden sm:flex">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={e => handleNav(e, l.href.slice(1))}
                style={{ color: '#7A7060', fontWeight: 400, textDecoration: 'none', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1A1815')}
                onMouseLeave={e => (e.currentTarget.style.color = '#7A7060')}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Dashboard CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/dashboard"
              style={{
                alignItems: 'center', gap: 6,
                borderRadius: 999, padding: '10px 18px', fontWeight: 700, fontSize: '0.9rem',
                background: '#1A1815', color: '#FDFAF5', border: '1px solid #1A1815',
                transition: 'transform 180ms ease', textDecoration: 'none',
              }}
              className="hidden sm:inline-flex hover:-translate-y-px"
            >
              Dashboard →
            </Link>
            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(!open)}
              style={{ padding: 8 }}
              className="sm:hidden"
              aria-label="Toggle menu"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                {open ? (
                  <path d="M4 4L18 18M4 18L18 4" stroke="#1A1815" strokeWidth="2" strokeLinecap="round"/>
                ) : (
                  <>
                    <line x1="2" y1="6" x2="20" y2="6" stroke="#1A1815" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="2" y1="11" x2="20" y2="11" stroke="#1A1815" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="2" y1="16" x2="20" y2="16" stroke="#1A1815" strokeWidth="2" strokeLinecap="round"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div style={{ padding: '12px 0 16px', borderTop: '1px solid rgba(26,24,21,0.06)', display: 'flex', flexDirection: 'column', gap: 4 }}
            className="sm:hidden">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={e => handleNav(e, l.href.slice(1))}
                style={{ padding: '10px 4px', fontWeight: 400, color: '#7A7060', textDecoration: 'none' }}>
                {l.label}
              </a>
            ))}
            <Link href="/dashboard" onClick={() => setOpen(false)}
              style={{
                marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
                borderRadius: 999, padding: '10px 18px', fontWeight: 700, fontSize: '0.9rem',
                background: '#1A1815', color: '#FDFAF5', border: '1px solid #1A1815',
                textDecoration: 'none', alignSelf: 'flex-start',
              }}>
              Dashboard →
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
