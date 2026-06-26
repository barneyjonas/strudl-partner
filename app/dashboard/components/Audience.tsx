'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { AudienceData, PRIVACY_THRESHOLD, Period, notifyEligibleUsers } from '@/lib/mockData'
import { formatNumber, formatMoney, NOTIFICATION_COST } from '@/lib/helpers'
import type { MapProps } from './Nuts2ChoroplethMap'

const Nuts2ChoroplethMap = dynamic(
  () => import('./Nuts2ChoroplethMap'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        width: '100%', height: 480, background: '#FAF8F4',
        borderRadius: 12, border: '1px solid #D4D4D8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ color: '#A1A1AA', fontSize: '0.85rem', margin: 0 }}>Loading map…</p>
      </div>
    ),
  }
) as React.ComponentType<MapProps>

// ── Region mock data — three time periods ─────────────────────────────────────

const mockRegionData: Record<Period, Record<string, number>> = {
  '7d': {
    AT13: 31,
    AT12: 8,
    AT22: 6,
    AT32: 11,
    AT31: 7,
    AT34: 4,
    AT33: 3,
    AT11: 2,
    DE21: 5,
    JP:   7,
    GB:   9,
  },
  '30d': {
    AT13: 187,
    AT12: 43,
    AT22: 31,
    AT21: 14,
    AT32: 28,
    AT31: 19,
    AT34: 11,
    AT33: 8,
    AT11: 6,
    DE21: 22,
    DE22: 7,
    HU10: 12,
    JP:   34,
    GB:   28,
    BR:   6,
    'US-CA': 8,
    'US-NY': 6,
    'US-TX': 5,
    'CA-ON': 5,
    'CA-BC': 3,
    'AU-NSW': 7,
    'AU-VIC': 5,
  },
  '12m': {
    AT13: 1840,
    AT12: 412,
    AT22: 298,
    AT21: 143,
    AT32: 267,
    AT31: 188,
    AT34: 97,
    AT33: 74,
    AT11: 51,
    DE21: 203,
    DE22: 88,
    HU10: 119,
    CZ01: 67,
    SK01: 44,
    JP:   312,
    GB:   276,
    BR:   62,
    SG:   41,
    AE:   38,
    'US-CA':  80,
    'US-NY':  60,
    'US-TX':  50,
    'CA-ON':  50,
    'CA-BC':  30,
    'AU-NSW': 70,
    'AU-VIC': 50,
  },
}

// ── Region display names ──────────────────────────────────────────────────────

const REGION_LABELS: Record<string, { name: string; country: string }> = {
  // NUTS2
  AT13: { name: 'Vienna',          country: 'AT' },
  AT12: { name: 'Lower Austria',   country: 'AT' },
  AT22: { name: 'Styria',          country: 'AT' },
  AT21: { name: 'Carinthia',       country: 'AT' },
  AT32: { name: 'Salzburg',        country: 'AT' },
  AT31: { name: 'Upper Austria',   country: 'AT' },
  AT34: { name: 'Vorarlberg',      country: 'AT' },
  AT33: { name: 'Tyrol',           country: 'AT' },
  AT11: { name: 'Burgenland',      country: 'AT' },
  DE21: { name: 'Munich',          country: 'DE' },
  DE22: { name: 'Landsberg',       country: 'DE' },
  HU10: { name: 'Budapest',        country: 'HU' },
  CZ01: { name: 'Prague',          country: 'CZ' },
  SK01: { name: 'Bratislava',      country: 'SK' },
  // Countries
  JP:      { name: 'Japan',              country: 'JP' },
  GB:      { name: 'United Kingdom',     country: 'GB' },
  BR:      { name: 'Brazil',             country: 'BR' },
  SG:      { name: 'Singapore',          country: 'SG' },
  AE:      { name: 'UAE',                country: 'AE' },
  // US states
  'US-CA': { name: 'California',         country: 'US' },
  'US-NY': { name: 'New York',           country: 'US' },
  'US-TX': { name: 'Texas',              country: 'US' },
  // Canadian provinces
  'CA-ON': { name: 'Ontario',            country: 'CA' },
  'CA-BC': { name: 'British Columbia',   country: 'CA' },
  // Australian states
  'AU-NSW': { name: 'New South Wales',   country: 'AU' },
  'AU-VIC': { name: 'Victoria',          country: 'AU' },
}

