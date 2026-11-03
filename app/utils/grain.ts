/**
 * Dithered colour fields for the top page: each 4px cell picks one of 2-3 colours
 * at random, weighted by a per-kind function of the cell's position (u, v in 0..1).
 */
type Weights = (u: number, v: number) => [number, number]

interface GrainKind {
  colors: [string, string, string]
  weights: Weights
}

const cut = (value: number, max: number) => Math.min(max, Math.max(0, value))
const fromCorner = (u: number, v: number, x: number, y: number) => Math.hypot(u - x, v - y)

export const GRAIN: Record<string, GrainKind> = {
  warm: {
    colors: ['#DC6A35', '#C2532C', '#173A3D'],
    weights: (u, v) => [cut(0.6 - fromCorner(u, v, 1, 0.1) * 0.8, 0.5), cut(0.22 - fromCorner(u, v, 1, 1) * 0.5, 0.16)],
  },
  teal: {
    colors: ['#173A3D', '#0D1C1F', '#DC6A35'],
    weights: (u, v) => [
      cut(0.8 - fromCorner(u, v, 0.1, 0.25), 0.75),
      cut(0.24 - fromCorner(u, v, 0.95, 0.85) * 0.6, 0.22),
    ],
  },
  ai: {
    colors: ['#173A3D', '#0D1C1F', '#5CC9BE'],
    weights: (u, v) => [cut(v * 0.8 - 0.2, 0.6), cut(0.16 - fromCorner(u, v, 0.05, 1) * 0.3, 0.12)],
  },
  programming: {
    colors: ['#DC6A35', '#C2532C', '#173A3D'],
    weights: (u, v) => [cut(v * 0.7 - 0.15, 0.5), cut(0.2 - fromCorner(u, v, 0.05, 1) * 0.4, 0.14)],
  },
  'dev-env': {
    colors: ['#5CC9BE', '#47B1A6', '#173A3D'],
    weights: (u, v) => [cut(v * 0.7 - 0.15, 0.5), cut(0.2 - fromCorner(u, v, 0.05, 1) * 0.4, 0.14)],
  },
  lifestyle: {
    colors: ['#E2B04A', '#CF9636', '#DC6A35'],
    weights: (u, v) => [cut(v * 0.7 - 0.15, 0.5), cut(0.22 - fromCorner(u, v, 0.05, 1) * 0.4, 0.16)],
  },
}

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const CELL = 4

/** Paints the field as the element's background image. Unknown kinds are left alone. */
export function paintGrain(el: HTMLElement, kind: string) {
  const grain = GRAIN[kind]
  if (!grain || !el.clientWidth) return
  const w = Math.min(520, Math.ceil(el.clientWidth / CELL))
  const h = Math.min(900, Math.ceil(el.clientHeight / CELL))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const image = ctx.createImageData(w, h)
  const data = image.data
  const colors = grain.colors.map(hexToRgb)
  for (let j = 0; j < h; j++) {
    const v = j / h
    const edge = Math.min(1, v * 4, (1 - v) * 4)
    for (let i = 0; i < w; i++) {
      const [a, b] = grain.weights(i / w, v)
      const r = Math.random()
      const pick = r < a * edge ? 1 : r > 1 - b * edge ? 2 : 0
      const o = (j * w + i) * 4
      const color = colors[pick]!
      data[o] = color[0]
      data[o + 1] = color[1]
      data[o + 2] = color[2]
      data[o + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)
  el.style.backgroundImage = `url(${canvas.toDataURL()})`
}

/** A 512x120 mask that dissolves in grains (opaque at the bottom when `fadeIn`). */
export function ditherMask(fadeIn: boolean): string {
  const w = 512
  const h = 120
  const block = 2
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return 'none'
  for (let j = 0; j < h; j += block) {
    let p = (j + block / 2) / h
    if (!fadeIn) p = 1 - p
    p = Math.pow(p, 1.6)
    for (let i = 0; i < w; i += block) {
      if (Math.random() < p) ctx.fillRect(i, j, block, block)
    }
  }
  return `url(${canvas.toDataURL()})`
}
