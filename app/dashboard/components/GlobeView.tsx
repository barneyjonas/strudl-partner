'use client'
import type * as THREE_T from 'three'
import { useEffect, useRef, useState } from 'react'
import { PRIVACY_THRESHOLD } from '@/lib/mockData'
import type { CityGroup } from '@/lib/mockData'

// ── Static city coordinate table ──────────────────────────────────────────────

const CITY_COORDS: Record<string, [number, number]> = {
  Vienna:     [48.2082,  16.3738],
  Graz:       [47.0707,  15.4395],
  Linz:       [48.3069,  14.2858],
  Salzburg:   [47.8095,  13.0550],
  Munich:     [48.1351,  11.5820],
  Bratislava: [48.1486,  17.1077],
  Innsbruck:  [47.2692,  11.4041],
  Zürich:     [47.3769,   8.5417],
  Berlin:     [52.5200,  13.4050],
  Budapest:   [47.4979,  19.0402],
  Prague:     [50.0755,  14.4378],
  Amsterdam:  [52.3676,   4.9041],
}

const HOME_CITY     = 'Vienna'
const TAIL_SEGMENTS = 32
const GLOBE_R       = 1

// ── Types ─────────────────────────────────────────────────────────────────────

interface TooltipState {
  city: string; country: string; users: number; x: number; y: number
}

interface ArcState {
  curve:    THREE_T.QuadraticBezierCurve3
  progress: number
  speed:    number
  head:     THREE_T.Mesh
  tailGeo:  THREE_T.BufferGeometry
  tailPos:  Float32Array
}

