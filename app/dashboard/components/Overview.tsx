'use client'
import { DataPoint, Period, healthScoreData, attentionData, invoices, periodData } from '@/lib/mockData'
import { TodayStats, formatNumber, formatMoney, averageVisits, PRICE_PER_STAMP } from '@/lib/helpers'
import { Customer } from '@/lib/mockData'

interface Props {
  period: Period
  data: DataPoint[]
  todayStats: TodayStats
  customers: Customer[]
  monthlyBilled: number
  onTabChange: (tab: string) => void
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #dadada', borderRadius: 20,
  padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Badge({ positive, label }: { positive?: boolean; label: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 8px', borderRadius: 999,
      fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.01em',
      background: positive ? '#dcfce7' : '#fee2e2',
      color: positive ? '#166534' : '#991b1b',
    }}>
      {label}
    </span>
  )
}

function downloadLastInvoice() {
  const inv = invoices[0]
  const text = [
    '========================================',
    '           STRUDL INVOICE',
    '========================================',
    '',
    `Invoice ID:   ${inv.id}`,
    `Period:       ${inv.period}`,
    `Issued:       ${inv.issued}`,
    `Status:       ${inv.status.toUpperCase()}`,
    '',
    '----------------------------------------',
    `Billed stamps:       ${inv.stamps.toLocaleString()}`,
    `Price per stamp:     €${PRICE_PER_STAMP.toFixed(2)}`,
    `Total amount:        €${inv.amount.toFixed(2)}`,
    '',
    inv.status === 'paid' ? 'PAID — Thank you.' : 'PENDING — Due within 14 days.',
    '========================================',
    'Strudl · partners@strudl.app',
    '========================================',
  ].join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `${inv.id}.txt`; a.click()
  URL.revokeObjectURL(url)
}

// ── Sub-score chip ────────────────────────────────────────────────────────────

function SubScore({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 14, padding: '14px 18px' }}>
      <p style={{ color: '#9ca3af', fontSize: '0.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em', marginBottom: 8 }}>
        {value}%
      </p>
      <div style={{ height: 3, background: '#e5e7eb', borderRadius: 999 }}>
        <div style={{
          height: '100%', borderRadius: 999,
          width: `${value}%`,
          background: value >= 85 ? '#00e5cc' : value >= 70 ? '#34d399' : '#fbbf24',
          transition: 'width 700ms ease',
        }} />
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

const DAY_NAMES: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
  Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
}

