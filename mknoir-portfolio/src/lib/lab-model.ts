import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

export type LabStoryId = 'mickey' | 'laptop' | 'cells' | 'mouse' | 'robot' | 'reagents' | 'snowboard' | 'bike' | 'wetsuit'
export type LabModel = {
  group: THREE.Group
  pickables: THREE.Object3D[]
  highlights: Map<LabStoryId, THREE.Group>
}

type Parent = THREE.Object3D
type Material = THREE.Material
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

/** A small, handmade laboratory. Every prop is geometry, including the sports gear. */
export function buildLabModel(): LabModel {
  const group = new THREE.Group()
  const pickables: THREE.Object3D[] = []
  const highlights = new Map<LabStoryId, THREE.Group>()
  const material = (color: string, roughness = 0.7, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness })
  const ivory = material('#eee9dd')
  const porcelain = material('#fcfcf5', 0.35)
  const cream = material('#dedacb')
  const floor = material('#c7cfc7', 0.85)
  const sage = material('#819887')
  const darkSage = material('#3b5b4f')
  const ink = material('#273d43', 0.5)
  const charcoal = material('#243035', 0.75)
  const black = material('#17232a', 0.85)
  const silver = material('#c2caca', 0.35, 0.65)
  const steel = material('#687d80', 0.3, 0.8)
  const wood = material('#bba487', 0.8)
  const orange = material('#df8157', 0.55)
  const paleOrange = material('#eab597', 0.65)
  const blue = material('#7dacc4', 0.45)
  const teal = material('#439a91', 0.45)
  const pink = material('#d59898', 0.65)
  const skin = material('#b88466', 0.7)
  const glass = new THREE.MeshPhysicalMaterial({ color: '#cbe8de', transparent: true, opacity: 0.26, roughness: 0.06, metalness: 0.05, depthWrite: false, side: THREE.DoubleSide })
  const paleGlass = new THREE.MeshPhysicalMaterial({ color: '#e7efea', transparent: true, opacity: 0.24, roughness: 0.13, depthWrite: false, side: THREE.DoubleSide })
  const water = new THREE.MeshPhysicalMaterial({ color: '#64b6c6', transparent: true, opacity: 0.7, roughness: 0.1 })
  const amber = new THREE.MeshPhysicalMaterial({ color: '#c47a30', transparent: true, opacity: 0.85, roughness: 0.25 })
  const gold = material('#d0a85a', 0.3, 0.6)

  function mesh(parent: Parent, geometry: THREE.BufferGeometry, mat: Material, x = 0, y = 0, z = 0) {
    const item = new THREE.Mesh(geometry, mat)
    item.position.set(x, y, z)
    item.castShadow = true
    item.receiveShadow = true
    parent.add(item)
    return item
  }
  function box(parent: Parent, w: number, h: number, d: number, mat: Material, x = 0, y = 0, z = 0, radius = 0.035) {
    return mesh(parent, new RoundedBoxGeometry(w, h, d, 2, Math.min(radius, w / 3, h / 3, d / 3)), mat, x, y, z)
  }
  function ball(parent: Parent, rx: number, ry: number, rz: number, mat: Material, x = 0, y = 0, z = 0) {
    const item = mesh(parent, new THREE.SphereGeometry(1, 20, 14), mat, x, y, z)
    item.scale.set(rx, ry, rz)
    return item
  }
  function cylinder(parent: Parent, top: number, bottom: number, length: number, mat: Material, x = 0, y = 0, z = 0, segments = 24) {
    return mesh(parent, new THREE.CylinderGeometry(top, bottom, length, segments), mat, x, y, z)
  }
  function rod(parent: Parent, a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: Material, radiusB = radius) {
    const delta = b.clone().sub(a)
    const item = cylinder(parent, radiusB, radius, delta.length(), mat)
    item.position.copy(a.clone().add(b).multiplyScalar(0.5))
    item.quaternion.setFromUnitVectors(V(0, 1, 0), delta.normalize())
    return item
  }
  function path(parent: Parent, points: THREE.Vector3[], radius: number, mat: Material, segments = 32) {
    const curve = new THREE.CatmullRomCurve3(points)
    return mesh(parent, new THREE.TubeGeometry(curve, segments, radius, 8, false), mat)
  }
  function torus(parent: Parent, radius: number, thickness: number, mat: Material, x = 0, y = 0, z = 0) {
    return mesh(parent, new THREE.TorusGeometry(radius, thickness, 8, 48), mat, x, y, z)
  }
  function texture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    draw(ctx)
    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 4
    return new THREE.MeshBasicMaterial({ map, toneMapped: false })
  }
  function plate(parent: Parent, width: number, height: number, mat: Material, x: number, y: number, z: number) {
    const item = mesh(parent, new THREE.PlaneGeometry(width, height), mat, x, y, z)
    item.castShadow = false
    return item
  }
  function story(id: LabStoryId, x: number, y: number, z: number, radius: number) {
    const target = new THREE.Group()
    target.position.set(x, y, z)
    target.userData.story = id
    group.add(target)
    pickables.push(target)
    const highlight = new THREE.Group()
    const ringMat = new THREE.MeshBasicMaterial({ color: '#e3a477', transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false })
    const ring = torus(highlight, radius, 0.018, ringMat, 0, 0.025, 0)
    ring.rotation.x = -Math.PI / 2
    ring.castShadow = false
    ring.receiveShadow = false
    const dot = cylinder(highlight, 0.045, 0.045, 0.013, ringMat, radius + 0.08, 0.03, 0, 12)
    dot.castShadow = false
    highlight.visible = false
    target.add(highlight)
    highlights.set(id, highlight)
    return target
  }

  // The floating floor is a solid, rounded architectural model, with two cutaway walls.
  box(group, 10.25, 0.34, 7.8, cream, 0, -0.22, 0, 0.14)
  box(group, 10.12, 0.1, 7.66, floor, 0, -0.02, 0, 0.1)
  box(group, 10.15, 3.6, 0.16, ivory, 0, 1.76, -3.76, 0.025)
  box(group, 0.16, 3.6, 7.55, ivory, -5.02, 1.76, -0.02, 0.025)
  box(group, 10.0, 0.13, 0.1, cream, 0, 0.1, -3.65)
  box(group, 0.1, 0.13, 7.4, cream, -4.91, 0.1, 0)
  // A quiet grid in the linoleum makes the scale legible, without flattening the room.
  for (let x = -4; x <= 4; x += 1) box(group, 0.014, 0.006, 7.4, cream, x, 0.035, 0, 0.001)
  for (let z = -3; z <= 3; z += 1) box(group, 9.8, 0.006, 0.014, cream, 0, 0.035, z, 0.001)

  // Back-wall glazing, with a small view of sky and hills.
  box(group, 2.8, 1.63, 0.13, wood, -2.3, 2.45, -3.61, 0.03)
  const outside = texture(560, 330, (ctx) => {
    const sky = ctx.createLinearGradient(0, 0, 0, 330)
    sky.addColorStop(0, '#d7e5df'); sky.addColorStop(1, '#f0ecda')
    ctx.fillStyle = sky; ctx.fillRect(0, 0, 560, 330)
    ctx.fillStyle = '#efd7a6'; ctx.beginPath(); ctx.arc(430, 86, 35, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#a5b8a5'; ctx.beginPath(); ctx.moveTo(0, 270); ctx.lineTo(125, 125); ctx.lineTo(275, 270); ctx.lineTo(430, 185); ctx.lineTo(560, 260); ctx.lineTo(560, 330); ctx.lineTo(0, 330); ctx.fill()
    ctx.fillStyle = '#819b89'; ctx.beginPath(); ctx.moveTo(0, 330); ctx.lineTo(115, 255); ctx.lineTo(285, 290); ctx.lineTo(460, 242); ctx.lineTo(560, 280); ctx.lineTo(560, 330); ctx.fill()
  })
  if (outside) plate(group, 2.59, 1.43, outside, -2.3, 2.45, -3.53)
  box(group, 0.045, 1.49, 0.08, ivory, -2.3, 2.45, -3.44)
  box(group, 2.64, 0.045, 0.08, ivory, -2.3, 2.5, -3.44)
  box(group, 2.95, 0.08, 0.4, wood, -2.3, 1.6, -3.45)

  // A real bench: inset doors, drawer handles, toe space and a pale stone worktop.
  box(group, 7.92, 1.37, 1.62, sage, 0.63, 0.75, -2.63, 0.055)
  box(group, 7.95, 0.09, 1.7, darkSage, 0.63, 0.13, -2.63)
  box(group, 8.14, 0.15, 1.85, porcelain, 0.63, 1.5, -2.62, 0.055)
  box(group, 8.09, 0.19, 0.09, porcelain, 0.63, 1.63, -3.44)
  for (let index = 0; index < 7; index += 1) {
    const x = -2.81 + index * 1.14
    box(group, 1.08, 1.08, 0.055, index % 3 === 0 ? darkSage : sage, x, 0.79, -1.797, 0.018)
    rod(group, V(x - 0.17, 1.15, -1.746), V(x + 0.17, 1.15, -1.746), 0.016, silver)
  }
  // Open shelves, binders, and specimen jars make this a working room.
  box(group, 3.6, 0.1, 0.5, wood, 2.33, 2.77, -3.43)
  box(group, 0.08, 0.36, 0.34, steel, 0.77, 2.61, -3.5)
  box(group, 0.08, 0.36, 0.34, steel, 3.85, 2.61, -3.5)
  const binderColors = [orange, cream, ink, blue, porcelain, sage]
  for (let index = 0; index < 6; index += 1) {
    const x = 0.9 + index * 0.14
    box(group, 0.115, 0.48 + (index % 2) * 0.03, 0.29, binderColors[index], x, 3.065, -3.39, 0.01)
    box(group, 0.065, 0.1, 0.008, porcelain, x, 3.09, -3.237, 0.004)
  }
  for (let index = 0; index < 3; index += 1) {
    cylinder(group, 0.14, 0.14, 0.32, index === 1 ? amber : paleGlass, 2.65 + index * 0.43, 2.98, -3.4)
    cylinder(group, 0.145, 0.145, 0.065, porcelain, 2.65 + index * 0.43, 3.16, -3.4)
    box(group, 0.16, 0.12, 0.015, ivory, 2.65 + index * 0.43, 3.0, -3.247, 0.004)
  }

  // Scientific pinboard and a round analog clock, deliberately small in the composition.
  box(group, 1.21, 0.78, 0.07, wood, -0.14, 2.48, -3.59)
  box(group, 1.08, 0.65, 0.025, cream, -0.14, 2.48, -3.54)
  const notes = texture(320, 180, (ctx) => {
    ctx.fillStyle = '#e2d6bb'; ctx.fillRect(0, 0, 320, 180)
    ctx.fillStyle = '#fbf9f1'; ctx.fillRect(15, 15, 134, 152); ctx.fillRect(168, 28, 130, 119)
    ctx.strokeStyle = '#798f84'; ctx.lineWidth = 3
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(32, 80 + i * 19); ctx.lineTo(125 - i * 7, 80 + i * 19); ctx.stroke() }
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(198 + (i % 2) * 64, 66 + Math.floor(i / 2) * 54, 14, 0, Math.PI * 2); ctx.stroke() }
    ctx.fillStyle = '#cb7751'; ctx.beginPath(); ctx.arc(82, 21, 5, 0, Math.PI * 2); ctx.arc(233, 32, 5, 0, Math.PI * 2); ctx.fill()
  })
  if (notes) plate(group, 1.06, 0.61, notes, -0.14, 2.48, -3.52)
  const clock = cylinder(group, 0.25, 0.25, 0.05, ink, 4.36, 2.96, -3.6)
  clock.rotation.x = Math.PI / 2
  const clockFace = cylinder(group, 0.22, 0.22, 0.06, porcelain, 4.36, 2.96, -3.56)
  clockFace.rotation.x = Math.PI / 2
  rod(group, V(4.36, 2.96, -3.52), V(4.25, 3.08, -3.52), 0.012, ink)
  rod(group, V(4.36, 2.96, -3.52), V(4.49, 3.0, -3.52), 0.012, ink)

  // Laptop: a luminous, readable terminal and an actual keyboard/trackpad.
  const laptop = story('laptop', -2.22, 1.595, -2.43, 0.78)
  laptop.rotation.y = -0.07
  box(laptop, 1.42, 0.075, 0.91, silver, 0, 0.045, 0)
  box(laptop, 1.25, 0.015, 0.44, charcoal, 0, 0.091, -0.105, 0.025)
  for (let row = 0; row < 4; row += 1) for (let col = 0; col < 11; col += 1) {
    box(laptop, 0.082, 0.011, 0.066, steel, -0.53 + col * 0.106, 0.106, -0.25 + row * 0.098, 0.005)
  }
  box(laptop, 0.42, 0.006, 0.2, cream, 0, 0.087, 0.284, 0.02)
  const screen = new THREE.Group(); screen.position.set(0, 0.08, -0.422); screen.rotation.x = -0.18; laptop.add(screen)
  box(screen, 1.46, 0.92, 0.07, charcoal, 0, 0.445, 0)
  const terminal = texture(640, 400, (ctx) => {
    ctx.fillStyle = '#152a2e'; ctx.fillRect(0, 0, 640, 400)
    ctx.fillStyle = '#263e41'; ctx.fillRect(0, 0, 640, 34)
    ;['#d28b75', '#e0bc78', '#8ba994'].forEach((color, i) => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(20 + i * 22, 17, 5, 0, Math.PI * 2); ctx.fill() })
    ctx.font = '20px monospace'; ctx.fillStyle = '#a6cfc2'; ctx.fillText('mickey@lab:~', 25, 78)
    ctx.fillStyle = '#e5e7d9'; ctx.fillText('$ python experiment.py', 25, 117)
    ctx.fillStyle = '#86b5a5'; ctx.font = '17px monospace'; ctx.fillText('Loading models...', 25, 154); ctx.fillText('Running simulation', 25, 184)
    ctx.strokeStyle = '#5d8e7e'; ctx.lineWidth = 1
    for (let i = 0; i < 4; i += 1) { ctx.beginPath(); ctx.moveTo(28, 225 + i * 40); ctx.lineTo(600, 225 + i * 40); ctx.stroke() }
    ctx.strokeStyle = '#e5b876'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(28, 337)
    for (let i = 1; i < 31; i += 1) ctx.lineTo(28 + i * 18, 335 - Math.sin(i / 6) * 21 - i * 3)
    ctx.stroke(); ctx.fillStyle = '#b6d5c5'; ctx.fillText('Experiment complete.', 25, 380)
  })
  if (terminal) plate(screen, 1.33, 0.8, terminal, 0, 0.456, 0.039)
  // Beside the laptop: a small notebook, coffee, and cable.
  box(group, 0.53, 0.07, 0.72, orange, -3.1, 1.65, -2.25, 0.02)
  box(group, 0.49, 0.045, 0.68, ivory, -3.1, 1.69, -2.25, 0.01)
  rod(group, V(-3.29, 1.735, -2.3), V(-3.0, 1.735, -2.02), 0.018, ink)
  cylinder(group, 0.15, 0.12, 0.26, porcelain, -1.25, 1.73, -2.97)
  const mugHandle = torus(group, 0.096, 0.035, porcelain, -1.075, 1.76, -2.97); mugHandle.rotation.y = Math.PI / 2
  cylinder(group, 0.132, 0.132, 0.006, wood, -1.25, 1.864, -2.97)

  // A microscope and Petri dishes represent hands-on cell work.
  const cells = story('cells', -0.58, 1.585, -2.55, 0.88)
  box(cells, 0.61, 0.1, 0.69, porcelain, -0.22, 0.08, -0.05, 0.07)
  box(cells, 0.19, 0.58, 0.2, porcelain, -0.22, 0.38, -0.29, 0.06)
  rod(cells, V(-0.22, 0.55, -0.29), V(-0.22, 0.95, 0.01), 0.085, porcelain)
  rod(cells, V(-0.22, 0.92, 0.01), V(-0.22, 1.18, 0.1), 0.065, ink)
  rod(cells, V(-0.31, 1.12, 0.12), V(-0.31, 1.27, 0.19), 0.041, charcoal)
  rod(cells, V(-0.14, 1.12, 0.12), V(-0.14, 1.27, 0.19), 0.041, charcoal)
  box(cells, 0.53, 0.055, 0.43, charcoal, -0.22, 0.43, 0.05)
  box(cells, 0.2, 0.012, 0.13, paleGlass, -0.22, 0.468, 0.06)
  cylinder(cells, 0.048, 0.034, 0.15, silver, -0.22, 0.72, 0.06)
  cylinder(cells, 0.032, 0.025, 0.19, silver, -0.31, 0.7, 0.065)
  const focusKnob = cylinder(cells, 0.09, 0.09, 0.1, charcoal, -0.07, 0.54, -0.23); focusKnob.rotation.z = Math.PI / 2
  cylinder(cells, 0.06, 0.06, 0.03, silver, -0.22, 0.16, 0.06)
  for (let dishIndex = 0; dishIndex < 2; dishIndex += 1) {
    const x = 0.42 + dishIndex * 0.42
    const z = 0.3 - dishIndex * 0.38
    cylinder(cells, 0.25, 0.25, 0.045, paleGlass, x, 0.04, z)
    cylinder(cells, 0.228, 0.228, 0.016, dishIndex ? paleOrange : pink, x, 0.035, z)
    const rim = torus(cells, 0.246, 0.011, porcelain, x, 0.065, z); rim.rotation.x = Math.PI / 2
    for (let colony = 0; colony < 7; colony += 1) {
      const theta = colony * 2.4
      const r = 0.06 + (colony % 3) * 0.046
      ball(cells, 0.025, 0.009, 0.037, porcelain, x + Math.cos(theta) * r, 0.052, z + Math.sin(theta) * r)
    }
  }
  // A blue pipette lies across the little sample tray.
  box(cells, 0.61, 0.045, 0.16, porcelain, 0.6, 0.025, -0.55)
  rod(cells, V(0.35, 0.08, -0.55), V(0.7, 0.08, -0.55), 0.026, blue)
  rod(cells, V(0.7, 0.08, -0.55), V(0.83, 0.08, -0.55), 0.012, porcelain)

  // Bottles, Erlenmeyers, graduated glassware and a full test-tube rack.
  const reagents = story('reagents', 1.15, 1.585, -2.62, 0.81)
  function bottle(x: number, z: number, h: number, r: number, color: Material) {
    cylinder(reagents, r, r, h, color, x, h / 2, z)
    cylinder(reagents, r * 0.56, r * 0.56, 0.12, color, x, h + 0.02, z)
    cylinder(reagents, r * 0.65, r * 0.65, 0.075, ink, x, h + 0.1, z)
    box(reagents, r * 1.45, h * 0.34, 0.018, ivory, x, h * 0.55, z + r, 0.005)
    box(reagents, r * 0.8, 0.018, 0.006, sage, x, h * 0.57, z + r + 0.013, 0.002)
  }
  bottle(-0.48, -0.27, 0.53, 0.175, amber)
  bottle(-0.05, -0.28, 0.66, 0.2, paleGlass)
  bottle(0.41, -0.28, 0.45, 0.16, amber)
  const flask = mesh(reagents, new THREE.CylinderGeometry(0.067, 0.24, 0.39, 24, 1, true), glass, -0.45, 0.2, 0.27)
  flask.castShadow = false
  cylinder(reagents, 0.067, 0.067, 0.21, glass, -0.45, 0.48, 0.27)
  cylinder(reagents, 0.15, 0.21, 0.13, water, -0.45, 0.075, 0.27)
  const flaskRim = torus(reagents, 0.069, 0.009, porcelain, -0.45, 0.59, 0.27); flaskRim.rotation.x = Math.PI / 2
  box(reagents, 0.79, 0.055, 0.4, wood, 0.22, 0.036, 0.39)
  box(reagents, 0.79, 0.045, 0.4, ivory, 0.22, 0.24, 0.39)
  for (let row = 0; row < 2; row += 1) for (let col = 0; col < 4; col += 1) {
    const x = -0.08 + col * 0.19; const z = 0.28 + row * 0.2
    cylinder(reagents, 0.048, 0.048, 0.43, glass, x, 0.3, z, 16)
    cylinder(reagents, 0.039, 0.039, 0.18 + col * 0.025, col % 2 ? water : pink, x, 0.17, z, 16)
    cylinder(reagents, 0.055, 0.055, 0.038, col % 2 ? blue : orange, x, 0.528, z, 16)
  }

  // Six-axis arm with rotary joints, a two-finger gripper and a small specimen.
  const robot = story('robot', 3.36, 1.585, -2.39, 0.99)
  box(robot, 1.24, 0.09, 1.14, steel, 0, 0.052, 0, 0.06)
  cylinder(robot, 0.32, 0.39, 0.18, ink, 0, 0.19, 0)
  cylinder(robot, 0.24, 0.25, 0.16, orange, 0, 0.34, 0)
  const shoulder = V(0, 0.5, 0); const elbow = V(-0.07, 1.22, -0.21); const wrist = V(-0.6, 1.04, 0.38)
  const jointA = cylinder(robot, 0.21, 0.21, 0.32, charcoal, shoulder.x, shoulder.y, shoulder.z); jointA.rotation.z = Math.PI / 2
  rod(robot, shoulder, elbow, 0.14, orange, 0.105)
  rod(robot, shoulder.clone().add(V(0.16, 0, 0)), elbow.clone().add(V(0.14, 0, 0)), 0.048, silver)
  const jointB = cylinder(robot, 0.175, 0.175, 0.28, charcoal, elbow.x, elbow.y, elbow.z); jointB.rotation.z = Math.PI / 2
  rod(robot, elbow, wrist, 0.1, orange, 0.085)
  ball(robot, 0.13, 0.13, 0.13, charcoal, wrist.x, wrist.y, wrist.z)
  cylinder(robot, 0.086, 0.075, 0.15, silver, wrist.x, wrist.y - 0.12, wrist.z)
  box(robot, 0.3, 0.075, 0.13, ink, wrist.x, wrist.y - 0.22, wrist.z)
  rod(robot, V(wrist.x - 0.12, wrist.y - 0.22, wrist.z), V(wrist.x - 0.105, wrist.y - 0.43, wrist.z), 0.026, steel)
  rod(robot, V(wrist.x + 0.12, wrist.y - 0.22, wrist.z), V(wrist.x + 0.105, wrist.y - 0.43, wrist.z), 0.026, steel)
  path(robot, [V(0.17, 0.4, -0.04), V(0.28, 0.72, -0.2), V(0.1, 1.35, -0.3), V(-0.23, 1.43, -0.15), V(-0.59, 1.13, 0.35)], 0.026, ink)
  box(robot, 0.53, 0.12, 0.37, ivory, -0.6, 0.065, 0.43, 0.025)
  for (let i = 0; i < 3; i += 1) cylinder(robot, 0.035, 0.035, 0.19, blue, -0.74 + i * 0.13, 0.2, 0.43, 12)
  box(robot, 0.36, 0.07, 0.28, ink, 0.67, 0.04, 0.38)
  box(robot, 0.25, 0.007, 0.18, blue, 0.67, 0.079, 0.38)

  // A separate clean station brings the mouse into the foreground, where it can be seen.
  box(group, 1.53, 0.12, 1.15, porcelain, 2.57, 1.04, 0.19, 0.06)
  for (const x of [1.97, 3.17]) for (const z of [-0.24, 0.62]) cylinder(group, 0.055, 0.055, 0.92, steel, x, 0.51, z)
  box(group, 1.18, 0.055, 0.86, sage, 2.57, 0.29, 0.19)
  box(group, 0.45, 0.19, 0.45, ivory, 2.48, 0.41, 0.15)
  const mouse = story('mouse', 2.57, 1.11, 0.23, 0.62)
  box(mouse, 1.17, 0.05, 0.79, cream, 0, 0.025, 0, 0.08)
  box(mouse, 1.16, 0.12, 0.045, paleGlass, 0, 0.09, -0.39, 0.01)
  box(mouse, 0.045, 0.12, 0.76, paleGlass, -0.565, 0.09, 0, 0.01)
  box(mouse, 0.045, 0.12, 0.76, paleGlass, 0.565, 0.09, 0, 0.01)
  const animal = new THREE.Group(); mouse.add(animal); animal.rotation.y = 0.28
  ball(animal, 0.32, 0.22, 0.205, porcelain, 0.08, 0.24, 0)
  ball(animal, 0.19, 0.155, 0.16, porcelain, -0.22, 0.28, 0)
  ball(animal, 0.095, 0.065, 0.07, porcelain, -0.36, 0.22, 0.027)
  ball(animal, 0.018, 0.018, 0.025, pink, -0.431, 0.218, 0.027)
  for (const z of [-0.11, 0.11]) {
    ball(animal, 0.084, 0.103, 0.033, porcelain, -0.16, 0.418, z)
    ball(animal, 0.052, 0.071, 0.01, pink, -0.17, 0.43, z + 0.022)
    ball(animal, 0.018, 0.021, 0.018, black, -0.298, 0.315, z * 1.11)
    ball(animal, 0.08, 0.025, 0.035, pink, -0.08, 0.092, z * 1.4)
    ball(animal, 0.084, 0.025, 0.035, pink, 0.22, 0.092, z * 1.4)
  }
  path(animal, [V(0.35, 0.16, 0), V(0.51, 0.07, 0.08), V(0.4, 0.075, 0.27), V(0.22, 0.075, 0.29)], 0.018, pink)
  for (const z of [-1, 1]) {
    rod(animal, V(-0.36, 0.233, z * 0.04), V(-0.46, 0.25, z * 0.17), 0.0035, steel)
    rod(animal, V(-0.35, 0.226, z * 0.04), V(-0.44, 0.212, z * 0.19), 0.0035, steel)
  }

  // Mickey: a friendly little scientist, glasses, navy clothes and a long white coat.
  const mickey = story('mickey', -0.36, 0.035, 0.24, 0.74)
  mickey.rotation.y = 0.35
  for (const x of [-0.16, 0.16]) {
    box(mickey, 0.22, 0.54, 0.25, ink, x, 0.39, 0)
    box(mickey, 0.26, 0.16, 0.42, charcoal, x, 0.11, 0.075, 0.06)
    box(mickey, 0.26, 0.036, 0.42, ivory, x, 0.047, 0.075, 0.025)
  }
  box(mickey, 0.61, 0.69, 0.35, blue, 0, 1.0, 0, 0.09)
  box(mickey, 0.78, 0.98, 0.4, porcelain, 0, 0.94, -0.015, 0.12)
  box(mickey, 0.21, 0.54, 0.025, ink, 0, 1.15, 0.196, 0.025)
  const lapelLeft = box(mickey, 0.14, 0.42, 0.045, ivory, -0.122, 1.22, 0.218, 0.012); lapelLeft.rotation.z = -0.29
  const lapelRight = box(mickey, 0.14, 0.42, 0.045, ivory, 0.122, 1.22, 0.218, 0.012); lapelRight.rotation.z = 0.29
  for (let i = 0; i < 3; i += 1) ball(mickey, 0.015, 0.015, 0.012, steel, 0.02, 0.69 + i * 0.12, 0.205)
  box(mickey, 0.16, 0.14, 0.03, ivory, -0.23, 1.14, 0.204, 0.01)
  rod(mickey, V(-0.26, 1.13, 0.228), V(-0.26, 1.29, 0.228), 0.014, orange)
  box(mickey, 0.16, 0.21, 0.026, ivory, 0.24, 0.77, 0.2, 0.01)
  box(mickey, 0.16, 0.21, 0.026, ivory, -0.24, 0.77, 0.2, 0.01)
  rod(mickey, V(-0.39, 1.33, 0), V(-0.48, 0.88, 0.06), 0.125, porcelain, 0.145)
  rod(mickey, V(-0.48, 0.88, 0.06), V(-0.42, 0.67, 0.17), 0.105, porcelain)
  ball(mickey, 0.095, 0.12, 0.09, skin, -0.42, 0.63, 0.18)
  rod(mickey, V(0.38, 1.31, 0), V(0.55, 1.01, 0.04), 0.12, porcelain, 0.145)
  rod(mickey, V(0.55, 1.01, 0.04), V(0.47, 1.1, 0.3), 0.10, porcelain)
  ball(mickey, 0.1, 0.09, 0.09, skin, 0.47, 1.12, 0.33)
  const clipboard = box(mickey, 0.31, 0.4, 0.042, wood, 0.4, 1.1, 0.31, 0.025); clipboard.rotation.z = -0.12
  box(mickey, 0.25, 0.32, 0.008, ivory, 0.4, 1.1, 0.34, 0.005)
  box(mickey, 0.13, 0.045, 0.014, steel, 0.4, 1.27, 0.346, 0.005)
  cylinder(mickey, 0.11, 0.11, 0.13, skin, 0, 1.51, 0)
  ball(mickey, 0.295, 0.325, 0.28, skin, 0, 1.84, 0.015)
  ball(mickey, 0.302, 0.205, 0.288, charcoal, 0, 2.027, -0.014)
  ball(mickey, 0.1, 0.16, 0.17, charcoal, -0.22, 1.98, -0.09)
  ball(mickey, 0.12, 0.13, 0.15, charcoal, 0.22, 2.036, -0.065)
  ball(mickey, 0.067, 0.09, 0.065, skin, -0.29, 1.825, 0.01)
  ball(mickey, 0.067, 0.09, 0.065, skin, 0.29, 1.825, 0.01)
  ball(mickey, 0.057, 0.066, 0.085, skin, 0, 1.82, 0.281)
  for (const x of [-0.125, 0.125]) {
    const lens = torus(mickey, 0.094, 0.012, ink, x, 1.893, 0.275); lens.scale.y = 0.81
    ball(mickey, 0.02, 0.026, 0.014, charcoal, x, 1.885, 0.284)
  }
  rod(mickey, V(-0.035, 1.9, 0.276), V(0.035, 1.9, 0.276), 0.011, ink)
  rod(mickey, V(-0.219, 1.9, 0.25), V(-0.278, 1.91, 0), 0.011, ink)
  rod(mickey, V(0.219, 1.9, 0.25), V(0.278, 1.91, 0), 0.011, ink)
  path(mickey, [V(-0.066, 1.704, 0.256), V(0, 1.69, 0.27), V(0.066, 1.704, 0.256)], 0.011, charcoal, 12)

  // Outdoor gear stays in a dedicated corner, separate from the clean workbench.
  box(group, 0.32, 2.3, 2.78, wood, -4.79, 1.19, -0.23, 0.04)
  for (let z = -1.45; z <= 1.12; z += 0.16) box(group, 0.025, 2.21, 0.013, cream, -4.615, 1.2, z, 0.004)
  // A full-size directional snowboard, with raised bindings and a painted mountain.
  const snowboard = story('snowboard', -4.15, 0.055, 0.72, 0.55)
  snowboard.rotation.y = 0.62
  const board = new THREE.Group(); snowboard.add(board); board.rotation.z = -0.17
  box(board, 0.49, 2.71, 0.09, orange, 0, 1.4, 0, 0.2)
  box(board, 0.41, 2.48, 0.015, ivory, 0, 1.42, 0.052, 0.17)
  const boardArt = texture(180, 760, (ctx) => {
    ctx.fillStyle = '#e7e5d9'; ctx.fillRect(0, 0, 180, 760)
    ctx.fillStyle = '#315a50'; ctx.beginPath(); ctx.moveTo(0, 325); ctx.lineTo(95, 82); ctx.lineTo(180, 304); ctx.lineTo(180, 508); ctx.lineTo(0, 486); ctx.fill()
    ctx.fillStyle = '#87a08f'; ctx.beginPath(); ctx.moveTo(0, 481); ctx.lineTo(65, 270); ctx.lineTo(180, 480); ctx.lineTo(180, 640); ctx.lineTo(0, 640); ctx.fill()
    ctx.fillStyle = '#dc8d61'; ctx.fillRect(0, 650, 180, 40)
    ctx.fillStyle = '#faf9ee'; ctx.beginPath(); ctx.moveTo(69, 149); ctx.lineTo(95, 82); ctx.lineTo(126, 161); ctx.lineTo(99, 144); ctx.lineTo(87, 164); ctx.fill()
  })
  if (boardArt) plate(board, 0.4, 2.42, boardArt, 0, 1.42, 0.063)
  for (const y of [0.89, 1.68]) {
    const binding = box(board, 0.35, 0.28, 0.17, charcoal, 0, y, 0.15, 0.06); binding.rotation.z = y < 1 ? -0.2 : 0.18
    box(board, 0.38, 0.055, 0.065, silver, 0, y, 0.25, 0.015)
  }

  // Wetsuit, hanger and race medals: a deliberately human part of the room.
  const wetsuit = story('wetsuit', -4.28, 0.055, -1.54, 0.56)
  wetsuit.rotation.y = Math.PI / 2
  rod(wetsuit, V(-0.53, 2.85, -0.06), V(0.53, 2.85, -0.06), 0.025, steel)
  path(wetsuit, [V(-0.45, 2.33, 0), V(0, 2.59, 0), V(0.45, 2.33, 0), V(-0.45, 2.33, 0)], 0.016, wood)
  path(wetsuit, [V(0, 2.59, 0), V(0.015, 2.72, 0), V(0.08, 2.76, 0), V(0.12, 2.71, 0)], 0.014, steel)
  box(wetsuit, 0.59, 0.9, 0.12, charcoal, 0, 1.81, 0, 0.13)
  box(wetsuit, 0.42, 0.34, 0.025, darkSage, 0, 2.04, 0.071, 0.06)
  rod(wetsuit, V(-0.28, 2.15, 0), V(-0.52, 1.81, 0), 0.102, charcoal, 0.12)
  rod(wetsuit, V(-0.52, 1.81, 0), V(-0.48, 1.42, 0), 0.078, charcoal)
  rod(wetsuit, V(0.28, 2.15, 0), V(0.51, 1.79, 0), 0.102, charcoal, 0.12)
  rod(wetsuit, V(0.51, 1.79, 0), V(0.48, 1.42, 0), 0.078, charcoal)
  box(wetsuit, 0.23, 0.87, 0.11, charcoal, -0.16, 1.0, 0, 0.07)
  box(wetsuit, 0.23, 0.87, 0.11, charcoal, 0.16, 1.0, 0, 0.07)
  box(wetsuit, 0.02, 0.59, 0.016, steel, 0, 1.84, 0.078, 0.004)
  box(wetsuit, 0.14, 0.075, 0.02, orange, -0.16, 0.69, 0.07, 0.012)
  for (let index = 0; index < 3; index += 1) {
    const x = -4.61; const z = -2.7 + index * 0.29
    rod(group, V(x, 2.56, z), V(x + 0.07, 1.86, z - 0.07), 0.025, index === 1 ? blue : orange)
    rod(group, V(x, 2.56, z), V(x + 0.07, 1.86, z + 0.07), 0.025, index === 1 ? blue : orange)
    const medal = cylinder(group, 0.12, 0.12, 0.026, index === 1 ? silver : gold, x + 0.083, 1.78, z)
    medal.rotation.z = Math.PI / 2
    medal.userData.story = 'wetsuit'; pickables.push(medal)
  }

  // A road bike, not an icon: two spoked wheels, a diamond frame, cranks and drop bars.
  const bike = story('bike', -2.54, 0.055, 2.01, 1.25)
  bike.rotation.y = -0.11
  const wheelRadius = 0.57
  for (const x of [-0.91, 0.91]) {
    torus(bike, wheelRadius, 0.038, charcoal, x, wheelRadius, 0)
    torus(bike, wheelRadius - 0.047, 0.014, silver, x, wheelRadius, 0)
    const hub = cylinder(bike, 0.056, 0.056, 0.18, silver, x, wheelRadius, 0); hub.rotation.x = Math.PI / 2
    for (let i = 0; i < 20; i += 1) {
      const angle = i / 20 * Math.PI * 2
      rod(bike, V(x, wheelRadius, i % 2 ? 0.045 : -0.045), V(x + Math.cos(angle) * (wheelRadius - 0.055), wheelRadius + Math.sin(angle) * (wheelRadius - 0.055), 0), 0.005, silver)
    }
  }
  const rear = V(-0.91, wheelRadius, 0); const front = V(0.91, wheelRadius, 0)
  const crank = V(-0.09, 0.52, 0); const saddle = V(-0.32, 1.33, 0); const head = V(0.54, 1.35, 0)
  const fork = V(0.65, 1.09, 0)
  for (const [a, b] of [[rear, saddle], [rear, crank], [crank, saddle], [saddle, head], [head, crank], [head, fork], [fork, front]]) rod(bike, a, b, 0.029, teal)
  rod(bike, rear.clone().add(V(0, 0, 0.065)), saddle.clone().add(V(0, 0, 0.035)), 0.018, teal)
  rod(bike, rear.clone().add(V(0, 0, 0.065)), crank.clone().add(V(0, 0, 0.065)), 0.018, teal)
  rod(bike, crank, saddle.clone().add(V(0, 0.18, 0)), 0.024, silver)
  box(bike, 0.35, 0.07, 0.2, charcoal, -0.36, 1.49, 0, 0.055)
  rod(bike, head, V(0.61, 1.58, 0), 0.025, silver)
  rod(bike, V(0.61, 1.58, -0.23), V(0.61, 1.58, 0.23), 0.022, steel)
  for (const z of [-0.24, 0.24]) path(bike, [V(0.6, 1.58, z), V(0.82, 1.55, z), V(0.88, 1.36, z), V(0.72, 1.28, z)], 0.026, charcoal, 18)
  const sprocket = torus(bike, 0.15, 0.015, steel, crank.x, crank.y, 0.085)
  sprocket.rotation.z = 0.2
  rod(bike, V(crank.x, crank.y, 0.11), V(crank.x + 0.13, crank.y - 0.12, 0.11), 0.018, silver)
  rod(bike, V(crank.x + 0.13, crank.y - 0.12, 0.11), V(crank.x + 0.13, crank.y - 0.12, 0.24), 0.025, charcoal)
  path(bike, [V(-0.91, wheelRadius + 0.065, 0.095), V(-0.09, 0.67, 0.095), V(0.04, 0.52, 0.095), V(-0.09, 0.38, 0.095), V(-0.91, wheelRadius - 0.065, 0.095), V(-0.99, wheelRadius, 0.095), V(-0.91, wheelRadius + 0.065, 0.095)], 0.009, steel)
  rod(bike, V(-0.14, 0.49, -0.045), V(-0.36, 0.015, -0.28), 0.018, steel)
  cylinder(bike, 0.065, 0.065, 0.32, porcelain, 0.16, 0.89, 0)

  // Finishing details: a rolling stool, plant, socket, and two small cardboard boxes.
  cylinder(group, 0.35, 0.35, 0.11, orange, 1.0, 0.85, 1.15)
  cylinder(group, 0.045, 0.045, 0.67, silver, 1.0, 0.46, 1.15)
  for (let i = 0; i < 5; i += 1) {
    const angle = i / 5 * Math.PI * 2
    const point = V(1 + Math.cos(angle) * 0.37, 0.14, 1.15 + Math.sin(angle) * 0.37)
    rod(group, V(1, 0.23, 1.15), point, 0.025, steel)
    ball(group, 0.055, 0.065, 0.055, charcoal, point.x, 0.08, point.z)
  }
  cylinder(group, 0.28, 0.21, 0.49, orange, 4.27, 0.285, 2.83)
  cylinder(group, 0.235, 0.235, 0.016, wood, 4.27, 0.526, 2.83)
  for (let index = 0; index < 8; index += 1) {
    const angle = index * 2.4
    const height = 0.98 + (index % 3) * 0.14
    const end = V(4.27 + Math.cos(angle) * 0.4, height, 2.83 + Math.sin(angle) * 0.34)
    rod(group, V(4.27, 0.52, 2.83), end, 0.013, darkSage)
    const leaf = ball(group, 0.1, 0.26, 0.025, index % 2 ? sage : darkSage, end.x, end.y, end.z)
    leaf.rotation.set(Math.cos(angle) * 0.6, angle, Math.sin(angle) * 0.65)
  }
  box(group, 0.39, 0.19, 0.055, porcelain, 3.64, 1.89, -3.625)
  for (const x of [3.53, 3.75]) {
    box(group, 0.014, 0.056, 0.008, ink, x - 0.022, 1.9, -3.59)
    box(group, 0.014, 0.056, 0.008, ink, x + 0.022, 1.9, -3.59)
  }
  box(group, 0.82, 0.65, 0.65, wood, 4.2, 0.36, -0.85, 0.015)
  box(group, 0.63, 0.48, 0.53, cream, 4.17, 0.92, -0.85, 0.015)
  box(group, 0.15, 0.65, 0.012, cream, 4.2, 0.36, -0.518, 0.002)
  box(group, 0.25, 0.14, 0.008, ivory, 4.2, 0.36, -0.507, 0.002)
  return { group, pickables, highlights }
}

/** One teardown for both the normal route change and a renderer failure. */
export function disposeLabModel(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const textures = new Set<THREE.Texture>()
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    geometries.add(object.geometry)
    const list = Array.isArray(object.material) ? object.material : [object.material]
    for (const material of list) {
      materials.add(material)
      for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value)
    }
  })
  textures.forEach((texture) => texture.dispose())
  materials.forEach((material) => material.dispose())
  geometries.forEach((geometry) => geometry.dispose())
}
