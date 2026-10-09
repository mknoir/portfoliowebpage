'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import * as THREE from 'three'
import { buildLabModel, disposeLabModel, type LabStoryId } from '@/lib/lab-model'
import '@/styles/lab-scene.css'

type LabSceneProps = {
  activeId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  onReady?: () => void
}

type Controller = { reset: () => void; select: (id: string | null) => void }
type SceneState = 'loading' | 'ready' | 'unavailable'

export default function LabScene({ activeId, onHover, onSelect, onReady }: LabSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controllerRef = useRef<Controller | null>(null)
  const callbacksRef = useRef({ onHover, onSelect, onReady })
  const activeRef = useRef(activeId)
  const [state, setState] = useState<SceneState>('loading')
  const instructionsId = `lab-instructions-${useId()}`

  useEffect(() => {
    callbacksRef.current = { onHover, onSelect, onReady }
  }, [onHover, onSelect, onReady])

  useEffect(() => {
    activeRef.current = activeId
    controllerRef.current?.select(activeId)
  }, [activeId])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    let disposed = false
    let unavailable = false
    let hasRendered = false
    let renderer: THREE.WebGLRenderer | null = null
    let frame: number | null = null
    let hoveredId: LabStoryId | null = null
    let pointerId: number | null = null
    let dragStarted = false
    let pointerStartX = 0
    let pointerStartY = 0
    let pointerLastX = 0
    let pointerLastY = 0
    let yaw = 0.70
    let elevation = 0.81
    let onScreen = true
    let resizeObserver: ResizeObserver | undefined
    let intersectionObserver: IntersectionObserver | undefined
    const phone = window.matchMedia('(max-width: 700px), (pointer: coarse)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-8, 8, 6, -6, 0.1, 80)
    const target = new THREE.Vector3(0, 1.1, 0)
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const model = buildLabModel()
    scene.add(model.group)
    const roomBounds = new THREE.Box3().setFromObject(model.group)
    const corners: THREE.Vector3[] = []
    for (const x of [roomBounds.min.x, roomBounds.max.x]) for (const y of [roomBounds.min.y, roomBounds.max.y]) for (const z of [roomBounds.min.z, roomBounds.max.z]) corners.push(new THREE.Vector3(x, y, z))

    // Broad daylight, a soft warm key and a little cool bounce retain the physical model feel.
    const ambient = new THREE.HemisphereLight('#fcf8ed', '#a1b6b0', 2.55)
    scene.add(ambient)
    const keyLight = new THREE.DirectionalLight('#fff0d8', 3.5)
    keyLight.position.set(-3, 11, 7)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(phone ? 1024 : 2048, phone ? 1024 : 2048)
    keyLight.shadow.camera.left = -9
    keyLight.shadow.camera.right = 9
    keyLight.shadow.camera.top = 9
    keyLight.shadow.camera.bottom = -9
    keyLight.shadow.camera.near = 0.1
    keyLight.shadow.camera.far = 35
    keyLight.shadow.normalBias = 0.035
    keyLight.shadow.bias = -0.0001
    keyLight.shadow.radius = 4
    keyLight.target.position.set(0, 0, 0)
    scene.add(keyLight, keyLight.target)
    const fill = new THREE.DirectionalLight('#d5e7ec', 1.2)
    fill.position.set(7, 5, -5)
    scene.add(fill)
    const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ color: '#677e75', opacity: 0.16 }))
    shadowFloor.rotation.x = -Math.PI / 2
    shadowFloor.position.y = -0.4
    shadowFloor.receiveShadow = true
    scene.add(shadowFloor)

    function canRender() {
      return !disposed && !unavailable && onScreen && !document.hidden
    }

    function fail() {
      if (disposed || unavailable) return
      unavailable = true
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
      setState('unavailable')
      canvas!.dataset.hovering = 'false'
      callbacksRef.current.onHover(null)
    }

    function render() {
      frame = null
      if (!renderer || !canRender()) return
      try {
        renderer.render(scene, camera)
        if (!hasRendered) {
          hasRendered = true
          setState('ready')
          callbacksRef.current.onReady?.()
        }
      } catch {
        fail()
      }
    }

    // This scene renders on demand. Nothing spins while the visitor is reading a story.
    function requestDraw() {
      if (frame === null && canRender()) frame = requestAnimationFrame(render)
    }

    function updateHighlights() {
      const highlightedId = activeRef.current ?? hoveredId
      for (const [id, highlight] of model.highlights) {
        highlight.visible = id === highlightedId
        highlight.scale.setScalar(id === activeRef.current ? 1 : 0.95)
      }
      requestDraw()
    }

    function updateCamera() {
      if (!renderer) return
      const bounds = container!.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      const radius = 22
      camera.position.set(
        target.x + Math.sin(yaw) * Math.cos(elevation) * radius,
        target.y + Math.sin(elevation) * radius,
        target.z + Math.cos(yaw) * Math.cos(elevation) * radius,
      )
      camera.lookAt(target)
      camera.updateMatrixWorld(true)
      const inView = corners.map((corner) => corner.clone().applyMatrix4(camera.matrixWorldInverse))
      const minX = Math.min(...inView.map((point) => point.x))
      const maxX = Math.max(...inView.map((point) => point.x))
      const minY = Math.min(...inView.map((point) => point.y))
      const maxY = Math.max(...inView.map((point) => point.y))
      const aspect = bounds.width / bounds.height
      const visibleHeight = Math.max(maxY - minY, (maxX - minX) / aspect) * 1.075
      const visibleWidth = visibleHeight * aspect
      const centerX = (minX + maxX) / 2
      const centerY = (minY + maxY) / 2
      camera.left = centerX - visibleWidth / 2
      camera.right = centerX + visibleWidth / 2
      camera.top = centerY + visibleHeight / 2
      camera.bottom = centerY - visibleHeight / 2
      camera.updateProjectionMatrix()
      requestDraw()
    }

    function resize() {
      if (!renderer || disposed || unavailable) return
      const bounds = container!.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.4 : 1.75))
      renderer.setSize(bounds.width, bounds.height, false)
      updateCamera()
    }

    function hitTest(clientX: number, clientY: number): LabStoryId | null {
      const bounds = canvas!.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return null
      pointer.set((clientX - bounds.left) / bounds.width * 2 - 1, -((clientY - bounds.top) / bounds.height) * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      // Intersect the complete room first so a wall cannot be clicked through.
      const hits = raycaster.intersectObject(model.group, true)
      for (const hit of hits) {
        // The active torus is a cue, not an invisible target above another object.
        if (Array.from(model.highlights.values()).some((highlight) => hit.object.parent === highlight)) continue
        let item: THREE.Object3D | null = hit.object
        while (item && !item.userData.story) item = item.parent
        if (item?.userData.story) return item.userData.story as LabStoryId
        const material = (hit.object as THREE.Mesh).material
        if (material instanceof THREE.Material && material.transparent) continue
        return null
      }
      return null
    }

    function setHovered(id: LabStoryId | null) {
      if (hoveredId === id) return
      hoveredId = id
      canvas!.dataset.hovering = String(Boolean(id))
      callbacksRef.current.onHover(id)
      updateHighlights()
    }

    function pointerDown(event: PointerEvent) {
      if (unavailable || event.button !== 0 || pointerId !== null) return
      pointerId = event.pointerId
      dragStarted = false
      pointerStartX = pointerLastX = event.clientX
      pointerStartY = pointerLastY = event.clientY
      if (event.pointerType === 'mouse') canvas!.focus({ preventScroll: true })
    }

    function pointerMove(event: PointerEvent) {
      if (unavailable) return
      if (pointerId === event.pointerId) {
        if (Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY) > 7) {
          dragStarted = true
          canvas!.dataset.dragging = 'true'
          try { canvas!.setPointerCapture(event.pointerId) } catch { /* The OS can take over a vertical touch gesture. */ }
        }
        if (dragStarted) {
          yaw = THREE.MathUtils.clamp(yaw - (event.clientX - pointerLastX) * 0.0035, 0.32, 1.08)
          if (event.pointerType === 'mouse') elevation = THREE.MathUtils.clamp(elevation + (event.clientY - pointerLastY) * 0.0025, 0.52, 1.05)
          setHovered(null)
          updateCamera()
        }
        pointerLastX = event.clientX
        pointerLastY = event.clientY
      } else if (event.pointerType !== 'touch') {
        setHovered(hitTest(event.clientX, event.clientY))
      }
    }

    function releasePointer() {
      if (pointerId !== null && canvas!.hasPointerCapture(pointerId)) canvas!.releasePointerCapture(pointerId)
      pointerId = null
      canvas!.dataset.dragging = 'false'
    }

    function pointerUp(event: PointerEvent) {
      if (event.pointerId !== pointerId) return
      if (!dragStarted) {
        const id = hitTest(event.clientX, event.clientY)
        if (id) {
          callbacksRef.current.onSelect(id)
          setHovered(event.pointerType === 'touch' ? null : id)
        }
      }
      releasePointer()
    }

    function pointerCancel() {
      releasePointer()
      setHovered(null)
    }

    function pointerLeave() {
      if (pointerId === null) setHovered(null)
    }

    function reset() {
      yaw = 0.70
      elevation = 0.81
      updateCamera()
    }

    function keyDown(event: KeyboardEvent) {
      if (unavailable || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return
      event.preventDefault()
      if (event.key === 'Home') reset()
      else {
        if (event.key === 'ArrowLeft') yaw = Math.max(0.32, yaw - 0.075)
        if (event.key === 'ArrowRight') yaw = Math.min(1.08, yaw + 0.075)
        if (event.key === 'ArrowUp') elevation = Math.min(1.05, elevation + 0.065)
        if (event.key === 'ArrowDown') elevation = Math.max(0.52, elevation - 0.065)
        updateCamera()
      }
    }

    function visibilityChange() {
      if (document.hidden && frame !== null) { cancelAnimationFrame(frame); frame = null }
      else requestDraw()
    }

    function contextLost(event: Event) {
      event.preventDefault()
      fail()
    }

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !phone, alpha: true, powerPreference: 'low-power' })
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFShadowMap
      renderer.setClearColor('#e9ede6', 0)
      controllerRef.current = { reset, select: updateHighlights }
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(container)
      intersectionObserver = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting
        if (onScreen) requestDraw()
        else if (frame !== null) { cancelAnimationFrame(frame); frame = null }
      }, { rootMargin: '100px' })
      intersectionObserver.observe(container)
      canvas.addEventListener('pointerdown', pointerDown)
      canvas.addEventListener('pointermove', pointerMove)
      canvas.addEventListener('pointerup', pointerUp)
      canvas.addEventListener('pointercancel', pointerCancel)
      canvas.addEventListener('lostpointercapture', pointerCancel)
      canvas.addEventListener('pointerleave', pointerLeave)
      canvas.addEventListener('keydown', keyDown)
      canvas.addEventListener('webglcontextlost', contextLost)
      document.addEventListener('visibilitychange', visibilityChange)
      updateHighlights()
      resize()
    } catch {
      fail()
    }

    return () => {
      disposed = true
      controllerRef.current = null
      if (frame !== null) cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      canvas.removeEventListener('pointerdown', pointerDown)
      canvas.removeEventListener('pointermove', pointerMove)
      canvas.removeEventListener('pointerup', pointerUp)
      canvas.removeEventListener('pointercancel', pointerCancel)
      canvas.removeEventListener('lostpointercapture', pointerCancel)
      canvas.removeEventListener('pointerleave', pointerLeave)
      canvas.removeEventListener('keydown', keyDown)
      canvas.removeEventListener('webglcontextlost', contextLost)
      document.removeEventListener('visibilitychange', visibilityChange)
      releasePointer()
      disposeLabModel(scene)
      keyLight.shadow.map?.dispose()
      renderer?.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="lab-scene" data-state={state}>
      <canvas
        ref={canvasRef}
        className="lab-scene__canvas"
        role="img"
        aria-label="Interactive miniature laboratory: Mickey in a lab coat, a terminal laptop, cell cultures, a mouse, a robot arm, reagents, a road bike, snowboard, and wetsuit."
        aria-describedby={instructionsId}
        tabIndex={state === 'ready' ? 0 : -1}
      />
      {state !== 'ready' && (
        <div className="lab-scene__fallback" role="status">
          <svg viewBox="0 0 500 360" aria-hidden="true">
            <path d="M45 240 240 135 457 238 263 346Z" fill="#c4cec3" />
            <path d="M45 240V103L240 15V135Z" fill="#e3e4d7" />
            <path d="M240 15 457 112V238L240 135Z" fill="#f2eee1" />
            <path d="M104 201 263 124 401 189 244 269Z" fill="#f6f4e9" />
            <path d="M104 201V249L244 319V269Z" fill="#879d8c" />
            <path d="M244 269V319L401 236V189Z" fill="#5d7a6a" />
            <path d="m146 170 57-28 44 22-57 30Z" fill="#adbab2" />
            <path d="M146 170v-40l56-28v40Z" fill="#234b45" stroke="#365c50" strokeWidth="5" />
            <path d="m163 133 20-10m-20 20 30-15" stroke="#c8d9bf" strokeWidth="3" />
            <path d="M297 173v-33l20-35 25 14 5 25" fill="none" stroke="#c5865d" strokeWidth="17" strokeLinecap="round" />
            <circle cx="317" cy="105" r="9" fill="#344d48" />
            <ellipse cx="285" cy="216" rx="21" ry="13" fill="#fdfcf4" />
            <ellipse cx="269" cy="208" rx="8" ry="11" fill="#fdfcf4" />
            <path d="M88 222v-53" stroke="#d49268" strokeWidth="13" strokeLinecap="round" />
          </svg>
          <span>{state === 'unavailable' ? 'The lab is in still mode. Explore every story below.' : 'Opening the lab…'}</span>
        </div>
      )}
      <div className="lab-scene__tools">
        <span className="lab-scene__hint" id={instructionsId}>Hover or tap to explore · drag to look around</span>
        <button className="lab-scene__reset" type="button" onClick={() => controllerRef.current?.reset()} disabled={state !== 'ready'} aria-label="Reset laboratory view">
          <RotateCcw size={15} aria-hidden="true" />
          <span>Reset view</span>
        </button>
      </div>
      <p className="lab-scene__sr-only">Use the story buttons beside the laboratory to explore each object with a keyboard. When the scene is focused, arrow keys change your view and Home resets it.</p>
    </div>
  )
}