interface DotState {
  core:  THREE_T.Mesh
  glow:  THREE_T.Mesh
  phase: number
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GlobeView({ cities }: { cities: CityGroup[] }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  useEffect(() => {
    const node = mountRef.current
    if (!node) return
    // Capture as non-null for the async closure
    const el: HTMLDivElement = node

    const shared = { animId: 0, dispose: () => {} }

    async function setup() {
      const THREE = await import('three')

      const W = el.clientWidth
      const H = Math.max(el.clientHeight, 420)

      // ── Renderer ───────────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      el.appendChild(renderer.domElement)

      // ── Scene & Camera ─────────────────────────────────────────────────────
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
      camera.position.z = 2.65

      // ── Lighting ───────────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.12))
      const sun = new THREE.DirectionalLight(0xd4d4f0, 0.9)
      sun.position.set(-4, 2, 4)
      scene.add(sun)

      // ── Lat/lng → 3-D position ─────────────────────────────────────────────
      function ll(lat: number, lng: number, r = GLOBE_R): THREE_T.Vector3 {
        const phi   = (90 - lat) * (Math.PI / 180)
        const theta = (lng + 180) * (Math.PI / 180)
        return new THREE.Vector3(
          -r * Math.sin(phi) * Math.cos(theta),
           r * Math.cos(phi),
           r * Math.sin(phi) * Math.sin(theta),
        )
      }

      // ── Globe group (everything that rotates) ──────────────────────────────
      const globe = new THREE.Group()
      scene.add(globe)

      // Globe surface
      globe.add(new THREE.Mesh(
        new THREE.SphereGeometry(GLOBE_R, 64, 64),
        new THREE.MeshPhongMaterial({ color: 0x18181b, shininess: 10, specular: 0x2a2a2e }),
      ))

      // ── Atmosphere (scene-level; rim-light shader always faces camera) ─────
      const atmosMat = new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(0x8b8b9e) } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 uColor;
          void main() {
            float d   = dot(vNormal, vec3(0.0, 0.0, 1.0));
            float rim = pow(clamp(0.58 - d, 0.0, 1.0), 4.5);
            gl_FragColor = vec4(uColor, rim * 0.72);
          }
        `,
        side:        THREE.BackSide,
        blending:    THREE.AdditiveBlending,
        transparent: true,
        depthWrite:  false,
      })
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R * 1.14, 64, 64), atmosMat))

      // ── Grid lines ────────────────────────────────────────────────────────
      const gridMat = new THREE.LineBasicMaterial({ color: 0x2d2d32, transparent: true, opacity: 0.55 })
      for (let lat = -60; lat <= 60; lat += 30) {
        const pts: THREE_T.Vector3[] = []
        for (let lng = 0; lng <= 362; lng += 3) pts.push(ll(lat, lng, GLOBE_R + 0.001))
        globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat))
      }
      for (let lng = 0; lng < 360; lng += 30) {
        const pts: THREE_T.Vector3[] = []
        for (let lat = -90; lat <= 90; lat += 3) pts.push(ll(lat, lng, GLOBE_R + 0.001))
        globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat))
      }

      // ── City dots ─────────────────────────────────────────────────────────
      const visibleCities = cities.filter(c => c.users >= PRIVACY_THRESHOLD && CITY_COORDS[c.city])
      const maxUsers      = Math.max(...visibleCities.map(c => c.users), 1)

      const hitMeshes: THREE_T.Mesh[] = []
      const hitCities: CityGroup[]    = []
      const pulseDots: DotState[]     = []

      visibleCities.forEach(city => {
        const coords  = CITY_COORDS[city.city]
        const isHome  = city.city === HOME_CITY
        const pos     = ll(coords[0], coords[1], GLOBE_R + 0.012)
        const sf      = 0.45 + (city.users / maxUsers) * 0.55
        const clr     = isHome ? 0xf4f4f5 : 0xfbbf24

        // Outer glow
        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.028 * sf, 10, 10),
          new THREE.MeshBasicMaterial({ color: clr, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }),
        )
        glow.position.copy(pos)
        globe.add(glow)

        // Core dot
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(0.013 * sf, 10, 10),
          new THREE.MeshBasicMaterial({ color: clr, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false }),
        )
        core.position.copy(pos)
        globe.add(core)

        pulseDots.push({ core, glow, phase: Math.random() * Math.PI * 2 })

        // Invisible hit sphere (larger hit area for comfort)
        const hit = new THREE.Mesh(
          new THREE.SphereGeometry(0.055 * sf, 6, 6),
          new THREE.MeshBasicMaterial({ visible: false }),
        )
        hit.position.copy(pos)
        globe.add(hit)
        hitMeshes.push(hit)
        hitCities.push(city)
      })

      // ── Arc comet animations ───────────────────────────────────────────────
      const homePos = ll(CITY_COORDS[HOME_CITY][0], CITY_COORDS[HOME_CITY][1], GLOBE_R + 0.012)

      // Comet-tail shader: fade from bright at index 0 (head) → transparent at tail end
      const tailVert = `
        attribute float aFade;
        varying float vFade;
        void main() {
          vFade = aFade;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `
      const tailFrag = `
        varying float vFade;
        void main() { gl_FragColor = vec4(0.98, 0.76, 0.14, vFade * 0.88); }
      `

      // Static per-vertex fade weights (never change)
      const staticFade = new Float32Array(TAIL_SEGMENTS)
      for (let i = 0; i < TAIL_SEGMENTS; i++) staticFade[i] = Math.pow(1 - i / TAIL_SEGMENTS, 1.8)

      const arcStates: ArcState[] = []

      visibleCities.filter(c => c.city !== HOME_CITY).forEach(city => {
        const coords = CITY_COORDS[city.city]
        if (!coords) return
        const startPos = ll(coords[0], coords[1], GLOBE_R + 0.012)
        const chord    = startPos.distanceTo(homePos)
        const mid      = startPos.clone().add(homePos).normalize().multiplyScalar(GLOBE_R + chord * 0.55 + 0.05)
        const curve    = new THREE.QuadraticBezierCurve3(startPos, mid, homePos.clone())

        // Head sphere
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(0.009, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }),
        )
        globe.add(head)

        // Tail geometry (positions updated each frame; fade weights are static)
        const tailPos = new Float32Array(TAIL_SEGMENTS * 3)
        const tailGeo = new THREE.BufferGeometry()
        tailGeo.setAttribute('position', new THREE.BufferAttribute(tailPos, 3))
        tailGeo.setAttribute('aFade',    new THREE.BufferAttribute(new Float32Array(staticFade), 1))
        tailGeo.setDrawRange(0, TAIL_SEGMENTS)

        globe.add(new THREE.Line(tailGeo, new THREE.ShaderMaterial({
          vertexShader:   tailVert,
          fragmentShader: tailFrag,
          transparent:    true,
          blending:       THREE.AdditiveBlending,
          depthWrite:     false,
        })))

        arcStates.push({ curve, progress: Math.random(), speed: 0.0022 + Math.random() * 0.0018, head, tailGeo, tailPos })
      })

      // ── Interaction ───────────────────────────────────────────────────────
      const raycaster = new THREE.Raycaster()
      const mouse     = new THREE.Vector2()
      let isDragging = false
      let lastX      = 0
      let rotationY  = -0.4   // offset so Europe sits centre-stage
      let hovered: CityGroup | null = null

      function onMouseMove(e: MouseEvent) {
        if (isDragging) {
          rotationY += (e.clientX - lastX) * 0.005
          lastX = e.clientX
        }

        const r = el.getBoundingClientRect()
        mouse.x = ((e.clientX - r.left) / r.width)  *  2 - 1
        mouse.y = ((e.clientY - r.top)  / r.height) * -2 + 1

        raycaster.setFromCamera(mouse, camera)
        const hits = raycaster.intersectObjects(hitMeshes)

        if (hits.length) {
          const idx  = hitMeshes.indexOf(hits[0].object as THREE_T.Mesh)
          const city = hitCities[idx]
          if (city && city !== hovered) {
            hovered = city
            const wp = new THREE.Vector3()
            hits[0].object.getWorldPosition(wp)
            wp.project(camera)
            setTooltip({
              city: city.city, country: city.country, users: city.users,
              x:  ( wp.x * 0.5 + 0.5) * el.clientWidth,
              y:  (-wp.y * 0.5 + 0.5) * el.clientHeight,
            })
          }
          el.style.cursor = 'pointer'
        } else {
          hovered = null
          setTooltip(null)
          el.style.cursor = isDragging ? 'grabbing' : 'grab'
        }
      }

      function onMouseDown(e: MouseEvent) { isDragging = true; lastX = e.clientX; el.style.cursor = 'grabbing' }
      function onMouseUp()                { isDragging = false; el.style.cursor = 'grab' }
      function onMouseLeave()             { isDragging = false; hovered = null; setTooltip(null) }

      el.addEventListener('mousemove',  onMouseMove)
      el.addEventListener('mousedown',  onMouseDown)
      el.addEventListener('mouseleave', onMouseLeave)
      window.addEventListener('mouseup', onMouseUp)

      function onResize() {
        const w = el.clientWidth, h = Math.max(el.clientHeight, 420)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      // ── Animation loop ────────────────────────────────────────────────────
      let clock = 0

      function animate() {
        shared.animId = requestAnimationFrame(animate)
        clock += 0.018

        if (!isDragging) rotationY += 0.0008
        globe.rotation.y = rotationY

        // Pulse city dots
        pulseDots.forEach(({ core, glow, phase }) => {
          const s = 1 + 0.22 * Math.sin(clock * 1.8 + phase)
          core.scale.setScalar(s)
          glow.scale.setScalar(1 + 0.38 * Math.sin(clock * 1.3 + phase + 0.7))
        })

        // Comet arcs
        arcStates.forEach(arc => {
          arc.progress = (arc.progress + arc.speed) % 1
          arc.head.position.copy(arc.curve.getPoint(arc.progress))

          for (let i = 0; i < TAIL_SEGMENTS; i++) {
            const t = Math.max(0, arc.progress - (i / TAIL_SEGMENTS) * 0.18)
            const p = arc.curve.getPoint(t)
            arc.tailPos[i * 3]     = p.x
            arc.tailPos[i * 3 + 1] = p.y
            arc.tailPos[i * 3 + 2] = p.z
          }
          arc.tailGeo.attributes.position.needsUpdate = true
        })

        renderer.render(scene, camera)
      }

      animate()

      // ── Cleanup ───────────────────────────────────────────────────────────
      shared.dispose = () => {
        cancelAnimationFrame(shared.animId)
        el.removeEventListener('mousemove',  onMouseMove)
        el.removeEventListener('mousedown',  onMouseDown)
        el.removeEventListener('mouseleave', onMouseLeave)
        window.removeEventListener('mouseup',  onMouseUp)
        window.removeEventListener('resize',   onResize)
        scene.traverse(obj => {
          const m = obj as THREE_T.Mesh
          if (m.geometry) m.geometry.dispose()
          if (m.material) {
            const mat = m.material
            if (Array.isArray(mat)) mat.forEach(x => x.dispose())
            else mat.dispose()
          }
        })
        renderer.dispose()
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      }
    }

    setup().catch(console.error)
    return () => shared.dispose()
  }, [cities])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={mountRef}
        style={{ width: '100%', height: 420, cursor: 'grab', userSelect: 'none', display: 'block' }}
      />
      {tooltip && (
        <div style={{
          position:       'absolute',
          left:           tooltip.x,
          top:            tooltip.y - 70,
          transform:      'translate(-50%, 0)',
          background:     'rgba(9, 9, 11, 0.92)',
          backdropFilter: 'blur(8px)',
          border:         '1px solid #3f3f46',
          borderRadius:   10,
          padding:        '8px 13px',
          pointerEvents:  'none',
          zIndex:         20,
          whiteSpace:     'nowrap',
        }}>
          <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f4f4f5', margin: 0 }}>
            {tooltip.city}
          </p>
          <p style={{ color: '#a1a1aa', fontSize: '0.78rem', margin: '3px 0 0' }}>
            {tooltip.country} · {tooltip.users.toLocaleString()} users
          </p>
        </div>
      )}
    </div>
  )
}
