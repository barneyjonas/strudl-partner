'use client'
import { useState } from 'react'
import { Customer } from '@/lib/mockData'
import { formatNumber } from '@/lib/helpers'

interface Props {
  customers: Customer[]
}

type SortKey = 'name' | 'visits' | 'stamps'

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #dadada', borderRadius: 20,
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden',
}

function downloadCSV(customers: Customer[]) {
  const header = 'Name,Email,Café,Visits,Stamps,Last Visit,Status'
  const rows = customers.map(c =>
    `"${c.name}","${c.email}","${c.cafe}",${c.visits},${c.stamps},${c.lastVisit},${c.status}`
  )
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'strudl-customers.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function Customers({ customers }: Props) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('stamps')
  const [sortAsc, setSortAsc] = useState(false)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(false) }
  }

  const filtered = customers
    .filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.cafe.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      const va = sortKey === 'name' ? a.name : a[sortKey]
      const vb = sortKey === 'name' ? b.name : b[sortKey]
      return sortAsc
        ? va < vb ? -1 : va > vb ? 1 : 0
        : va > vb ? -1 : va < vb ? 1 : 0
    })

  const SortBtn = ({ label, k }: { label: string; k: SortKey }) => (
    <button
      onClick={() => toggleSort(k)}
      style={{
        background: sortKey === k ? '#0f0f0f' : 'transparent',
        color: sortKey === k ? '#fff' : '#5f5f5f',
        border: '1px solid ' + (sortKey === k ? '#0f0f0f' : '#dadada'),
        borderRadius: 999, padding: '6px 14px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
      }}
    >
      {label} {sortKey === k ? (sortAsc ? '↑' : '↓') : ''}
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search customers, cafés…"
          style={{
            flex: '1 1 220px', padding: '10px 14px', border: '1px solid #dadada',
            borderRadius: 999, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
          }}
          onFocus={e => (e.target.style.borderColor = '#0f0f0f')}
          onBlur={e => (e.target.style.borderColor = '#dadada')}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <SortBtn label="Name"   k="name"   />
          <SortBtn label="Visits" k="visits" />
          <SortBtn label="Stamps" k="stamps" />
        </div>
        <button
          onClick={() => downloadCSV(filtered)}
          style={{
            padding: '10px 18px', background: 'transparent', color: '#0f0f0f',
            border: '1px solid #dadada', borderRadius: 999, fontWeight: 600,
            fontSize: '0.88rem', cursor: 'pointer',
          }}
        >
          Export CSV ↓
        </button>
      </div>

      {/* Summary */}
      <p style={{ color: '#5f5f5f', fontSize: '0.85rem' }}>
        {filtered.length} of {customers.length} customers ·{' '}
        {customers.filter(c => c.status === 'active').length} active,{' '}
        {customers.filter(c => c.status === 'dormant').length} dormant
      </p>

      {/* Table */}
      <div style={card}>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</p>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>No customers found</p>
            <p style={{ color: '#5f5f5f', fontSize: '0.9rem' }}>Try a different search term.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                  {['Customer', 'Café', 'Visits', 'Stamps', 'Last Visit', 'Status'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', fontWeight: 600, color: '#5f5f5f', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderTop: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{c.email}</div>
                    </td>
                    <td style={{ padding: '13px 16px', color: '#5f5f5f' }}>{c.cafe}</td>
                    <td style={{ padding: '13px 16px', fontWeight: 600 }}>{c.visits}</td>
                    <td style={{ padding: '13px 16px', fontWeight: 600 }}>{formatNumber(c.stamps)}</td>
                    <td style={{ padding: '13px 16px', color: '#5f5f5f', whiteSpace: 'nowrap' }}>{c.lastVisit}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        display: 'inline-flex', padding: '3px 10px', borderRadius: 999,
                        fontSize: '0.75rem', fontWeight: 700,
                        background: c.status === 'active' ? '#dcfce7' : '#f3f4f6',
                        color: c.status === 'active' ? '#166534' : '#6b7280',
                      }}>
                        {c.status === 'active' ? 'Active' : 'Dormant'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
