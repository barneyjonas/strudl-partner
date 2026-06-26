'use client'
import { Invoice, billingProjection } from '@/lib/mockData'
import { formatMoney, formatNumber, PRICE_PER_STAMP } from '@/lib/helpers'

interface Props {
  invoices: Invoice[]
}

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #dadada', borderRadius: 20,
  padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
}

function generateInvoiceText(inv: Invoice): string {
  return [
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
    'BILLING DETAIL',
    '----------------------------------------',
    `Billed stamps:       ${inv.stamps.toLocaleString()}`,
    `Price per stamp:     €${PRICE_PER_STAMP.toFixed(2)}`,
    `Total amount:        €${inv.amount.toFixed(2)}`,
    '',
    '----------------------------------------',
    'PAYMENT',
    '----------------------------------------',
    `Amount due:          €${inv.amount.toFixed(2)}`,
    inv.status === 'paid' ? 'PAID — Thank you.' : 'PENDING — Due within 14 days.',
    '',
    '========================================',
    'Strudl · partners@strudl.app',
    '14 Blossom Street, London E1 6PL',
    '========================================',
  ].join('\n')
}

function downloadInvoice(inv: Invoice) {
  const text = generateInvoiceText(inv)
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${inv.id}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Billing({ invoices }: Props) {
  const current = invoices[0]
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)

  const { stampsToDate, daysElapsed, daysInMonth, lastMonthAmount } = billingProjection
  const stampsPerDay = Math.round(stampsToDate / daysElapsed)
  const projectedStamps = stampsPerDay * daysInMonth
  const projectedAmount = +(projectedStamps * PRICE_PER_STAMP).toFixed(2)
  const projectionHigher = projectedAmount > lastMonthAmount

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Current Month',    value: formatMoney(current.amount),        sub: current.period },
          { label: 'Billed Stamps',    value: formatNumber(current.stamps),       sub: `@ €${PRICE_PER_STAMP.toFixed(2)} / stamp` },
          { label: 'Price per Stamp',  value: `€${PRICE_PER_STAMP.toFixed(2)}`,   sub: 'Fixed rate' },
          { label: 'Total Paid (YTD)', value: formatMoney(totalPaid),             sub: '5 invoices paid' },
        ].map(s => (
          <div key={s.label} style={card}>
            <p style={{ color: '#5f5f5f', fontSize: '0.82rem', fontWeight: 500, marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.04em', marginBottom: 4 }}>{s.value}</p>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Projected Monthly Cost */}
      <div style={{
        ...card,
        background: '#f9fafb', border: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <p style={{ color: '#5f5f5f', fontSize: '0.82rem', fontWeight: 500, margin: 0 }}>Projected This Month</p>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, background: '#f3f4f6', color: '#6b7280',
              borderRadius: 6, padding: '1px 6px',
            }}>
              Estimate
            </span>
          </div>
          <p style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.04em', marginBottom: 6 }}>
            {formatMoney(projectedAmount)}
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: projectionHigher ? 6 : 0 }}>
            Based on {formatNumber(stampsPerDay)} stamps/day average ({daysElapsed} of {daysInMonth} days elapsed)
          </p>
          {projectionHigher && (
            <p style={{
              fontSize: '0.8rem', fontWeight: 600,
              color: '#b45309', background: '#fef3c7',
              borderRadius: 8, padding: '4px 10px', display: 'inline-block', margin: 0,
            }}>
              ↑ trending higher than last month ({formatMoney(lastMonthAmount)})
            </p>
          )}
        </div>
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14,
          padding: '14px 18px', minWidth: 160,
        }}>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: 4 }}>At current pace</p>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{formatNumber(projectedStamps)} stamps</p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>@ €{PRICE_PER_STAMP.toFixed(2)} / stamp</p>
        </div>
      </div>

      {/* Invoice list */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>Invoice History</h2>
        </div>

        {invoices.map((inv, i) => (
          <div
            key={inv.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', borderTop: i > 0 ? '1px solid #f5f5f5' : undefined,
              flexWrap: 'wrap', gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', flexShrink: 0,
              }}>
                🧾
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{inv.period}</p>
                <p style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{inv.id} · Issued {inv.issued}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{formatMoney(inv.amount)}</p>
                <p style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{formatNumber(inv.stamps)} stamps</p>
              </div>
              <span style={{
                display: 'inline-flex', padding: '3px 10px', borderRadius: 999,
                fontSize: '0.75rem', fontWeight: 700,
                background: inv.status === 'paid' ? '#dcfce7' : '#fef9c3',
                color: inv.status === 'paid' ? '#166534' : '#854d0e',
              }}>
                {inv.status === 'paid' ? 'Paid' : 'Pending'}
              </span>
              <button
                onClick={() => downloadInvoice(inv)}
                style={{
                  padding: '8px 14px', background: 'transparent', color: '#0f0f0f',
                  border: '1px solid #dadada', borderRadius: 999, fontWeight: 600,
                  fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Download ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Billing note */}
      <div style={{ background: '#f9f9f9', border: '1px solid #e5e7eb', borderRadius: 16, padding: '16px 20px' }}>
        <p style={{ fontSize: '0.85rem', color: '#5f5f5f' }}>
          Invoices are generated on the 1st of each month. Payment is due within 14 days.
          For billing queries, contact <strong>billing@strudl.app</strong>.
        </p>
      </div>

    </div>
  )
}
