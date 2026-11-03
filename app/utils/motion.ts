/** Glyphs used while text scrambles into place. */
export const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&@<>/|=+*'

/** True when the visitor asks for less motion. Always false on the server. */
export function prefersReducedMotion(): boolean {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** True for a mouse or trackpad (hover effects and the magnetic pull). */
export function hasFinePointer(): boolean {
  return import.meta.client && window.matchMedia('(pointer: fine)').matches
}

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value
}

/** 7 -> "0007" */
export function padNumber(value: number, width: number): string {
  return String(Math.round(value)).padStart(width, '0')
}

export function randomGlyph(set: string = GLYPHS): string {
  return set[Math.floor(Math.random() * set.length)]!
}

/** Plays a one-shot CSS animation class again (removed after `ms`). */
export function replayClass(el: Element | null | undefined, name: string, ms: number) {
  if (!el || prefersReducedMotion()) return
  el.classList.remove(name)
  void (el as HTMLElement).offsetWidth
  el.classList.add(name)
  setTimeout(() => el.classList.remove(name), ms)
}
