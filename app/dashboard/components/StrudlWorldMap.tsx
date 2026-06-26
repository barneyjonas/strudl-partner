'use client'
import { useState, useCallback, useRef, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import { geoNaturalEarth1 } from 'd3-geo'
import { PRIVACY_THRESHOLD, GLOBAL_CITIES, GlobalCity } from '@/lib/mockData'
import { formatNumber } from '@/lib/helpers'

// ── Constants ─────────────────────────────────────────────────────────────────

const TEAL    = '#00e5cc'
const BG      = '#060d12'
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const MAP_W   = 800
const MAP_H   = 500

// ── Pre-computed statics ──────────────────────────────────────────────────────

const HOME_CITY     = GLOBAL_CITIES.find(c => c.isHome)!
const VISIBLE       = GLOBAL_CITIES.filter(c => c.users >= PRIVACY_THRESHOLD)
const ACTIVE_COUNT  = VISIBLE.length
const ROUTE_COUNT   = VISIBLE.filter(c => !c.isHome).length
const COUNTRY_COUNT = new Set(VISIBLE.map(c => c.country)).size
const ARCS          = VISIBLE.filter(c => !c.isHome)
const MAX_USERS     = Math.max(...VISIBLE.map(c => c.users))

// Projection matching ComposableMap defaults: scale=160, translate=[w/2, h/2]
const proj = geoNaturalEarth1().scale(160).translate([MAP_W / 2, MAP_H / 2])

function projectPt(lng: number, lat: number): [number, number] | null {
  const r = proj([lng, lat])
  return r ? [r[0], r[1]] : null
}

// Quadratic Bézier arc: bow northward (-y) proportional to chord length
function makeArc(city: GlobalCity): string {
  const from = projectPt(city.lng, city.lat)
  const to   = projectPt(HOME_CITY.lng, HOME_CITY.lat)
  if (!from || !to) return ''
  const [x1, y1] = from
  const [x2, y2] = to
  const len = Math.hypot(x2 - x1, y2 - y1)
  const cx  = (x1 + x2) / 2
  const cy  = (y1 + y2) / 2 - len * 0.25
  return `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`
}

function dotR(users: number): number {
  return 3 + (users / MAX_USERS) * 4   // 3–7 px visual radius
}

// ── Component ─────────────────────────────────────────────────────────────────

type TipState = { city: GlobalCity; x: number; y: number }

export default function StrudlWorldMap() {
  const containerRef                = useRef<HTMLDivElement>(null)
  const [zoom,    setZoom]          = useState(1)
  const [center,  setCenter]        = useState<[number, number]>([0, 0])
  const [tooltip, setTooltip]       = useState<TipState | null>(null)

  // Pre-build arc paths once
  const arcs = useMemo(
    () => ARCS.map((city, i) => ({
      city,
      path:  makeArc(city),
      delay: (i * 0.22) % 3.5,   // stagger travel-dot start times
    })),
    []
  )

  const onMoveEnd = useCallback(
    ({ zoom: z, coordinates: c }: { zoom: number; coordinates: [number, number] }) => {
      setZoom(z)
      setCenter(c)
    }, []
  )

  const onReset = useCallback(() => {
    setZoom(1)
    setCenter([0, 0])
  }, [])

  const showTip = useCallback((city: GlobalCity, e: React.MouseEvent<SVGCircleElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip({ city, x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const moveTip = useCallback((city: GlobalCity, e: React.MouseEvent<SVGCircleElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip(prev => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null)
  }, [])

  const hideTip = useCallback(() => setTooltip(null), [])

  return (
    <div style={{
      position: 'relative',
      background: BG,
      borderRadius: 20,
      overflow: 'hidden',
      border: '1px solid #0a2a26',
      boxShadow: '0 12px 60px rgba(0,229,204,0.06)',
    }}>
      {/* ── Map ── */}
      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: MAP_H }}>
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 160 }}
          width={MAP_W}
          height={MAP_H}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={onMoveEnd}
            minZoom={1}
            maxZoom={8}
          >
            {/* Countries */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgba(0,229,204,0.05)"
                    stroke="rgba(0,229,204,0.2)"
                    strokeWidth={0.5 / zoom}
                    style={{
                      default: { fill: 'rgba(0,229,204,0.05)', outline: 'none' },
                      hover:   { fill: 'rgba(0,229,204,0.10)', outline: 'none' },
                      pressed: { fill: 'rgba(0,229,204,0.10)', outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Arcs — city → Vienna */}
            {arcs.map(({ city, path }) => (
              <path
                key={`arc-${city.city}`}
                d={path}
                fill="none"
                stroke={TEAL}
                strokeOpacity={0.45}
                strokeWidth={1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Animated travel dots along each arc */}
            {arcs.map(({ city, path, delay }) => (
              <circle
                key={`travel-${city.city}`}
                r={1.5 / zoom}
                fill={TEAL}
                fillOpacity={0.9}
              >
                <animateMotion
                  path={path}
                  dur="3.5s"
                  repeatCount="indefinite"
                  begin={`${delay}s`}
                />
              </circle>
            ))}

            {/* City dots + labels */}
            {VISIBLE.map(city => (
              <Marker key={city.city} coordinates={[city.lng, city.lat]}>
                <circle
                  r={dotR(city.users) / zoom}
                  fill={city.isHome ? '#ffffff' : TEAL}
                  fillOpacity={city.isHome ? 1 : 0.85}
                  style={{
                    cursor: 'pointer',
                    filter: `drop-shadow(0 0 ${3 / zoom}px ${city.isHome ? '#fff' : TEAL})`,
                  }}
                  onMouseEnter={e => showTip(city, e)}
                  onMouseMove={e => moveTip(city, e)}
                  onMouseLeave={hideTip}
                />
                <text
                  y={-(dotR(city.users) / zoom) - 2 / zoom}
                  textAnchor="middle"
                  fill={city.isHome ? '#ffffff' : 'rgba(0,229,204,0.8)'}
                  fontSize={9 / zoom}
                  fontFamily="system-ui,sans-serif"
                  fontWeight={city.isHome ? 700 : 400}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {city.city}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div style={{
            position: 'absolute',
            left: tooltip.x + 14,
            top:  tooltip.y - 54,
            background: '#061414',
            border: `1px solid ${TEAL}`,
            borderRadius: 10,
            padding: '10px 14px',
            fontFamily: 'system-ui,sans-serif',
            pointerEvents: 'none',
            zIndex: 20,
            boxShadow: '0 4px 20px rgba(0,229,204,0.15)',
            minWidth: 148,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: tooltip.city.isHome ? '#fff' : TEAL,
                boxShadow: `0 0 6px ${tooltip.city.isHome ? '#fff' : TEAL}`,
                flexShrink: 0,
              }} />
              <strong style={{ color: '#f4f4f5', fontSize: 13 }}>{tooltip.city.city}</strong>
              <span style={{
                color: '#2a6660', fontSize: 11,
                background: '#0a2a28', padding: '1px 5px', borderRadius: 4,
              }}>
                {tooltip.city.country}
              </span>
            </div>
            <div style={{ color: TEAL, fontSize: 12, fontWeight: 600 }}>
              {formatNumber(tooltip.city.users)} loyalty users
            </div>
            <div style={{ color: '#2a5a54', fontSize: 11, marginTop: 4 }}>
              {tooltip.city.isHome ? 'Home café ★' : '→ Vienna'}
            </div>
          </div>
        )}

        {/* Reset view — only visible when zoomed in */}
        {zoom > 1.01 && (
          <button
            onClick={onReset}
            style={{
              position: 'absolute', bottom: 14, right: 14,
              background: 'rgba(6,20,20,0.85)',
              border: '1px solid #1a5a54',
              borderRadius: 8,
              color: '#2a8a84',
              fontSize: 12,
              fontFamily: 'system-ui,sans-serif',
              padding: '5px 11px',
              cursor: 'pointer',
              zIndex: 5,
            }}
          >
            Reset view
          </button>
        )}
      </div>

      {/* ── Left overlay: headline + stats ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: '38%', padding: '44px 40px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        pointerEvents: 'none',
        background: `linear-gradient(90deg, ${BG} 58%, rgba(6,13,18,0) 100%)`,
      }}>
        <h2 style={{
          color: '#f4f4f5', fontSize: '2rem', fontWeight: 800,
          lineHeight: 1.12, letterSpacing: '-0.045em', margin: '0 0 12px',
        }}>
          Every visit<br />
          builds <span style={{ color: TEAL }}>loyalty.</span>
        </h2>

        <p style={{
          color: '#2a5a54', fontSize: '0.82rem', lineHeight: 1.6,
          margin: '0 0 36px', maxWidth: 230,
        }}>
          See where your customers come from.{' '}
          {ACTIVE_COUNT} cities. {ROUTE_COUNT} connections.
          One loyal community.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { value: ACTIVE_COUNT,  label: 'ACTIVE CITIES'  },
            { value: ROUTE_COUNT,   label: 'LOYALTY ROUTES' },
            { value: COUNTRY_COUNT, label: 'COUNTRIES'      },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{
                color: TEAL, fontWeight: 900, fontSize: '2.4rem',
                letterSpacing: '-0.05em', lineHeight: 1,
              }}>
                {s.value}
              </span>
              <span style={{
                color: '#2a5a54', fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.13em',
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Privacy note ── */}
      <div style={{
        position: 'absolute', bottom: 12, right: 16,
        color: '#173330', fontSize: '0.7rem',
        pointerEvents: 'none',
      }}>
        All data is aggregated. Individual users are never shown.
      </div>
    </div>
  )
}
