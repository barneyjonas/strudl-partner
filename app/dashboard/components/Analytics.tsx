'use client'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { DataPoint, HourlyPoint, Period, Customer, peakOffPeakData } from '@/lib/mockData'
import { TodayStats, formatNumber } from '@/lib/helpers'

interface Props {
  period: Period
  data: DataPoint[]
  hourlyData: HourlyPoint[]
  todayStats: TodayStats
  customers: Customer[]
}

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #dadada', borderRadius: 20,
  padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
}
const panelHead: React.CSSProperties = {
  fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: 20,
}
const tooltipStyle = {
  contentStyle: { background: '#fff', border: '1px solid #dadada', borderRadius: 12, fontSize: 12 },
  cursor: { stroke: '#f0f0f0', strokeWidth: 1 },
}

// ── Insight engine ────────────────────────────────────────────────────────────

interface Insight {
  icon: string
  headline: string
  observation: string
  context: string
  action: string
}

function buildInsights(
  period: Period,
  data: DataPoint[],
  hourlyData: HourlyPoint[],
  retPct: number,
  totalNewUsers: number,
): Insight[] {
  const totalStamps = data.reduce((s, d) => s + d.stamps, 0)
  const peakHour = hourlyData.reduce((b, h) => h.visits > b.visits ? h : b, hourlyData[0])
  const peakPoint = data.reduce((b, d) => d.stamps > b.stamps ? d : b, data[0])
  const peakPct = Math.round((peakPoint.stamps / totalStamps) * 100)

  const periodLabel = period === '7d' ? 'day' : period === '30d' ? 'day of the month' : 'month'

  const insights: Insight[] = []

  // ── Peak hour ────────────────────────────────────────────────────────────
  insights.push({
    icon: '🕘',
    headline: `Peak visit hour is ${peakHour.hour} — ${peakHour.visits} visits`,
    observation: `${peakHour.hour} is consistently your busiest window, accounting for more traffic than any other single hour of the day. ${peakHour.newVisits} of those are new customers and ${peakHour.returningVisits} are returning regulars.`,
    context: `The morning slot (8–10am) is a classic "ritual window" — people are building a pre-work coffee habit. This is one of the most durable patterns in café loyalty: once someone stamps in the morning three times, they almost never stop. The high returning-user share in this hour confirms the habit has set in.`,
    action: `Protect this window at all costs — never let queue length or card friction disrupt the morning ritual. A one-second slower stamp experience at 9am costs you more than at any other hour.`,
  })

  // ── Peak day / period ────────────────────────────────────────────────────
  if (period === '7d' && peakPoint.label === 'Sat') {
    insights.push({
      icon: '📅',
      headline: `Saturday is your strongest day — ${peakPoint.stamps} stamps (${peakPct}% of the week)`,
      observation: `Saturday outperformed every other day this week by a meaningful margin, with ${peakPoint.stamps} stamps — roughly ${Math.round(peakPoint.stamps / (totalStamps / 7))}× the daily average.`,
      context: `This Saturday likely benefited from elevated city footfall. Taylor Swift had a concert at the O2 Arena that weekend, drawing over 80,000 visitors into the area across Friday and Saturday. When a major event fills the city, cafés on busy routes see a natural lift — customers grab a coffee before or after. This is worth remembering: it wasn't just a good Saturday, it was a good Saturday because of something specific.`,
      action: `Keep an eye on upcoming stadium events (O2, Wembley, Hyde Park). Next time a major artist comes to town, consider a double-stamp weekend to capture the extra footfall intentionally rather than passively.`,
    })
  } else if (period === '7d') {
    insights.push({
      icon: '📅',
      headline: `${peakPoint.label} is your strongest day — ${peakPoint.stamps} stamps (${peakPct}% of the week)`,
      observation: `${peakPoint.label} outperformed every other day this week. Volume at this level suggests a recurring footfall pattern, not a one-off.`,
      context: `Weekday peaks often reflect a neighbourhood's working population — office workers, school-run parents, or commuters. Understanding which customer archetype drives your peak day helps you tailor your reward structure to reinforce that behaviour.`,
      action: `If this peak day repeats next week, treat it as a reliable anchor. Consider a "peak day bonus stamp" to accelerate loyalty for those customers.`,
    })
  } else {
    insights.push({
      icon: '📅',
      headline: `${period === '12m' ? peakPoint.label : `Day ${peakPoint.label}`} was your peak — ${peakPoint.stamps} stamps`,
      observation: `This was your highest stamp period across the entire ${period === '12m' ? 'year' : 'month'}, reaching ${peakPoint.stamps} stamps — ${pctAboveAvg(peakPoint.stamps, totalStamps, data.length)}% above average.`,
      context: `Volume spikes of this size rarely happen by accident. They typically trace back to a promotion, a local event, favourable weather, or a viral recommendation. Cross-referencing the spike date with your calendar often reveals a repeatable opportunity.`,
      action: `Identify what drove this peak and plan around it. If it was organic, document it. If it was a promotion, schedule a repeat.`,
    })
  }

  // ── Returning user dominance ─────────────────────────────────────────────
  if (retPct >= 55) {
    insights.push({
      icon: '🔄',
      headline: `Returning users dominate card activity — ${retPct}% of all stamps`,
      observation: `More than half of all stamp activity this period came from customers who have visited before. That ratio — ${retPct}% returning, ${100 - retPct}% new — is a strong signal that your loyalty programme is doing its job.`,
      context: `In café loyalty, a returning-user rate above 60% typically indicates that the reward mechanic has become part of the customer's routine. They're not just buying coffee — they're progressing toward a goal. That psychological commitment is worth more than a discount, because it changes behaviour before the reward is even given.`,
      action: `This is a healthy baseline. Focus on converting the remaining ${100 - retPct}% of new visitors into a second and third visit within the first two weeks — that's the window where habits form.`,
    })
  } else {
    insights.push({
      icon: '🔄',
      headline: `New customer acquisition is strong — ${100 - retPct}% of stamps are from new visitors`,
      observation: `A higher-than-usual share of stamps this period came from first-time customers. That's healthy growth, but it raises a question: are they coming back?`,
      context: `Acquiring a new customer is roughly 5× more expensive than retaining one. If new visitors don't return within 2 weeks, the likelihood of them ever returning drops sharply. The stamp card is your best re-engagement tool — make sure customers leave knowing exactly what they're working toward.`,
      action: `Prioritise second-visit conversion. A "welcome back" double-stamp on the second visit within 7 days is one of the highest-ROI moves in café loyalty.`,
    })
  }

  // ── New user acquisition trend ───────────────────────────────────────────
  insights.push({
    icon: '🌱',
    headline: `${formatNumber(totalNewUsers)} new users acquired this ${period === '7d' ? 'week' : period === '30d' ? 'month' : 'year'}`,
    observation: `New user acquisition was distributed across the ${periodLabel}s of this period. The lunch window (12–1pm) had the highest new-visitor share in absolute numbers, suggesting walk-in traffic from the surrounding area.`,
    context: `New customers during lunch hours often come from offices, shops, or passing foot traffic rather than residential regulars. They tend to have lower loyalty rates but higher order values. The stamp card is crucial for converting them — without it, most will never return.`,
    action: `Ensure the stamp card is offered proactively at checkout during lunch. A friendly "are you on our loyalty card?" question during this window can meaningfully improve new-to-returning conversion.`,
  })

  return insights
}

