'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import * as topojson from 'topojson-client'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { PRIVACY_THRESHOLD } from '@/lib/mockData'

// ── Projection presets ────────────────────────────────────────────────────────

const WORLD_CENTER   = [0, 20]      as [number, number]
const AUSTRIA_CENTER = [13.5, 47.5] as [number, number]
const WORLD_SCALE    = 160
const AUSTRIA_SCALE  = 2800
const MIN_SCALE      = 160
const MAX_SCALE      = 6000
const ZOOM_FACTOR    = 1.5

// ── Data sources ──────────────────────────────────────────────────────────────

const WORLD_URL     = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const NUTS2_URL     = 'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_20M_2021_4326_LEVL_2.geojson'
const US_ATLAS_URL  = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'
const NE_ADMIN1_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson'

// ── European NUTS2 prefixes to render as detail layer ─────────────────────────

const EUROPE_PREFIXES = new Set(['AT', 'DE', 'CH', 'CZ', 'HU', 'SK', 'SI', 'IT', 'FR', 'PL'])

// ── ISO numeric (3-digit padded) → ISO alpha-2 — only for country-level data keys ─
// US/CA/AU are excluded — they now use state-level data keys

const NUMERIC_TO_ISO2: Record<string, string> = {
  '392': 'JP',
  '826': 'GB',
  '076': 'BR',
  '702': 'SG',
  '784': 'AE',
}

// ── Country numeric ID (3-digit padded) → display name ───────────────────────

const countryNames: Record<string, string> = {
  '004': 'Afghanistan',
  '008': 'Albania',
  '012': 'Algeria',
  '024': 'Angola',
  '032': 'Argentina',
  '036': 'Australia',
  '040': 'Austria',
  '050': 'Bangladesh',
  '056': 'Belgium',
  '068': 'Bolivia',
  '076': 'Brazil',
  '100': 'Bulgaria',
  '116': 'Cambodia',
  '120': 'Cameroon',
  '124': 'Canada',
  '144': 'Sri Lanka',
  '152': 'Chile',
  '156': 'China',
  '158': 'Taiwan',
  '170': 'Colombia',
  '191': 'Croatia',
  '192': 'Cuba',
  '203': 'Czech Republic',
  '208': 'Denmark',
  '218': 'Ecuador',
  '231': 'Ethiopia',
  '246': 'Finland',
  '250': 'France',
  '276': 'Germany',
  '288': 'Ghana',
  '300': 'Greece',
  '320': 'Guatemala',
  '332': 'Haiti',
  '340': 'Honduras',
  '348': 'Hungary',
  '356': 'India',
  '360': 'Indonesia',
  '364': 'Iran',
  '368': 'Iraq',
  '372': 'Ireland',
  '376': 'Israel',
  '380': 'Italy',
  '388': 'Jamaica',
  '392': 'Japan',
  '400': 'Jordan',
  '404': 'Kenya',
  '410': 'South Korea',
  '414': 'Kuwait',
  '422': 'Lebanon',
  '458': 'Malaysia',
  '484': 'Mexico',
  '504': 'Morocco',
  '528': 'Netherlands',
  '554': 'New Zealand',
  '566': 'Nigeria',
  '578': 'Norway',
  '586': 'Pakistan',
  '604': 'Peru',
  '608': 'Philippines',
  '616': 'Poland',
  '620': 'Portugal',
  '630': 'Puerto Rico',
  '634': 'Qatar',
  '642': 'Romania',
  '643': 'Russia',
  '682': 'Saudi Arabia',
  '694': 'Sierra Leone',
  '702': 'Singapore',
  '703': 'Slovakia',
  '705': 'Slovenia',
  '706': 'Somalia',
  '710': 'South Africa',
  '716': 'Zimbabwe',
  '724': 'Spain',
  '752': 'Sweden',
  '756': 'Switzerland',
  '760': 'Syria',
  '764': 'Thailand',
  '784': 'United Arab Emirates',
  '788': 'Tunisia',
  '792': 'Turkey',
  '800': 'Uganda',
  '804': 'Ukraine',
  '818': 'Egypt',
  '826': 'United Kingdom',
  '840': 'United States',
  '858': 'Uruguay',
  '862': 'Venezuela',
  '887': 'Yemen',
  '894': 'Zambia',
  '704': 'Vietnam',
}