interface Props {
  period: Period
  data: AudienceData
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #dadada', borderRadius: 20,
  padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
}
const sectionTitle: React.CSSProperties = {
  fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: 6,
}
const sectionSub: React.CSSProperties = {
  color: '#9ca3af', fontSize: '0.82rem', marginBottom: 22,
}
const suppressedRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '11px 14px', borderRadius: 10,
  background: '#fafafa', border: '1px dashed #e5e7eb', marginBottom: 4,
  opacity: 0.7,
}

// ── Suppressed placeholder ────────────────────────────────────────────────────

function SuppressedRow({ label }: { label: string }) {
  return (
    <div style={suppressedRow}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '0.85rem' }}>🔒</span>
        <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: '0.78rem', color: '#b0b0b0', fontStyle: 'italic' }}>
        Not enough data to display (privacy threshold not met)
      </span>
    </div>
  )
}

// ── Region row (map-synced) ───────────────────────────────────────────────────

interface RegionRowProps {
  name: string
  country: string
  count: number
  rank: number
  visibleTotal: number
  maxCount: number
  isHovered: boolean
  onEnter: () => void
  onLeave: () => void
  rowRef: React.RefCallback<HTMLDivElement>
}

function RegionRow({
  name, country, count, rank, visibleTotal, maxCount,
  isHovered, onEnter, onLeave, rowRef,
}: RegionRowProps) {
  const suppressed = count < PRIVACY_THRESHOLD
  const sharePct   = !suppressed && visibleTotal > 0 ? Math.round((count / visibleTotal) * 100) : 0
  const barPct     = !suppressed && maxCount > 0 ? Math.round((count / maxCount) * 100) : 0
  const isTop3     = rank <= 3 && !suppressed

  return (
    <div
      ref={rowRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        padding: '10px 16px 7px',
        background: isHovered ? '#FEF3C7' : rank % 2 === 1 ? '#fff' : '#fafafa',
        borderLeft: `3px solid ${isHovered ? '#D97706' : 'transparent'}`,
        borderRadius: 10,
        transition: 'background 150ms ease, border-color 150ms ease',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 78px 50px', alignItems: 'center', gap: 8 }}>
        {/* Rank badge */}
        <span style={{
          fontSize: '0.7rem', fontWeight: 800, textAlign: 'right',
          color: isTop3 ? '#00cdb8' : 'transparent',
        }}>
          {isTop3 ? `#${rank}` : '#'}
        </span>

        {/* Name + country chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <span style={{
            fontWeight: 600, fontSize: '0.9rem',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            opacity: suppressed ? 0.5 : 1,
          }}>
            {name}
          </span>
          <span style={{
            flexShrink: 0, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em',
            background: '#f3f4f6', color: '#6b7280', borderRadius: 5, padding: '1px 6px',
          }}>
            {country}
          </span>
          {suppressed && (
            <span style={{ fontSize: '0.68rem', color: '#b0b0b0', flexShrink: 0 }}>🔒</span>
          )}
        </div>

        {/* Count */}
        <span style={{
          fontWeight: 700, fontSize: '0.9rem', textAlign: 'right',
          color: suppressed ? '#b0b0b0' : '#0f0f0f',
          fontStyle: suppressed ? 'italic' : 'normal',
        }}>
          {suppressed ? '—' : formatNumber(count)}
        </span>

        {/* Share */}
        <span style={{ color: '#9ca3af', fontSize: '0.84rem', textAlign: 'right' }}>
          {suppressed ? '' : `${sharePct}%`}
        </span>
      </div>

      {/* Proportional bar — only for visible regions */}
      {!suppressed && (
        <div style={{ height: 2, background: '#f0f0f0', borderRadius: 999, marginTop: 7, marginLeft: 36 }}>
          <div style={{
            width: `${barPct}%`, height: '100%', borderRadius: 999,
            background: 'linear-gradient(to right, #00e5cc, #6ff5e8)',
            transition: 'width 450ms ease',
          }} />
        </div>
      )}
    </div>
  )
}

// ── Notify nearby lapsed users ────────────────────────────────────────────────

const DEFAULT_MESSAGE = "Hey! It's been a while ☕ Come back today — your next stamp is waiting."

function NotifyCard() {
  const [step, setStep] = useState<'idle' | 'confirm' | 'sent'>('idle')
  const [message, setMessage] = useState(DEFAULT_MESSAGE)
  const eligible = notifyEligibleUsers
  const cost = eligible * NOTIFICATION_COST

  if (eligible === 0) {
    return (
      <div style={{
        background: '#f9f9f9', border: '1px solid #e5e7eb', borderRadius: 20,
        padding: 28, textAlign: 'center',
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: 8 }}>📭</p>
        <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#374151', marginBottom: 4 }}>No lapsed users nearby right now</p>
        <p style={{ color: '#9ca3af', fontSize: '0.84rem' }}>Check back later — eligible users will appear here when conditions are met.</p>
      </div>
    )
  }

  if (step === 'sent') {
    return (
      <div style={{
        background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{
            width: 40, height: 40, borderRadius: 12, background: '#dcfce7',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
          }}>✓</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: '1rem', color: '#166534', margin: 0 }}>
              Notification sent to {eligible} users
            </p>
            <p style={{ color: '#16a34a', fontSize: '0.84rem', margin: 0 }}>
              Charge added to your next invoice: {formatMoney(cost)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setStep('idle')}
          style={{
            padding: '8px 16px', background: 'transparent', color: '#16a34a',
            border: '1px solid #bbf7d0', borderRadius: 999, fontWeight: 600,
            fontSize: '0.82rem', cursor: 'pointer',
          }}
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff', border: '1px solid #dadada', borderRadius: 20,
      padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
        <span style={{
          width: 40, height: 40, borderRadius: 12, background: '#f3f4f6',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0,
        }}>📲</span>
        <div>
          <p style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', margin: 0 }}>
            Notify Nearby Lapsed Users
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.82rem', margin: '3px 0 0' }}>
            Re-engage customers who haven't visited in 14+ days and are currently in the city
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12, marginBottom: 20,
      }}>
        {[
          { label: 'Eligible users',  value: String(eligible), sub: '14+ days lapsed · nearby · push on' },
          { label: 'Estimated cost',  value: formatMoney(cost), sub: `€${NOTIFICATION_COST.toFixed(2)} per user — billed next invoice` },
        ].map(s => (
          <div key={s.label} style={{
            background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 14, padding: '14px 16px',
          }}>
            <p style={{ color: '#6b7280', fontSize: '0.78rem', fontWeight: 500, marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: 3 }}>{s.value}</p>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontWeight: 600, fontSize: '0.84rem', color: '#374151', marginBottom: 8 }}>
          Notification message <span style={{ fontWeight: 400, color: '#9ca3af' }}>(editable)</span>
        </p>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={step === 'confirm'}
          rows={2}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 12,
            border: '1px solid #dadada', fontSize: '0.88rem', lineHeight: 1.55,
            resize: 'vertical', fontFamily: 'inherit', color: '#0f0f0f',
            background: step === 'confirm' ? '#f9fafb' : '#fff',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {step === 'idle' && (
        <button
          onClick={() => setStep('confirm')}
          style={{
            padding: '11px 22px', background: '#0f0f0f', color: '#fff',
            border: 'none', borderRadius: 999, fontWeight: 700,
            fontSize: '0.88rem', cursor: 'pointer',
          }}
        >
          Send notification →
        </button>
      )}

      {step === 'confirm' && (
        <div style={{
          background: '#fefce8', border: '1px solid #fde68a',
          borderRadius: 14, padding: '16px 18px',
        }}>
          <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#92400e', marginBottom: 6 }}>
            Confirm before sending
          </p>
          <p style={{ fontSize: '0.84rem', color: '#78350f', marginBottom: 14, lineHeight: 1.5 }}>
            This will send a push notification to <strong>{eligible} users</strong> and add{' '}
            <strong>{formatMoney(cost)}</strong> to your next invoice. This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setStep('sent')}
              style={{
                padding: '10px 20px', background: '#0f0f0f', color: '#fff',
                border: 'none', borderRadius: 999, fontWeight: 700,
                fontSize: '0.88rem', cursor: 'pointer',
              }}
            >
              Confirm &amp; Send
            </button>
            <button
              onClick={() => setStep('idle')}
              style={{
                padding: '10px 20px', background: 'transparent', color: '#5f5f5f',
                border: '1px solid #dadada', borderRadius: 999, fontWeight: 600,
                fontSize: '0.88rem', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Audience({ period, data }: Props) {
  const {
    frequencyBands,
    rewardRedemptionPct, atRiskPct, loyalPct,
    newUsers, returningUsers, totalUsers,
  } = data

  // ── Shared hover state (map ↔ list) ──────────────────────────────────────
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null)

  // ── Period-change fade animation ─────────────────────────────────────────
  const [displayedPeriod, setDisplayedPeriod] = useState<Period>(period)
  const [listOpacity, setListOpacity]         = useState(1)
  const [headerFlash, setHeaderFlash]         = useState(false)
  const prevPeriodRef = useRef<Period>(period)

  useEffect(() => {
    if (prevPeriodRef.current === period) return
    prevPeriodRef.current = period

    setListOpacity(0)
    const t1 = window.setTimeout(() => { setDisplayedPeriod(period); setListOpacity(1) }, 150)
    const t2 = window.setTimeout(() => setHeaderFlash(true), 200)
    const t3 = window.setTimeout(() => setHeaderFlash(false), 800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [period])

  // ── Row refs for list-row highlighting ───────────────────────────────────
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // ── Derive region list from active period data ────────────────────────────
  const activeData = mockRegionData[displayedPeriod]

  const regionList = Object.entries(activeData)
    .map(([code, count]) => ({
      code,
      count,
      ...(REGION_LABELS[code] ?? { name: code, country: '?' }),
    }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count)

  const visibleTotal    = regionList.filter(r => r.count >= PRIVACY_THRESHOLD).reduce((s, r) => s + r.count, 0)
  const maxCount        = regionList.find(r => r.count >= PRIVACY_THRESHOLD)?.count ?? 1
  const uniqueCountries = new Set(regionList.map(r => r.country)).size

  // ── Frequency bands ───────────────────────────────────────────────────────
  const visibleBands   = frequencyBands.filter(b => b.users >= PRIVACY_THRESHOLD)
  const suppressedBands = frequencyBands.filter(b => b.users < PRIVACY_THRESHOLD)
  const bandTotal      = visibleBands.reduce((s, b) => s + b.users, 0)
  const maxBandUsers   = Math.max(...visibleBands.map(b => b.users), 1)

  const newPct = totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0
  const retPct = totalUsers > 0 ? Math.round((returningUsers / totalUsers) * 100) : 0

  const periodLabel = period === '7d' ? 'this week' : period === '30d' ? 'this month' : 'this year'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── NUTS2 / World Choropleth Map ───────────────────────────────────── */}
      <Nuts2ChoroplethMap
        activeData={activeData}
        hoveredRegionId={hoveredRegionId}
        onHoverRegion={setHoveredRegionId}
      />

      {/* Disclaimer */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        background: '#f9f9f9', border: '1px solid #e5e7eb',
        borderRadius: 14, padding: '13px 16px',
      }}>
        <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: 1 }}>🔐</span>
        <p style={{ fontSize: '0.85rem', color: '#5f5f5f', margin: 0, lineHeight: 1.5 }}>
          <strong style={{ color: '#374151' }}>All data is aggregated and anonymised.</strong>{' '}
          Individual users are never shown. Groups below {PRIVACY_THRESHOLD} users are suppressed
          in accordance with k-anonymity principles under GDPR.
        </p>
      </div>

      {/* ── Section 1: Customer Origin (region list) ──────────────────────── */}
      <div style={card}>

        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <p style={{
              fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', margin: 0,
              color: headerFlash ? '#D97706' : 'inherit',
              transition: headerFlash ? 'none' : 'color 400ms ease',
            }}>
              Where your customers come from
            </p>
            {headerFlash && (
              <span style={{
                fontSize: '0.68rem', fontWeight: 700, color: '#D97706',
                background: '#FEF3C7', borderRadius: 4, padding: '1px 6px',
                letterSpacing: '0.04em',
              }}>
                Updated
              </span>
            )}
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.82rem', margin: 0 }}>
            {regionList.length} {regionList.length === 1 ? 'region' : 'regions'}{' '}
            · {uniqueCountries} {uniqueCountries === 1 ? 'country' : 'countries'}{' '}
            · All data anonymised
          </p>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '28px 1fr 78px 50px',
          padding: '0 16px 8px', gap: 8,
        }}>
          {[
            { label: '',       align: 'left'  },
            { label: 'Region', align: 'left'  },
            { label: 'Users',  align: 'right' },
            { label: 'Share',  align: 'right' },
          ].map(h => (
            <span key={h.label} style={{
              fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              textAlign: h.align as React.CSSProperties['textAlign'],
            }}>
              {h.label}
            </span>
          ))}
        </div>

        {/* Region rows */}
        <div
          style={{
            display: 'flex', flexDirection: 'column', gap: 2,
            opacity: listOpacity,
            transition: 'opacity 120ms ease',
          }}
        >
          {regionList.map((r, i) => (
            <RegionRow
              key={r.code}
              name={r.name}
              country={r.country}
              count={r.count}
              rank={i + 1}
              visibleTotal={visibleTotal}
              maxCount={maxCount}
              isHovered={hoveredRegionId === r.code}
              onEnter={() => setHoveredRegionId(r.code)}
              onLeave={() => setHoveredRegionId(null)}
              rowRef={el => { rowRefs.current[r.code] = el }}
            />
          ))}

          {regionList.length === 0 && (
            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', padding: '24px 0' }}>
              No data for this period.
            </p>
          )}
        </div>
      </div>

      {/* ── Section 2: Visit Frequency Distribution ───────────────────────── */}
      <div style={card}>
        <p style={sectionTitle}>Visit Frequency Distribution</p>
        <p style={sectionSub}>How often do your customers visit? — {periodLabel}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visibleBands.map(band => {
            const pct = bandTotal > 0 ? Math.round((band.users / bandTotal) * 100) : 0
            const barWidth = Math.round((band.users / maxBandUsers) * 100)
            return (
              <div key={band.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontWeight: 500, fontSize: '0.88rem', width: 88, flexShrink: 0, color: '#374151' }}>
                  {band.label}
                </span>
                <div style={{ flex: 1, height: 10, background: '#f0f0f0', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${barWidth}%`,
                    background: '#0f0f0f', borderRadius: 999,
                    transition: 'width 500ms ease',
                  }} />
                </div>
                <div style={{ display: 'flex', gap: 10, width: 90, justifyContent: 'flex-end', flexShrink: 0 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f0f0f' }}>{formatNumber(band.users)}</span>
                  <span style={{ fontSize: '0.85rem', color: '#9ca3af', width: 32, textAlign: 'right' }}>{pct}%</span>
                </div>
              </div>
            )
          })}

          {suppressedBands.map(band => (
            <SuppressedRow key={band.label} label={band.label} />
          ))}
        </div>
      </div>

      {/* ── Section 3 + 4 side by side ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

        {/* Loyalty Engagement */}
        <div style={card}>
          <p style={sectionTitle}>Loyalty Engagement</p>
          <p style={sectionSub}>{periodLabel}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                label: 'Reward Redemption',
                sub: 'Users who redeemed ≥ 1 reward',
                pct: rewardRedemptionPct,
                color: '#166534', bg: '#dcfce7',
              },
              {
                label: 'Loyal Users',
                sub: '4+ visits this period',
                pct: loyalPct,
                color: '#1e40af', bg: '#dbeafe',
              },
              {
                label: 'At Risk',
                sub: 'No visit in 30+ days',
                pct: atRiskPct,
                color: '#9a3412', bg: '#ffedd5',
              },
            ].map(m => (
              <div key={m.label}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.label}</span>
                    <span style={{ color: '#9ca3af', fontSize: '0.78rem', marginLeft: 8 }}>{m.sub}</span>
                  </div>
                  <span style={{
                    fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em',
                    background: m.bg, color: m.color,
                    borderRadius: 8, padding: '2px 9px',
                  }}>
                    {m.pct}%
                  </span>
                </div>
                <div style={{ height: 6, background: '#f0f0f0', borderRadius: 999 }}>
                  <div style={{ height: '100%', width: `${m.pct}%`, background: m.color, borderRadius: 999, transition: 'width 500ms ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New vs Returning */}
        <div style={card}>
          <p style={sectionTitle}>New vs Returning</p>
          <p style={sectionSub}>{periodLabel} · {formatNumber(totalUsers)} total users</p>

          <div style={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ width: `${newPct}%`, background: '#6366f1', transition: 'width 500ms ease' }} />
            <div style={{ width: `${retPct}%`, background: '#0f0f0f', transition: 'width 500ms ease' }} />
          </div>

          {[
            { label: 'New users',       count: newUsers,       pct: newPct, color: '#6366f1', desc: 'First visit this period' },
            { label: 'Returning users', count: returningUsers, pct: retPct, color: '#0f0f0f', desc: 'Visited before' },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 0', borderBottom: '1px solid #f5f5f5',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: 4, background: row.color, flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{row.label}</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.78rem', marginLeft: 8 }}>{row.desc}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{formatNumber(row.count)}</span>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem', width: 36, textAlign: 'right' }}>{row.pct}%</span>
              </div>
            </div>
          ))}

          <p style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: 14, lineHeight: 1.5 }}>
            Returning users drive long-term revenue. A strong returning share indicates the loyalty
            programme is building habits, not just one-off visits.
          </p>
        </div>

      </div>

      {/* ── Section 5: Notify Nearby Lapsed Users ─────────────────────────── */}
      <NotifyCard />

    </div>
  )
}
