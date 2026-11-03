/**
 * Giant rows of type: every few hundred ms one letter in a visible row turns into a
 * stray glyph for a moment. Rows join while on screen; one shared timer drives them.
 */
const FLICKER_GLYPHS = '%&#@§∞æ¥/\\<>=+*01'
const rows = new Set<HTMLElement>()
let timer: ReturnType<typeof setTimeout> | undefined

function flicker() {
  const list = [...rows]
  const row = list[Math.floor(Math.random() * list.length)]
  const chars = row ? [...row.querySelectorAll<HTMLElement>('.c')] : []
  const ch = chars[Math.floor(Math.random() * chars.length)]
  if (ch && ch.textContent?.trim() && !ch.classList.contains('gl')) {
    const original = ch.textContent
    ch.textContent = randomGlyph(FLICKER_GLYPHS)
    ch.classList.add('gl')
    setTimeout(
      () => {
        ch.textContent = original
        ch.classList.remove('gl')
      },
      110 + Math.random() * 160,
    )
  }
  timer = rows.size ? setTimeout(flicker, 90 + Math.random() * 260) : undefined
}

export function setRowFlicker(row: HTMLElement, on: boolean) {
  if (prefersReducedMotion()) return
  if (on) rows.add(row)
  else rows.delete(row)
  if (rows.size && !timer) timer = setTimeout(flicker, 120)
}
