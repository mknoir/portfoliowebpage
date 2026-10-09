'use client'

import { useEffect, useId, useRef, useState } from 'react'
import * as THREE from 'three'
import { Pause, Play, RotateCcw } from 'lucide-react'
import '@/styles/observatory-scene.css'

type SceneState = 'loading' | 'ready' | 'unavailable'
type SceneController = { toggle: () => void; reset: () => void }

const STATIC_STRANDS = [1, -1].map((side) => Array.from({ length: 101 }, (_, index) => {
  const t = index / 100
  return `${index ? 'L' : 'M'}${400 + Math.sin(t * Math.PI * 4.5) * 68 * side},${120 + t * 460}`
}).join(' '))

/** A small point-cloud specimen; the surrounding desktop owns its layout. */
export default function ObservatoryScene() {
  const hostRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<SceneController | null>(null)
  const [sceneState, setSceneState] = useState<SceneState>('loading')
  const [paused, setPaused] = useState(true)
  const instructionsId = `observatory-instructions-${useId()}`

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const phone = window.matchMedia('(max-width: 700px), (pointer: coarse)').matches
    let playing = !motionPreference.matches
    let disposed = false
    let failed = false
    let firstFrame = true
    let renderer: THREE.WebGLRenderer | undefined
    let frame: number | null = null
    let lastTime = 0
    let lastRender = 0
    let elapsed = 0
    let pointerId: number | null = null
    let pointerX = 0
    let pointerY = 0
    let userX = 0.12
    let userY = -0.24
    let parallaxX = 0
    let parallaxY = 0
    let autoRotation = 0
    let resizeObserver: ResizeObserver | undefined
    let intersectionObserver: IntersectionObserver | undefined
    const initialBounds = host.getBoundingClientRect()
    let onScreen = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight
      && initialBounds.right > 0 && initialBounds.left < window.innerWidth

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
    const specimen = new THREE.Group()
    const tracks = new THREE.Group()
    scene.add(specimen, tracks)
    setPaused(!playing)

    const canRender = () => !disposed && !failed && onScreen && !document.hidden

    function cancelFrame() {
      if (frame !== null) window.cancelAnimationFrame(frame)
      frame = null
      lastTime = 0
      lastRender = 0
    }

    function unavailable() {
      if (disposed || failed) return
      failed = true
      playing = false
      cancelFrame()
      setPaused(true)
      setSceneState('unavailable')
    }

    function draw() {
      if (!renderer || !canRender()) return
      specimen.rotation.set(userX + parallaxY, userY + autoRotation + parallaxX, -0.3)
      specimen.position.y = Math.sin(elapsed * 0.4) * 0.035
      tracks.rotation.set(userX * 0.2 + parallaxY, userY * 0.2 + autoRotation * 0.18, -0.14)
      try {
        renderer.render(scene, camera)
        if (firstFrame) {
          firstFrame = false
          setSceneState('ready')
        }
      } catch {
        unavailable()
      }
    }

    function tick(timestamp: number) {
      frame = null
      if (!canRender()) return
      const delta = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.05) : 0
      lastTime = timestamp
      if (playing) {
        elapsed += delta
        autoRotation += delta * 0.075
      }
      // A slow desktop specimen does not need to redraw at display refresh rate.
      if (!playing || !lastRender || timestamp - lastRender >= 1000 / 30) {
        draw()
        lastRender = timestamp
      }
      if (playing && canRender()) frame = window.requestAnimationFrame(tick)
    }

    function requestDraw() {
      if (canRender() && frame === null) frame = window.requestAnimationFrame(tick)
    }

    function synchronizeVisibility() {
      cancelFrame()
      requestDraw()
    }

    function toggle() {
      if (disposed || failed) return
      playing = !playing
      parallaxX = 0
      parallaxY = 0
      setPaused(!playing)
      cancelFrame()
      requestDraw()
    }

    function reset() {
      userX = 0.12
      userY = -0.24
      parallaxX = 0
      parallaxY = 0
      autoRotation = 0
      elapsed = 0
      requestDraw()
    }

    function resize() {
      if (!renderer || disposed || failed) return
      const bounds = host!.getBoundingClientRect()
      if (bounds.width <= 0 || bounds.height <= 0) return
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.25 : 1.5))
      renderer.setSize(bounds.width, bounds.height, false)
      camera.aspect = bounds.width / bounds.height
      // Reserve air around the specimen for the desktop's files and windows.
      const visibleHeight = Math.max(6.9, 5.4 / camera.aspect)
      camera.position.set(0, 0, visibleHeight / (2 * Math.tan(THREE.MathUtils.degToRad(19))))
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
      requestDraw()
    }

    function pointerDown(event: PointerEvent) {
      if (failed || event.button !== 0 || pointerId !== null) return
      pointerId = event.pointerId
      pointerX = event.clientX
      pointerY = event.clientY
      canvas!.dataset.dragging = 'true'
      if (event.pointerType === 'mouse') canvas!.focus({ preventScroll: true })
      try { canvas!.setPointerCapture(event.pointerId) } catch { /* Pointer already ended. */ }
    }

    function pointerMove(event: PointerEvent) {
      if (failed) return
      if (pointerId === event.pointerId) {
        userY += (event.clientX - pointerX) * 0.006
        userX = THREE.MathUtils.clamp(userX + (event.clientY - pointerY) * 0.004, -0.7, 0.7)
        pointerX = event.clientX
        pointerY = event.clientY
        requestDraw()
      } else if (playing && event.pointerType === 'mouse') {
        const bounds = canvas!.getBoundingClientRect()
        parallaxX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.12
        parallaxY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.06
      }
    }

    function pointerEnd(event: PointerEvent) {
      if (event.pointerId !== pointerId) return
      pointerId = null
      canvas!.dataset.dragging = 'false'
      if (canvas!.hasPointerCapture(event.pointerId)) canvas!.releasePointerCapture(event.pointerId)
    }

    function pointerLeave() {
      if (pointerId === null) {
        parallaxX = 0
        parallaxY = 0
      }
    }

    function keyDown(event: KeyboardEvent) {
      if (failed || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', ' '].includes(event.key)) return
      event.preventDefault()
      if (event.key === ' ') toggle()
      else if (event.key === 'Home') reset()
      else {
        if (event.key === 'ArrowLeft') userY -= 0.16
        if (event.key === 'ArrowRight') userY += 0.16
        if (event.key === 'ArrowUp') userX = Math.max(-0.7, userX - 0.12)
        if (event.key === 'ArrowDown') userX = Math.min(0.7, userX + 0.12)
        requestDraw()
      }
    }

    function contextLost(event: Event) {
      event.preventDefault()
      unavailable()
    }

    function motionChanged() {
      if (motionPreference.matches) {
        playing = false
        parallaxX = 0
        parallaxY = 0
        setPaused(true)
        cancelFrame()
        requestDraw()
      }
    }

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !phone, powerPreference: 'low-power' })
      renderer.setClearColor(0x12130f, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace

      const helixPoint = (t: number, side = 1, radius = 0.71) => {
        const angle = t * Math.PI * 4.5 + (side < 0 ? Math.PI : 0)
        return new THREE.Vector3(Math.cos(angle) * radius, (t - 0.5) * 4.65, Math.sin(angle) * radius)
      }
      // A deterministic cloud avoids random geometry changes on remount.
      let seed = 38121
      const random = () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
      }
      const positions: number[] = []
      const colors: number[] = []
      const amber = new THREE.Color(0xd7ae60)
      const ivory = new THREE.Color(0xeee5ca)
      const steps = phone ? 115 : 180
      const samples = phone ? 5 : 8
      for (const side of [-1, 1]) {
        const guide: THREE.Vector3[] = []
        for (let step = 0; step < steps; step += 1) {
          const t = step / (steps - 1)
          const center = helixPoint(t, side)
          guide.push(center)
          for (let sample = 0; sample < samples; sample += 1) {
            const fuzz = sample === 0 ? 0 : 0.055
            positions.push(center.x + (random() - 0.5) * fuzz, center.y + (random() - 0.5) * fuzz, center.z + (random() - 0.5) * fuzz)
            const color = (side > 0 ? ivory : amber).clone().multiplyScalar(0.45 + random() * 0.55)
            colors.push(color.r, color.g, color.b)
          }
        }
        specimen.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(guide), new THREE.LineBasicMaterial({ color: side > 0 ? 0xe1d4ad : 0xbe9249, transparent: true, opacity: 0.25 })))
      }

      const rungPositions: number[] = []
      const rungCount = phone ? 24 : 32
      for (let index = 0; index < rungCount; index += 1) {
        const t = (index + 1) / (rungCount + 1)
        const start = helixPoint(t)
        const end = helixPoint(t, -1)
        rungPositions.push(...start.toArray(), ...end.toArray())
        for (let point = 0; point < 15; point += 1) {
          const along = point / 14
          const position = start.clone().lerp(end, along)
          positions.push(position.x, position.y, position.z)
          const color = amber.clone().lerp(ivory, along).multiplyScalar(point % 3 === 0 ? 0.8 : 0.32)
          colors.push(color.r, color.g, color.b)
        }
      }
      const rungs = new THREE.BufferGeometry()
      rungs.setAttribute('position', new THREE.Float32BufferAttribute(rungPositions, 3))
      specimen.add(new THREE.LineSegments(rungs, new THREE.LineBasicMaterial({ color: 0xd4b474, transparent: true, opacity: 0.14 })))
      const cloud = new THREE.BufferGeometry()
      cloud.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      cloud.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      specimen.add(new THREE.Points(cloud, new THREE.PointsMaterial({ size: phone ? 0.031 : 0.024, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false })))

      // Dotted instrument tracks, rather than solid rings, keep the figure airy.
      const orbitPositions: number[] = []
      const orbitConfigs = [
        { radius: 2.7, tilt: 1.12, turn: 0.18 },
        { radius: 2.45, tilt: 0.35, turn: -0.75 },
        { radius: 2.15, tilt: -0.65, turn: 0.52 },
      ]
      orbitConfigs.forEach(({ radius, tilt, turn }, orbitIndex) => {
        const points: THREE.Vector3[] = []
        const transform = new THREE.Euler(tilt, turn, orbitIndex * 0.4)
        const count = phone ? 100 : 160
        for (let index = 0; index < count; index += 1) {
          const angle = index / count * Math.PI * 2
          const position = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0).applyEuler(transform)
          points.push(position)
          orbitPositions.push(...position.toArray())
        }
        tracks.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xb99450, transparent: true, opacity: 0.1 })))
        const markerPosition = points[Math.floor(count * (0.13 + orbitIndex * 0.25))]
        const markerGeometry = new THREE.BufferGeometry().setFromPoints([markerPosition])
        tracks.add(new THREE.Points(markerGeometry, new THREE.PointsMaterial({ color: 0xf0dca5, size: 0.075, transparent: true, opacity: 0.9, depthWrite: false })))
      })
      const orbitGeometry = new THREE.BufferGeometry()
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPositions, 3))
      tracks.add(new THREE.Points(orbitGeometry, new THREE.PointsMaterial({ color: 0xb29a67, size: 0.016, transparent: true, opacity: 0.38, depthWrite: false })))

      controllerRef.current = { toggle, reset }
      canvas.addEventListener('pointerdown', pointerDown)
      canvas.addEventListener('pointermove', pointerMove)
      canvas.addEventListener('pointerup', pointerEnd)
      canvas.addEventListener('pointercancel', pointerEnd)
      canvas.addEventListener('lostpointercapture', pointerEnd)
      canvas.addEventListener('pointerleave', pointerLeave)
      canvas.addEventListener('keydown', keyDown)
      canvas.addEventListener('webglcontextlost', contextLost)
      document.addEventListener('visibilitychange', synchronizeVisibility)
      motionPreference.addEventListener('change', motionChanged)
      window.addEventListener('resize', resize)
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(host)
      }
      if ('IntersectionObserver' in window) {
        intersectionObserver = new IntersectionObserver(([entry]) => {
          onScreen = entry.isIntersecting
          synchronizeVisibility()
        }, { threshold: 0.01 })
        intersectionObserver.observe(host)
      }
      resize()
    } catch {
      unavailable()
    }

    return () => {
      disposed = true
      cancelFrame()
      controllerRef.current = null
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      canvas.removeEventListener('pointerdown', pointerDown)
      canvas.removeEventListener('pointermove', pointerMove)
      canvas.removeEventListener('pointerup', pointerEnd)
      canvas.removeEventListener('pointercancel', pointerEnd)
      canvas.removeEventListener('lostpointercapture', pointerEnd)
      canvas.removeEventListener('pointerleave', pointerLeave)
      canvas.removeEventListener('keydown', keyDown)
      canvas.removeEventListener('webglcontextlost', contextLost)
      document.removeEventListener('visibilitychange', synchronizeVisibility)
      motionPreference.removeEventListener('change', motionChanged)
      window.removeEventListener('resize', resize)
      if (pointerId !== null && canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId)
      const geometries = new Set<THREE.BufferGeometry>()
      const materials = new Set<THREE.Material>()
      scene.traverse((object) => {
        const drawable = object as THREE.Points
        if (drawable.geometry) geometries.add(drawable.geometry)
        if (drawable.material) {
          for (const material of Array.isArray(drawable.material) ? drawable.material : [drawable.material]) materials.add(material)
        }
      })
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      scene.clear()
      renderer?.renderLists.dispose()
      renderer?.dispose()
      // React Strict Mode reuses this canvas for its second effect setup.
      // Losing its context here would make that renderer fail before drawing.
      // Disposed GPU resources are recreated; the browser owns context release.
    }
  }, [])

  return (
    <figure ref={hostRef} className="observatory-scene" data-state={sceneState}>
      <div className="observatory-scene-fallback" aria-hidden={sceneState !== 'unavailable'} role="img" aria-label="An amber DNA double helix with dotted orbital tracks">
        <svg viewBox="0 0 800 700" fill="none" focusable="false" aria-hidden="true">
          <g stroke="#b99450">
            <ellipse cx="400" cy="350" rx="263" ry="88" strokeOpacity=".28" strokeDasharray="1 5" transform="rotate(-17 400 350)" />
            <ellipse cx="400" cy="350" rx="245" ry="155" strokeOpacity=".17" strokeDasharray="1 5" transform="rotate(52 400 350)" />
          </g>
          <g transform="rotate(-17 400 350)">
            {Array.from({ length: 27 }, (_, index) => {
              const t = (index + 1) / 28
              const offset = Math.sin(t * Math.PI * 4.5) * 68
              const y = 120 + t * 460
              return <path key={index} d={`M${400 - offset},${y}H${400 + offset}`} stroke="#d4b474" strokeOpacity=".38" strokeDasharray="1 4" />
            })}
            {STATIC_STRANDS.map((path, index) => <path key={index} d={path} stroke={index ? '#eee5ca' : '#d7ae60'} strokeWidth="2" strokeDasharray="1 3" />)}
          </g>
        </svg>
      </div>
      <canvas
        ref={canvasRef}
        className="observatory-scene-canvas"
        role="img"
        aria-label="Interactive amber particle DNA sculpture"
        aria-describedby={instructionsId}
        aria-hidden={sceneState !== 'ready'}
        tabIndex={sceneState === 'ready' ? 0 : -1}
      />
      <figcaption id={instructionsId} className="observatory-scene-sr-only">
        {sceneState === 'unavailable' ? 'Static specimen. Interactive view unavailable.' : 'Drag to rotate the specimen. When focused, use arrow keys to rotate, space to pause or play, and Home to reset.'}
      </figcaption>
      {sceneState === 'ready' && <div className="observatory-scene-controls" role="group" aria-label="Specimen controls">
        <button type="button" onClick={() => controllerRef.current?.toggle()} aria-label={paused ? 'Play specimen motion' : 'Pause specimen motion'}>
          {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
          <span>{paused ? 'Resume' : 'Pause'}</span>
        </button>
        <button type="button" onClick={() => controllerRef.current?.reset()} aria-label="Reset specimen view" title="Reset specimen view">
          <RotateCcw size={12} aria-hidden="true" /><span>Reset view</span>
        </button>
      </div>}
    </figure>
  )
}