function pctAboveAvg(peak: number, total: number, count: number): number {
  const avg = total / count
  return Math.round(((peak - avg) / avg) * 100)
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Analytics({ period, data, hourlyData, todayStats, customers }: Props) {
  const totalStamps = data.reduce((s, d) => s + d.stamps, 0)
  const totalNewUsers = data.reduce((s, d) => s + d.newUsers, 0)
  const totalUsers = data.reduce((s, d) => s + d.users, 0)
  const activeCount = customers.filter(c => c.status === 'active').length
  const dormantCount = customers.filter(c => c.status === 'dormant').length
  const returningUsers = Math.max(0, totalUsers - totalNewUsers)

  const newPct  = totalUsers > 0 ? Math.round((totalNewUsers / totalUsers) * 100) : 0
  const retPct  = totalUsers > 0 ? Math.round((returningUsers / totalUsers) * 100) : 0
  const dormPct = Math.round((dormantCount / (activeCount + dormantCount)) * 100)

  const peakHour = hourlyData.reduce((b, h) => h.visits > b.visits ? h : b, hourlyData[0])
  const maturity = Math.min(100, Math.round((totalStamps / 10000) * 100))

  const insights = buildInsights(period, data, hourlyData, retPct, totalNewUsers)
  const peakOffPeak = peakOffPeakData[period]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Activity line chart */}
      <div style={card}>
        <p style={panelHead}>Loyalty Activity — {period}</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={44} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line type="monotone" dataKey="stamps"   name="Stamps"    stroke="#0f0f0f" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="users"    name="Users"     stroke="#9ca3af" strokeWidth={2}   strokeDasharray="5 4" dot={false} activeDot={{ r: 3 }} />
            <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#6366f1" strokeWidth={2}   strokeDasharray="2 3" dot={false} activeDot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly traffic + customer mix row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>

        {/* Hourly bar chart — stacked new / returning */}
        <div style={card}>
          <p style={panelHead}>Hourly Traffic</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <p style={{ color: '#5f5f5f', fontSize: '0.82rem', margin: 0 }}>
              Peak: <strong>{peakHour.hour}</strong> — {peakHour.visits} visits
              &nbsp;·&nbsp; {peakHour.newVisits} new &nbsp;·&nbsp; {peakHour.returningVisits} returning
            </p>
            <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#0f0f0f', display: 'inline-block' }} />
                New
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#9ca3af', display: 'inline-block' }} />
                Returning
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hourlyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              {/* Bottom of stack = returning (grey), top = new (black) */}
              <Bar dataKey="returningVisits" name="Returning" fill="#9ca3af" stackId="traffic" radius={[0, 0, 4, 4]} />
              <Bar dataKey="newVisits"       name="New"       fill="#0f0f0f" stackId="traffic" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer mix */}
        <div style={card}>
          <p style={panelHead}>Customer Mix</p>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: `${newPct}%`, background: '#6366f1' }} />
              <div style={{ width: `${retPct}%`, background: '#0f0f0f' }} />
              <div style={{ width: `${100 - newPct - retPct}%`, background: '#e5e7eb' }} />
            </div>
            {[
              { label: 'New users', pct: newPct, color: '#6366f1', count: totalNewUsers },
              { label: 'Returning', pct: retPct, color: '#0f0f0f', count: returningUsers },
              { label: 'Dormant',   pct: dormPct, color: '#9ca3af', count: dormantCount },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: row.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem' }}>{row.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem' }}>
                  <span style={{ color: '#5f5f5f' }}>{formatNumber(row.count)}</span>
                  <span style={{ fontWeight: 600 }}>{row.pct}%</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#f9f9f9', borderRadius: 12, padding: '12px 14px', fontSize: '0.82rem', color: '#5f5f5f' }}>
            Today: <strong style={{ color: '#0f0f0f' }}>{formatNumber(todayStats.newUsers)} new</strong>
            &nbsp;·&nbsp; {formatNumber(todayStats.activeUsers)} active
            &nbsp;·&nbsp; {todayStats.rewardsRedeemed} rewards redeemed
          </div>
        </div>
      </div>

      {/* Peak vs Off-Peak Stamp Ratio */}
      <div style={card}>
        <p style={panelHead}>Peak vs Off-Peak Stamp Ratio — {period}</p>
        <p style={{ color: '#5f5f5f', fontSize: '0.82rem', marginBottom: 20, marginTop: -12 }}>
          Morning rush (7–10am) and lunch window (11:30–2pm) vs. all other hours
        </p>

        {/* Ratio bar */}
        <div style={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ width: `${peakOffPeak.peakPct}%`, background: '#f59e0b', transition: 'width 600ms ease' }} />
          <div style={{ width: `${peakOffPeak.offPeakPct}%`, background: '#d1d5db', transition: 'width 600ms ease' }} />
        </div>

        {/* Legend rows */}
        {[
          { label: 'Peak hours',  pct: peakOffPeak.peakPct,    color: '#f59e0b', desc: '7–10am & 11:30–2pm' },
          { label: 'Off-peak',    pct: peakOffPeak.offPeakPct, color: '#d1d5db', desc: 'All other hours'     },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0', borderBottom: '1px solid #f5f5f5',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: row.color, flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{row.label}</span>
                <span style={{ color: '#9ca3af', fontSize: '0.78rem', marginLeft: 8 }}>{row.desc}</span>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{row.pct}%</span>
          </div>
        ))}

        <p style={{
          fontSize: '0.84rem', color: '#374151', marginTop: 16,
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: 10, padding: '10px 14px', lineHeight: 1.55,
        }}>
          {peakOffPeak.interpretation}
        </p>
      </div>

      {/* Operator notes — computed insight cards */}
      <div style={card}>
        <p style={panelHead}>Operator Notes</p>
        <p style={{ color: '#5f5f5f', fontSize: '0.85rem', marginBottom: 24, marginTop: -12 }}>
          Highlights from your data, explained in plain language.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {insights.map((ins, i) => (
            <div
              key={i}
              style={{
                padding: '22px 0',
                borderTop: i > 0 ? '1px solid #f0f0f0' : undefined,
              }}
            >
              {/* Headline row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 10, background: '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0,
                }}>
                  {ins.icon}
                </span>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em', lineHeight: 1.4, margin: 0, paddingTop: 6 }}>
                  {ins.headline}
                </p>
              </div>

              {/* Body */}
              <div style={{ paddingLeft: 48, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.65, margin: 0 }}>
                  {ins.observation}
                </p>
                {/* Context block — slightly inset */}
                <div style={{
                  background: '#f9f9f9', borderLeft: '3px solid #e5e7eb',
                  borderRadius: '0 8px 8px 0', padding: '10px 14px',
                }}>
                  <p style={{ fontSize: '0.85rem', color: '#5f5f5f', lineHeight: 1.65, margin: 0 }}>
                    {ins.context}
                  </p>
                </div>
                {/* Action suggestion */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f0f0f', background: '#f0f0f0', borderRadius: 6, padding: '2px 7px', flexShrink: 0, marginTop: 2 }}>
                    Action
                  </span>
                  <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
                    {ins.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics maturity */}
      <div style={card}>
        <p style={panelHead}>Analytics Maturity</p>
        <p style={{ color: '#5f5f5f', fontSize: '0.85rem', marginBottom: 20 }}>
          Based on stamp volume and engagement depth.
        </p>
        {[
          { label: 'Stamp Volume',  pct: Math.min(100, Math.round(totalStamps / 80)), unlocked: totalStamps > 1000 },
          { label: 'Loyalty Depth', pct: Math.min(100, Math.round(totalNewUsers / 10)), unlocked: totalNewUsers > 50 },
          { label: 'Repeat Rate',   pct: retPct, unlocked: retPct > 50 },
          { label: 'Peak Insights', pct: 100, unlocked: true },
        ].map(m => (
          <div key={m.label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: 5 }}>
              <span style={{ fontWeight: 500 }}>{m.label}</span>
              <span style={{ color: m.unlocked ? '#166534' : '#9ca3af', fontWeight: 600 }}>
                {m.unlocked ? '✓ Unlocked' : 'Locked'}
              </span>
            </div>
            <div style={{ height: 6, background: '#f0f0f0', borderRadius: 999 }}>
              <div style={{ height: '100%', width: `${m.pct}%`, background: m.unlocked ? '#0f0f0f' : '#d1d5db', borderRadius: 999, transition: 'width 600ms ease' }} />
            </div>
          </div>
        ))}
        <p style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: 4 }}>
          Overall maturity: {maturity}% — {maturity >= 80 ? 'Advanced' : maturity >= 40 ? 'Growing' : 'Early stage'}
        </p>
      </div>

    </div>
  )
}