// ── US state FIPS (2-digit string) → state abbreviation ──────────────────────

const FIPS_TO_ABBR: Record<string, string> = {
  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO',
  '09': 'CT', '10': 'DE', '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID',
  '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA',
  '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
  '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ',
  '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH', '40': 'OK',
  '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD', '47': 'TN',
  '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV',
  '55': 'WI', '56': 'WY',
}

// ── US state FIPS (2-digit string) → display name ────────────────────────────

const US_STATE_NAMES: Record<string, string> = {
  '01': 'Alabama',        '02': 'Alaska',         '04': 'Arizona',
  '05': 'Arkansas',       '06': 'California',      '08': 'Colorado',
  '09': 'Connecticut',    '10': 'Delaware',        '12': 'Florida',
  '13': 'Georgia',        '15': 'Hawaii',          '16': 'Idaho',
  '17': 'Illinois',       '18': 'Indiana',         '19': 'Iowa',
  '20': 'Kansas',         '21': 'Kentucky',        '22': 'Louisiana',
  '23': 'Maine',          '24': 'Maryland',        '25': 'Massachusetts',
  '26': 'Michigan',       '27': 'Minnesota',       '28': 'Mississippi',
  '29': 'Missouri',       '30': 'Montana',         '31': 'Nebraska',
  '32': 'Nevada',         '33': 'New Hampshire',   '34': 'New Jersey',
  '35': 'New Mexico',     '36': 'New York',        '37': 'North Carolina',
  '38': 'North Dakota',   '39': 'Ohio',            '40': 'Oklahoma',
  '41': 'Oregon',         '42': 'Pennsylvania',    '44': 'Rhode Island',
  '45': 'South Carolina', '46': 'South Dakota',    '47': 'Tennessee',
  '48': 'Texas',          '49': 'Utah',            '50': 'Vermont',
  '51': 'Virginia',       '53': 'Washington',      '54': 'West Virginia',
  '55': 'Wisconsin',      '56': 'Wyoming',
}

// ── Canadian province/territory name → ISO code ───────────────────────────────

const CA_PROVINCE_TO_ABBR: Record<string, string> = {
  'Alberta':                    'AB',
  'British Columbia':           'BC',
  'Manitoba':                   'MB',
  'New Brunswick':              'NB',
  'Newfoundland and Labrador':  'NL',
  'Northwest Territories':      'NT',
  'Nova Scotia':                'NS',
  'Nunavut':                    'NU',
  'Ontario':                    'ON',
  'Prince Edward Island':       'PE',
  'Quebec':                     'QC',
  'Québec':                     'QC',
  'Saskatchewan':               'SK',
  'Yukon':                      'YT',
}

// ── Australian state/territory name → code ───────────────────────────────────

const AU_STATE_TO_ABBR: Record<string, string> = {
  'New South Wales':              'NSW',
  'Victoria':                     'VIC',
  'Queensland':                   'QLD',
  'Western Australia':            'WA',
  'South Australia':              'SA',
  'Tasmania':                     'TAS',
  'Northern Territory':           'NT',
  'Australian Capital Territory': 'ACT',
}

// ── Map dimensions ────────────────────────────────────────────────────────────

const MAP_HEIGHT_CSS = 'min(480px, 60vh)'
const SVG_WIDTH      = 800
const SVG_HEIGHT     = 480

// ── Color scale ───────────────────────────────────────────────────────────────

function getBaseFill(code: string, activeData: Record<string, number>): string {
  const users = activeData[code]
  if (users === undefined) return '#F4F4F5'
  if (users < PRIVACY_THRESHOLD) return '#E4E4E7'
  if (users <= 20)  return '#FED7AA'
  if (users <= 50)  return '#FDBA74'
  if (users <= 100) return '#F97316'
  return '#D97706'
}

const HOVER_FILL: Record<string, string> = {
  '#F4F4F5': '#D4D4D8',
  '#E4E4E7': '#D4D4D8',
  '#FED7AA': '#FDBA74',
  '#FDBA74': '#F97316',
  '#F97316': '#EA6C06',
  '#D97706': '#B45309',
}

// ── Legend ────────────────────────────────────────────────────────────────────