export default function Overview({ period, data, todayStats, customers, monthlyBilled, onTabChange }: Props) {
  const totalStamps    = data.reduce((s, d) => s + d.stamps, 0)
  const totalRewards   = data.reduce((s, d) => s + Math.round(d.stamps * 0.08), 0)
  const avgVisits      = averageVisits(customers)
  const totalNewUsers  = data.reduce((s, d) => s + d.newUsers, 0)

  const health         = healthScoreData[period]
  const attentionItems = attentionData[period]

  // Sparkline — always 7d Mon–Sun
  const weekData       = periodData['7d']
  const maxWeekStamps  = Math.max(...weekData.map(d => d.stamps))
  const busiestDay     = weekData.find(d => d.stamps === maxWeekStamps)?.label ?? 'Sat'

  const kpis = [
    { label: 'Stamps Today',       value: formatNumber(todayStats.stampsToday),   badge: <Badge positive label="↑ 14% vs yesterday" /> },
    { label: 'Active Users Today',  value: formatNumber(todayStats.activeUsers),   badge: <Badge positive label={`+${todayStats.newUsers} new`} /> },
    { label: 'Est. Revenue Today',  value: formatMoney(todayStats.billableToday),  badge: <Badge positive label="↑ 8.3%" /> },
    { label: 'Monthly Billed',      value: formatMoney(monthlyBilled),             badge: <Badge positive label="↑ 12.4%" /> },
  ]

  const snapshots = [
    { label: `Total Stamps (${period})`, value: formatNumber(totalStamps) },
    { label: 'Rewards Redeemed',          value: formatNumber(totalRewards) },
    { label: 'New Users',                 value: formatNumber(totalNewUsers) },
    { label: 'Avg Visits / User',         value: String(avgVisits) },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── KPI row ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {kpis.map(k => (
          <div key={k.label} style={card}>
            <p style={{ color: '#5f5f5f', fontSize: '0.82rem', fontWeight: 500, marginBottom: 8 }}>{k.label}</p>
            <p style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.04em', marginBottom: 10 }}>{k.value}</p>
            {k.badge}
          </div>
        ))}
      </div>

      {/* ── Snapshot row ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        {snapshots.map(s => (
          <div key={s.label} style={{ ...card, padding: '18px 20px' }}>
            <p style={{ color: '#5f5f5f', fontSize: '0.8rem', fontWeight: 500, marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.03em' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Section A: Strudl Health Score ───────────────────────────────── */}
      <div style={{
        ...card,
        borderLeft: '4px solid #00e5cc',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05), inset 0 0 0 0 transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ color: '#5f5f5f', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Strudl Score
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontWeight: 900, fontSize: '3.2rem', letterSpacing: '-0.05em', lineHeight: 1, color: '#0f0f0f' }}>
                {health.overall}
              </span>
              <span style={{ color: '#9ca3af', fontSize: '1.1rem', fontWeight: 500 }}>/100</span>
            </div>
          </div>
          <div style={{
            background: health.overall >= 85 ? '#f0fdf4' : health.overall >= 75 ? '#ecfdf5' : '#fefce8',
            color:      health.overall >= 85 ? '#166534'  : health.overall >= 75 ? '#065f46'  : '#854d0e',
            borderRadius: 10, padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700,
            alignSelf: 'flex-start',
          }}>
            {health.overall >= 85 ? '✦ Excellent' : health.overall >= 75 ? '✓ Good' : '⚡ Fair'}
          </div>
        </div>

        {/* Animated progress bar */}
        <div style={{ height: 6, background: '#f0f0f0', borderRadius: 999, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 999,
            width: `${health.overall}%`,
            background: 'linear-gradient(90deg, #00e5cc 0%, #00b8a4 100%)',
            transition: 'width 800ms cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>

        {/* Sub-scores */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 18 }}>
          <SubScore label="Retention"  value={health.retention}  />
          <SubScore label="Engagement" value={health.engagement} />
          <SubScore label="Growth"     value={health.growth}     />
        </div>

        {/* Interpretation */}
        <p style={{ color: '#6b7280', fontSize: '0.86rem', lineHeight: 1.55, margin: 0 }}>
          {health.interpretation}
        </p>
      </div>

      {/* ── Section B: Sparkline + Peak Insight ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>

        {/* Mini sparkline */}
        <div style={card}>
          <p style={{ color: '#5f5f5f', fontSize: '0.82rem', fontWeight: 600, marginBottom: 20 }}>
            Stamps this week
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 72, marginBottom: 14 }}>
            {weekData.map(d => {
              const h  = Math.max(4, Math.round((d.stamps / maxWeekStamps) * 64))
              const hi = d.stamps === maxWeekStamps
              return (
                <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: '100%', height: h,
                    background: hi ? '#00e5cc' : '#d1d5db',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 500ms ease, background 300ms',
                    boxShadow: hi ? '0 0 10px rgba(0,229,204,0.35)' : 'none',
                  }} />
                  <span style={{ fontSize: '0.65rem', color: hi ? '#00b8a4' : '#9ca3af', fontWeight: hi ? 700 : 400 }}>
                    {d.label}
                  </span>
                </div>
              )
            })}
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.84rem', margin: 0 }}>
            Your busiest day was <strong style={{ color: '#0f0f0f' }}>{DAY_NAMES[busiestDay] ?? busiestDay}</strong>
          </p>
        </div>

        {/* Peak insight */}
        <div style={card}>
          <p style={{ color: '#5f5f5f', fontSize: '0.82rem', fontWeight: 600, marginBottom: 12 }}>
            Best time to reward
          </p>
          <p style={{ fontWeight: 900, fontSize: '2.2rem', letterSpacing: '-0.04em', color: '#0f0f0f', marginBottom: 8, lineHeight: 1 }}>
            08:00 – 10:00
          </p>
          <p style={{ color: '#374151', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 10 }}>
            62% of your stamps happen during morning rush
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: 1.55, margin: 0 }}>
            Quietest slot: <strong style={{ color: '#6b7280' }}>Tue 14:00–16:00</strong> — consider a double-stamp promotion
          </p>
        </div>
      </div>

      {/* ── Section C: Needs Your Attention ──────────────────────────────── */}
      {attentionItems === null ? (
        <div style={{
          ...card,
          borderLeft: '4px solid #22c55e',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>✅</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#166534', margin: '0 0 2px' }}>
              Everything looks great this month!
            </p>
            <p style={{ color: '#4ade80', fontSize: '0.83rem', margin: 0 }}>
              All key metrics are trending positively. No action required.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ ...card, borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: '0.9rem' }}>⚠️</span>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em', margin: 0 }}>
              Needs your attention
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {attentionItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 0', gap: 16, flexWrap: 'wrap',
                  borderTop: i > 0 ? '1px solid #f5f5f5' : undefined,
                }}
              >
                <p style={{ color: '#374151', fontSize: '0.88rem', margin: 0, lineHeight: 1.45 }}>
                  {item.text}
                </p>
                <button
                  onClick={() => onTabChange(item.tab)}
                  style={{
                    flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
                    color: '#6b7280', fontSize: '0.82rem', fontWeight: 600,
                    padding: '3px 0', fontFamily: 'inherit',
                    textDecoration: 'underline', textDecorationColor: '#d1d5db',
                    textUnderlineOffset: 3,
                  }}
                >
                  {item.linkLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section D: Quick Actions ──────────────────────────────────────── */}
      <div style={{ ...card, padding: '20px 24px' }}>
        <p style={{ fontWeight: 700, fontSize: '0.92rem', letterSpacing: '-0.02em', marginBottom: 14 }}>
          Quick actions
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'Notify lapsed users nearby', onClick: () => onTabChange('insights')  },
            { label: 'Download last invoice',       onClick: downloadLastInvoice            },
            { label: 'View full analytics →',       onClick: () => onTabChange('analytics') },
          ].map(action => (
            <button
              key={action.label}
              onClick={action.onClick}
              style={{
                padding: '8px 18px', background: 'transparent', color: '#374151',
                border: '1px solid #dadada', borderRadius: 999, fontWeight: 600,
                fontSize: '0.84rem', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'border-color 150ms, color 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#9ca3af'; e.currentTarget.style.color = '#0f0f0f' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#dadada'; e.currentTarget.style.color = '#374151' }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Existing billing summary card ─────────────────────────────────── */}
      <div style={{
        background: '#0f0f0f', borderRadius: 20, padding: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 500, marginBottom: 6 }}>
            This month's billing summary
          </p>
          <p style={{ color: '#fff', fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.04em' }}>
            {formatMoney(monthlyBilled)}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginTop: 6 }}>
            {formatNumber(5720)} stamps × €{PRICE_PER_STAMP.toFixed(2)} / stamp
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', marginBottom: 2 }}>Invoice status</p>
            <span style={{
              background: '#fef9c3', color: '#854d0e',
              borderRadius: 999, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 700,
            }}>Pending</span>
          </div>
          <button
            onClick={() => onTabChange('billing')}
            style={{
              background: 'rgba(255,255,255,0.12)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999,
              padding: '9px 18px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            View billing →
          </button>
        </div>
      </div>

    </div>
  )
}
