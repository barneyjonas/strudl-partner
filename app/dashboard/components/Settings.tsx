'use client'
import { useState } from 'react'

const defaultSettings = {
  businessName: 'The Corner Brew',
  location: 'London, UK',
  rewardRule: 'Every 10th coffee free',
  email: 'hello@thecornerbrew.com',
  reward: 'Free coffee',
}

const REWARD_OPTIONS = ['Free coffee', 'Discount voucher (10%)', 'Free pastry', 'Loyalty bonus points']

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
type Day = typeof DAYS[number]

interface DaySchedule { open: boolean; from: string; to: string }
type WeeklySchedule = Record<Day, DaySchedule>

const defaultSchedule: WeeklySchedule = {
  Monday:    { open: true,  from: '08:00', to: '18:00' },
  Tuesday:   { open: true,  from: '08:00', to: '18:00' },
  Wednesday: { open: true,  from: '08:00', to: '18:00' },
  Thursday:  { open: true,  from: '08:00', to: '18:00' },
  Friday:    { open: true,  from: '08:00', to: '19:00' },
  Saturday:  { open: true,  from: '09:00', to: '17:00' },
  Sunday:    { open: false, from: '10:00', to: '16:00' },
}

interface SpecialDate { id: string; dateFrom: string; dateTo?: string; label: string }

const defaultSpecialDates: SpecialDate[] = [
  { id: 'sd1', dateFrom: '2026-12-25', label: 'Christmas Day' },
  { id: 'sd2', dateFrom: '2026-12-26', label: 'Boxing Day' },
  { id: 'sd3', dateFrom: '2027-01-01', label: "New Year's Day" },
]

// ─── Shared styles ────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 20,
  padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
}

const fieldLabel: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 6, color: 'var(--text)',
}

const input: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid var(--line)',
  borderRadius: 10, fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none',
  transition: 'border-color 160ms', boxSizing: 'border-box',
  background: 'var(--bg)', color: 'var(--text)',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        position: 'relative', flexShrink: 0,
        width: 40, height: 22, borderRadius: 999,
        background: checked ? '#0f0f0f' : '#e5e7eb',
        border: 'none', cursor: 'pointer',
        transition: 'background 160ms',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 160ms', display: 'block',
      }} />
    </button>
  )
}

