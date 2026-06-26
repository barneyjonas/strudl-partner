'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const P = {
  bg: '#EDE8DF',
  shell: '#FDFAF5',
  border: '#E8E2D8',
  text: '#1A1815',
  muted: '#7A7060',
}

export default function DashboardLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Bitte E-Mail und Passwort eingeben.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      sessionStorage.setItem('dashboard_auth', 'true')
      router.push('/dashboard')
    }, 600)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: `1px solid ${P.border}`,
    borderRadius: 12, fontSize: '0.97rem', outline: 'none',
    background: P.bg, color: P.text,
    transition: 'border-color 180ms', fontFamily: 'inherit',
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      background: P.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: P.shell, border: `1px solid ${P.border}`, borderRadius: 24,
        padding: 36, boxShadow: '0 20px 60px rgba(26,24,21,0.10)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img
            src="/strudl-partner/Logo_Strudl_no_Background.svg" alt="Strudl"
            style={{ width: 52, height: 52, borderRadius: 14, objectFit: 'cover', margin: '0 auto 10px' }}
          />
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: 6, color: P.text }}>
            Dashboard
          </h1>
          <p style={{ color: P.muted, fontSize: '0.9rem' }}>Anmelden, um Ihre Analysen zu sehen</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: 6, color: P.text }}>
              E-Mail
            </label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email"
              placeholder="ihr@kaffeehaus.at" required style={inputStyle}
              onFocus={e => e.target.style.borderColor = P.text}
              onBlur={e => e.target.style.borderColor = P.border} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: 6, color: P.text }}>
              Passwort
            </label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password"
              placeholder="••••••••" required style={inputStyle}
              onFocus={e => e.target.style.borderColor = P.text}
              onBlur={e => e.target.style.borderColor = P.border} />
          </div>

          {error && <p style={{ color: '#c0392b', fontSize: '0.87rem' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            marginTop: 6, padding: '14px',
            background: P.text, color: P.shell,
            border: `1px solid ${P.text}`, borderRadius: 999,
            fontWeight: 700, fontSize: '0.97rem', opacity: loading ? 0.7 : 1,
            transition: 'opacity 180ms',
          }}>
            {loading ? 'Einen Moment…' : 'Anmelden →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ color: P.muted, fontSize: '0.88rem' }}>← Zurück zur Website</Link>
        </div>
      </div>
    </div>
  )
}
