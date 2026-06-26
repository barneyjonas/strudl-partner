'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const CONSENT_KEY = 'strudl_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'all')
    setVisible(false)
  }

  function essentialOnly() {
    localStorage.setItem(CONSENT_KEY, 'essential')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 16, right: 16, zIndex: 9999,
      maxWidth: 600, margin: '0 auto',
      background: '#0f0f0f', color: '#fff',
      borderRadius: 16, padding: '20px 24px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <div>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
          Wir verwenden technisch notwendige Speichermechanismen für den Betrieb dieser Website (§ 165 TKG 2021).{' '}
          <Link href="/datenschutz" style={{ color: '#d4d4d4', textDecoration: 'underline' }}>
            Datenschutzerklärung
          </Link>
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={accept}
          style={{
            padding: '10px 20px', background: '#fff', color: '#0f0f0f',
            border: 'none', borderRadius: 999, fontWeight: 700, fontSize: '0.88rem',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          Akzeptieren
        </button>
        <button
          onClick={essentialOnly}
          style={{
            padding: '10px 20px', background: 'transparent', color: '#d4d4d4',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999,
            fontWeight: 500, fontSize: '0.88rem', cursor: 'pointer', flexShrink: 0,
          }}
        >
          Nur notwendige
        </button>
      </div>
    </div>
  )
}