function formatDate(d: string) {
  const [y, m, day] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`
}

function formatDateRange(from: string, to?: string) {
  if (!to || to === from) return formatDate(from)
  const [fy, fm, fd] = from.split('-')
  const [ty, tm, td] = to.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  if (fy === ty && fm === tm) return `${parseInt(fd)}–${parseInt(td)} ${months[parseInt(tm)-1]} ${ty}`
  if (fy === ty) return `${parseInt(fd)} ${months[parseInt(fm)-1]} – ${parseInt(td)} ${months[parseInt(tm)-1]} ${ty}`
  return `${formatDate(from)} – ${formatDate(to)}`
}

// ─── Main component ───────────────────────────────────────────────────────────

interface SettingsProps {
  darkMode: boolean
  onDarkModeChange: (v: boolean) => void
}

export default function Settings({ darkMode, onDarkModeChange }: SettingsProps) {
  const [form, setForm] = useState(defaultSettings)
  const [saved, setSaved] = useState(false)
  const [schedule, setSchedule] = useState<WeeklySchedule>(defaultSchedule)
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>(defaultSpecialDates)
  const [entryMode, setEntryMode] = useState<'single' | 'range'>('single')
  const [newDate, setNewDate] = useState('')
  const [newDateTo, setNewDateTo] = useState('')
  const [newDateLabel, setNewDateLabel] = useState('')

  function setField(k: keyof typeof defaultSettings, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    setSaved(false)
  }

  function toggleDay(day: Day) {
    setSchedule(s => ({ ...s, [day]: { ...s[day], open: !s[day].open } }))
    setSaved(false)
  }

  function setTime(day: Day, field: 'from' | 'to', value: string) {
    setSchedule(s => ({ ...s, [day]: { ...s[day], [field]: value } }))
    setSaved(false)
  }

  function addSpecialDate() {
    if (!newDate) return
    if (entryMode === 'range' && newDateTo && newDateTo < newDate) return
    const entry: SpecialDate = {
      id: Math.random().toString(36).slice(2),
      dateFrom: newDate,
      dateTo: entryMode === 'range' && newDateTo ? newDateTo : undefined,
      label: newDateLabel.trim() || 'Closed',
    }
    setSpecialDates(prev =>
      [...prev, entry].sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))
    )
    setNewDate('')
    setNewDateTo('')
    setNewDateLabel('')
    setSaved(false)
  }

  function removeSpecialDate(id: string) {
    setSpecialDates(prev => prev.filter(x => x.id !== id))
    setSaved(false)
  }

  function save(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Appearance ────────────────────────────────────────────────────── */}
        <div style={card}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: 20, color: 'var(--text)' }}>
            Appearance
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: 2 }}>Dark mode</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Switch the dashboard to a dark theme</p>
            </div>
            <Toggle checked={darkMode} onChange={() => onDarkModeChange(!darkMode)} />
          </div>
        </div>

        {/* ── Business details ──────────────────────────────────────────────── */}
        <div style={card}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: 20 }}>
            Business Details
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={fieldLabel}>Business Name</label>
              <input
                style={input} value={form.businessName}
                onChange={e => setField('businessName', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                onBlur={e => (e.target.style.borderColor = 'var(--line)')}
              />
            </div>

            <div>
              <label style={fieldLabel}>Location</label>
              <input
                style={input} value={form.location}
                onChange={e => setField('location', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                onBlur={e => (e.target.style.borderColor = 'var(--line)')}
              />
            </div>

            <div>
              <label style={fieldLabel}>Contact Email</label>
              <input
                type="email" style={input} value={form.email}
                onChange={e => setField('email', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                onBlur={e => (e.target.style.borderColor = 'var(--line)')}
              />
            </div>

          </div>
        </div>

        {/* ── Loyalty programme ─────────────────────────────────────────────── */}
        <div style={card}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: 20, color: 'var(--text)' }}>
            Loyalty Programme
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={fieldLabel}>Reward Rule</label>
              <input
                style={input} value={form.rewardRule}
                onChange={e => setField('rewardRule', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                onBlur={e => (e.target.style.borderColor = 'var(--line)')}
              />
              <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 5 }}>
                Describe when customers earn their reward.
              </p>
            </div>

            <div>
              <label style={fieldLabel}>Default Reward</label>
              <select
                value={form.reward}
                onChange={e => setField('reward', e.target.value)}
                style={{ ...input, cursor: 'pointer' }}
              >
                {REWARD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

          </div>
        </div>

        {/* ── Opening hours ─────────────────────────────────────────────────── */}
        <div style={card}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: 4, color: 'var(--text)' }}>
            Opening Hours
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 20 }}>
            Set your regular weekly schedule.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {DAYS.map(day => {
              const d = schedule[day]
              return (
                <div key={day} style={{
                  display: 'flex', alignItems: 'center', gap: 14, minHeight: 38,
                  paddingBottom: 10, borderBottom: '1px solid var(--line)',
                }}>
                  <Toggle checked={d.open} onChange={() => toggleDay(day)} />

                  <span style={{
                    width: 96, fontSize: '0.88rem', fontWeight: 600,
                    color: d.open ? 'var(--text)' : 'var(--muted)', flexShrink: 0,
                  }}>
                    {day}
                  </span>

                  {d.open ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="time"
                        value={d.from}
                        onChange={e => setTime(day, 'from', e.target.value)}
                        style={{
                          padding: '5px 10px', border: '1px solid var(--line)',
                          borderRadius: 8, fontSize: '0.85rem', fontFamily: 'inherit',
                          outline: 'none', cursor: 'pointer', background: 'var(--bg)', color: 'var(--text)',
                        }}
                        onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--line)')}
                      />
                      <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>–</span>
                      <input
                        type="time"
                        value={d.to}
                        onChange={e => setTime(day, 'to', e.target.value)}
                        style={{
                          padding: '5px 10px', border: '1px solid var(--line)',
                          borderRadius: 8, fontSize: '0.85rem', fontFamily: 'inherit',
                          outline: 'none', cursor: 'pointer', background: 'var(--bg)', color: 'var(--text)',
                        }}
                        onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--line)')}
                      />
                    </div>
                  ) : (
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      Closed
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Special closed dates ──────────────────────────────────────────── */}
        <div style={card}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Special Closed Dates
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: 20 }}>
            National holidays, local events, or any one-off date you'll be closed.
          </p>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 2, gap: 2, alignSelf: 'flex-start', marginBottom: 14 }}>
            {(['single', 'range'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => { setEntryMode(m); setNewDateTo('') }}
                style={{
                  padding: '5px 14px', borderRadius: 6,
                  background: entryMode === m ? 'var(--bg)' : 'transparent',
                  border: entryMode === m ? '1px solid var(--line)' : '1px solid transparent',
                  fontWeight: 600, fontSize: '0.8rem',
                  color: entryMode === m ? 'var(--text)' : 'var(--muted)',
                  cursor: 'pointer', transition: 'all 140ms', fontFamily: 'inherit',
                  boxShadow: entryMode === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {m === 'single' ? 'Single date' : 'Date range'}
              </button>
            ))}
          </div>

          {/* Add row */}
          {(() => {
            const canAdd = !!newDate && (entryMode === 'single' || (!!newDateTo && newDateTo >= newDate))
            const dateInputStyle: React.CSSProperties = {
              padding: '8px 12px', border: '1px solid var(--line)',
              borderRadius: 10, fontSize: '0.88rem', fontFamily: 'inherit',
              outline: 'none', cursor: 'pointer', background: 'var(--bg)', color: 'var(--text)',
            }
            return (
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  style={dateInputStyle}
                  onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--line)')}
                />
                {entryMode === 'range' && (
                  <>
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem', flexShrink: 0 }}>–</span>
                    <input
                      type="date"
                      value={newDateTo}
                      min={newDate || undefined}
                      onChange={e => setNewDateTo(e.target.value)}
                      style={dateInputStyle}
                      onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--line)')}
                    />
                  </>
                )}
                <input
                  type="text"
                  placeholder={entryMode === 'range' ? 'Label (e.g. Summer holiday)' : 'Label (e.g. Christmas)'}
                  value={newDateLabel}
                  onChange={e => setNewDateLabel(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSpecialDate() } }}
                  style={{
                    flex: 1, minWidth: 160, padding: '8px 12px', border: '1px solid var(--line)',
                    borderRadius: 10, fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none',
                    background: 'var(--bg)', color: 'var(--text)',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--text)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--line)')}
                />
                <button
                  type="button"
                  onClick={addSpecialDate}
                  disabled={!canAdd}
                  style={{
                    padding: '8px 20px', borderRadius: 10,
                    background: canAdd ? '#0f0f0f' : 'var(--surface)',
                    color: canAdd ? '#fff' : 'var(--muted)',
                    border: '1px solid ' + (canAdd ? '#0f0f0f' : 'var(--line)'),
                    fontWeight: 600, fontSize: '0.88rem',
                    cursor: canAdd ? 'pointer' : 'default',
                    transition: 'all 160ms', fontFamily: 'inherit',
                  }}
                >
                  Add
                </button>
              </div>
            )
          })()}

          {/* Date list */}
          {specialDates.length === 0 ? (
            <p style={{
              color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center',
              padding: '14px 0', borderTop: '1px solid #f3f4f6',
            }}>
              No special dates yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {specialDates.map(sd => (
                <div key={sd.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#f9fafb', border: '1px solid #e5e7eb',
                  borderRadius: 10, padding: '10px 14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      background: '#fff', border: '1px solid #e5e7eb',
                      borderRadius: 6, padding: '2px 9px',
                      fontSize: '0.78rem', fontWeight: 700, color: '#374151',
                      letterSpacing: '0.01em', whiteSpace: 'nowrap',
                    }}>
                      {formatDateRange(sd.dateFrom, sd.dateTo)}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: '#374151' }}>{sd.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpecialDate(sd.id)}
                    title="Remove"
                    style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'transparent', border: '1px solid #e5e7eb',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#9ca3af', fontSize: '1rem', lineHeight: 1,
                      transition: 'all 160ms', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#fee2e2'
                      e.currentTarget.style.borderColor = '#fca5a5'
                      e.currentTarget.style.color = '#dc2626'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.color = '#9ca3af'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Save ──────────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            type="submit"
            style={{
              padding: '12px 28px', background: '#0f0f0f', color: '#fff',
              border: '1px solid #0f0f0f', borderRadius: 999, fontWeight: 700,
              fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Save changes
          </button>
          {saved && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#166534', fontWeight: 600, fontSize: '0.9rem',
            }}>
              ✓ Saved locally
            </span>
          )}
        </div>

        <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
          Settings are saved locally in your browser. Backend sync coming soon.
        </p>

      </form>
    </div>
  )
}