const LEGEND = [
  { color: '#F4F4F5', label: 'No users' },
  { color: '#FED7AA', label: '1–20' },
  { color: '#FDBA74', label: '21–50' },
  { color: '#F97316', label: '51–100' },
  { color: '#D97706', label: '100+' },
  { color: '#E4E4E7', label: 'Privacy threshold not met' },
]

// ── Types ─────────────────────────────────────────────────────────────────────

interface TooltipState {
  name: string
  code: string
  x: number
  y: number
}

export interface MapProps {
  activeData: Record<string, number>
  hoveredRegionId: string | null
  onHoverRegion: (id: string | null) => void
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function MapSkeleton() {
  return (
    <div
      style={{
        width: '100%',
        height: MAP_HEIGHT_CSS,
        background: '#FAF8F4',
        borderRadius: 12,
        border: '1px solid #D4D4D8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          className="animate-spin"
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '2.5px solid #E4E4E7',
            borderTopColor: '#D97706',
            margin: '0 auto 12px',
          }}
        />
        <p style={{ color: '#A1A1AA', fontSize: '0.85rem', margin: 0 }}>Loading map…</p>
      </div>
    </div>
  )
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function MapTooltip({
  tooltip,
  containerWidth,
  activeData,
}: {
  tooltip: TooltipState
  containerWidth: number
  activeData: Record<string, number>
}) {
  const TIP_WIDTH = 220
  const users = activeData[tooltip.code]

  let userLine: React.ReactNode
  if (users === undefined || users === 0) {
    userLine = (
      <span style={{ color: '#A1A1AA', fontSize: '0.82rem', fontStyle: 'italic' }}>
        No users yet
      </span>
    )
  } else if (users < PRIVACY_THRESHOLD) {
    userLine = (
      <span style={{ color: '#A1A1AA', fontSize: '0.82rem', fontStyle: 'italic' }}>
        — (private)
      </span>
    )
  } else {
    userLine = (
      <span style={{ color: '#D97706', fontWeight: 700, fontSize: '0.88rem' }}>
        {users.toLocaleString('de-DE')} users
      </span>
    )
  }

  const left =
    tooltip.x + 14 + TIP_WIDTH > containerWidth
      ? tooltip.x - TIP_WIDTH - 10
      : tooltip.x + 14
  const top = Math.max(8, tooltip.y - 48)

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: TIP_WIDTH,
        background: '#fff',
        border: '1px solid #D4D4D8',
        borderRadius: 10,
        padding: '10px 14px',
        pointerEvents: 'none',
        zIndex: 20,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        fontFamily: 'inherit',
      }}
    >
      <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 5px', color: '#0f0f0f', lineHeight: 1.3 }}>
        {tooltip.name}
      </p>
      <div>{userLine}</div>
    </div>
  )
}

// ── Zoom button ───────────────────────────────────────────────────────────────

function ZoomButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        border: `1px solid ${!disabled && hovered ? '#D97706' : '#D4D4D8'}`,
        borderRadius: 8,
        fontSize: 18,
        lineHeight: 1,
        color: disabled ? '#D4D4D8' : hovered ? '#D97706' : '#0F0F12',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'border-color 150ms ease, color 150ms ease',
        fontFamily: 'inherit',
        padding: 0,
      }}
    >
      {label}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Nuts2ChoroplethMap({ activeData, hoveredRegionId, onHoverRegion }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [worldData, setWorldData]         = useState<any | null>(null)
  const [nuts2Data, setNuts2Data]         = useState<object | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [usStatesData, setUsStatesData]   = useState<any | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [adminData, setAdminData]         = useState<any | null>(null)
  const [loading, setLoading]             = useState(true)
  const [tooltip, setTooltip]             = useState<TooltipState | null>(null)
  const [scale, setScale]                 = useState(WORLD_SCALE)
  const [center, setCenter]               = useState<[number, number]>(WORLD_CENTER)
  const [isFocused, setIsFocused]         = useState(false)

  const canZoomIn  = scale < MAX_SCALE
  const canZoomOut = scale > MIN_SCALE

  // Phase 1: world + NUTS2. Phase 2 (lazy): US states + CA/AU provinces.
  useEffect(() => {
    Promise.all([
      fetch(WORLD_URL).then(r => r.json()),
      fetch(NUTS2_URL).then(r => r.json()),
    ])
      .then(([world, nuts2]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setWorldData(topojson.feature(world as any, (world as any).objects.countries))
        setNuts2Data(nuts2)
        setLoading(false)

        // Lazy phase 2 — silent, no loading indicator
        Promise.all([
          fetch(US_ATLAS_URL).then(r => r.json()),
          fetch(NE_ADMIN1_URL).then(r => r.json()),
        ])
          .then(([usAtlas, neGeo]) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setUsStatesData(topojson.feature(usAtlas as any, (usAtlas as any).objects.states))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const caAuFeatures = (neGeo.features as any[]).filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (f: any) => f.properties.admin === 'Canada' || f.properties.admin === 'Australia'
            )
            setAdminData({ type: 'FeatureCollection', features: caAuFeatures })
          })
          .catch(() => { /* silent fail — US/CA/AU stay as country blocks */ })
      })
      .catch(() => setLoading(false))
  }, [])

  const handleMouseEnter = useCallback(
    (code: string, name: string, e: React.MouseEvent<SVGPathElement>) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      onHoverRegion(code)
      setTooltip({ name, code, x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    [onHoverRegion]
  )

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGPathElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip(prev =>
      prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null
    )
  }, [])

  const handleMouseLeave = useCallback(() => {
    onHoverRegion(null)
    setTooltip(null)
  }, [onHoverRegion])

  function handleFocusToggle() {
    if (isFocused) {
      setScale(WORLD_SCALE)
      setCenter(WORLD_CENTER)
      setIsFocused(false)
    } else {
      setScale(AUSTRIA_SCALE)
      setCenter(AUSTRIA_CENTER)
      setIsFocused(true)
    }
  }

  // Countries excluded from world layer because their state polygons are ready
  const excludeCountries = new Set<string>([
    ...(usStatesData ? ['840'] : []),
    ...(adminData    ? ['124', '036'] : []),
  ])

  if (loading) return <MapSkeleton />

  return (
    <div>
      {/* ── Map container ───────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: MAP_HEIGHT_CSS,
          border: '1px solid #D4D4D8',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#FAF8F4',
        }}
      >
        {/* ── Focus / World toggle — top right ──────────────────────────── */}
        <button
          onClick={handleFocusToggle}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            background: '#fff',
            border: '1px solid #E4E4E7',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: '0.72rem',
            color: '#71717A',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#D97706'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#D97706'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#E4E4E7'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#71717A'
          }}
        >
          {isFocused ? 'World view' : 'Focus on Austria'}
        </button>

        {/* ── Zoom buttons — bottom right ────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <ZoomButton
            label="+"
            disabled={!canZoomIn}
            onClick={() => setScale(s => Math.min(MAX_SCALE, Math.round(s * ZOOM_FACTOR)))}
          />
          <ZoomButton
            label="−"
            disabled={!canZoomOut}
            onClick={() => setScale(s => Math.max(MIN_SCALE, Math.round(s / ZOOM_FACTOR)))}
          />
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center, scale }}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <ZoomableGroup zoom={1} center={center} minZoom={1} maxZoom={1}>

            {/* ── Layer 1: World country polygons (base) ─────────────────── */}
            {worldData && (
              <Geographies geography={worldData}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const numId = String(geo.id).padStart(3, '0')
                    if (excludeCountries.has(numId)) return null

                    const iso2      = NUMERIC_TO_ISO2[numId]
                    const code      = iso2 ?? numId
                    const name      = countryNames[numId] ?? iso2 ?? numId
                    const isHovered = hoveredRegionId === code
                    const base      = getBaseFill(code, activeData)
                    const fill      = isHovered ? (HOVER_FILL[base] ?? base) : base

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke={isHovered ? '#D97706' : '#D4D4D8'}
                        strokeWidth={isHovered ? 1.5 : 0.5}
                        style={{
                          default: { outline: 'none', cursor: 'pointer' },
                          hover:   { outline: 'none', cursor: 'pointer' },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={e => handleMouseEnter(code, name, e)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      />
                    )
                  })
                }
              </Geographies>
            )}

            {/* ── Layer 2: NUTS2 regional detail (Europe only, on top) ───── */}
            {nuts2Data && (
              <Geographies geography={nuts2Data}>
                {({ geographies }) =>
                  geographies
                    .filter(geo =>
                      EUROPE_PREFIXES.has((geo.properties.NUTS_ID as string).slice(0, 2))
                    )
                    .map(geo => {
                      const code      = geo.properties.NUTS_ID as string
                      const name      = geo.properties.NUTS_NAME as string
                      const isHovered = hoveredRegionId === code
                      const base      = getBaseFill(code, activeData)
                      const fill      = isHovered ? (HOVER_FILL[base] ?? base) : base

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke={isHovered ? '#D97706' : '#E4E4E7'}
                          strokeWidth={isHovered ? 1.5 : 0.5}
                          style={{
                            default: { outline: 'none', cursor: 'pointer' },
                            hover:   { outline: 'none', cursor: 'pointer' },
                            pressed: { outline: 'none' },
                          }}
                          onMouseEnter={e => handleMouseEnter(code, name, e)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                        />
                      )
                    })
                }
              </Geographies>
            )}

            {/* ── Layer 3: US state polygons (loaded lazily) ─────────────── */}
            {usStatesData && (
              <Geographies geography={usStatesData}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const fips      = String(geo.id).padStart(2, '0')
                    const abbr      = FIPS_TO_ABBR[fips]
                    const code      = abbr ? `US-${abbr}` : `US-${fips}`
                    const name      = US_STATE_NAMES[fips] ?? code
                    const isHovered = hoveredRegionId === code
                    const base      = getBaseFill(code, activeData)
                    const fill      = isHovered ? (HOVER_FILL[base] ?? base) : base

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke={isHovered ? '#D97706' : '#D4D4D8'}
                        strokeWidth={isHovered ? 1.5 : 0.3}
                        style={{
                          default: { outline: 'none', cursor: 'pointer' },
                          hover:   { outline: 'none', cursor: 'pointer' },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={e => handleMouseEnter(code, name, e)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      />
                    )
                  })
                }
              </Geographies>
            )}

            {/* ── Layer 4: Canadian & Australian state/province polygons ──── */}
            {adminData && (
              <Geographies geography={adminData}>
                {({ geographies }) =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  geographies.map((geo: any) => {
                    const countryAdm = geo.properties.admin as string
                    const stateName  = geo.properties.name  as string
                    let code: string
                    if (countryAdm === 'Canada') {
                      const abbr = CA_PROVINCE_TO_ABBR[stateName]
                      code = abbr ? `CA-${abbr}` : `CA-?`
                    } else {
                      const abbr = AU_STATE_TO_ABBR[stateName]
                      code = abbr ? `AU-${abbr}` : `AU-?`
                    }
                    const name      = stateName
                    const isHovered = hoveredRegionId === code
                    const base      = getBaseFill(code, activeData)
                    const fill      = isHovered ? (HOVER_FILL[base] ?? base) : base

                    return (
                      <Geography
                        key={geo.rsmKey ?? `${countryAdm}-${stateName}`}
                        geography={geo}
                        fill={fill}
                        stroke={isHovered ? '#D97706' : '#D4D4D8'}
                        strokeWidth={isHovered ? 1.5 : 0.3}
                        style={{
                          default: { outline: 'none', cursor: 'pointer' },
                          hover:   { outline: 'none', cursor: 'pointer' },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={e => handleMouseEnter(code, name, e)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      />
                    )
                  })
                }
              </Geographies>
            )}

          </ZoomableGroup>
        </ComposableMap>

        {tooltip && (
          <MapTooltip
            tooltip={tooltip}
            containerWidth={containerRef.current?.offsetWidth ?? SVG_WIDTH}
            activeData={activeData}
          />
        )}
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 16px',
          marginTop: 12,
          paddingLeft: 2,
        }}
      >
        {LEGEND.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                flexShrink: 0,
                background: item.color,
                border: '1px solid #D4D4D8',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: '#71717A' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── Privacy footer ───────────────────────────────────────────────── */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#A1A1AA',
          fontStyle: 'italic',
          marginTop: 10,
          marginBottom: 0,
        }}
      >
        Your data is anonymised before being shared with cafés.{' '}
        Groups below {PRIVACY_THRESHOLD} users are not shown.
      </p>
    </div>
  )
}
