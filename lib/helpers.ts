export const PRICE_PER_STAMP = 0.05
export const NOTIFICATION_COST = 0.10

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toLocaleString()
}

export function formatMoney(n: number, symbol = '€'): string {
  return `${symbol}${n.toFixed(2)}`
}

export function revenueFromStamps(stamps: number): number {
  return stamps * PRICE_PER_STAMP
}

export function averageVisits(customers: { visits: number }[]): number {
  if (!customers.length) return 0
  return Math.round(customers.reduce((s, c) => s + c.visits, 0) / customers.length)
}

// Returns an SVG polyline path string from an array of values
export function chartPath(data: number[], width: number, height: number): string {
  if (!data.length) return ''
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const step = data.length > 1 ? width / (data.length - 1) : 0
  return data
    .map((v, i) => {
      const x = +(i * step).toFixed(1)
      const y = +(height - ((v - min) / range) * height).toFixed(1)
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`
    })
    .join(' ')
}

// Deterministic pseudo-random (sin hash) — no Math.random for hydration safety
export function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export interface TodayStats {
  stampsToday: number
  activeUsers: number
  newUsers: number
  rewardsRedeemed: number
  billableToday: number
}

export function generateTodayStats(tick: number): TodayStats {
  const r = (i: number) => seededRandom(tick * 97 + i)
  const stamps = Math.round(200 + r(0) * 100)
  return {
    stampsToday: stamps,
    activeUsers: Math.round(130 + r(1) * 70),
    newUsers: Math.round(12 + r(2) * 22),
    rewardsRedeemed: Math.round(6 + r(3) * 14),
    billableToday: +revenueFromStamps(stamps).toFixed(2),
  }
}

// --- Sanity checks (dev only) ---
export const sanityResults = (() => {
  const checks: [string, boolean][] = [
    ['revenueFromStamps(10) = 0.5',          revenueFromStamps(10) === 0.5],
    ['revenueFromStamps(0) = 0',            revenueFromStamps(0) === 0],
    ['formatNumber(1000) includes k',       formatNumber(1000).includes('k')],
    ['formatNumber(1500000) includes M',    formatNumber(1_500_000).includes('M')],
    ['chartPath([1,2,3],100,50) starts M',  chartPath([1, 2, 3], 100, 50).startsWith('M')],
    ['chartPath([],100,50) is empty',       chartPath([], 100, 50) === ''],
    ['averageVisits([10,20]) = 15',         averageVisits([{ visits: 10 }, { visits: 20 }]) === 15],
    ['averageVisits([]) = 0',               averageVisits([]) === 0],
  ]
  const failures = checks.filter(([, ok]) => !ok).map(([name]) => name)
  if (failures.length && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    console.error('[strudl] Sanity check failures:', failures)
  }
  return { total: checks.length, passed: checks.length - failures.length, failures }
})()
