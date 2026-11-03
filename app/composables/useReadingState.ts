import type { Heading } from '#shared/types/post'

/** How far the reader is (as --rp on the page root) and which section is on screen. */
export function useReadingState(headings: () => Heading[], proseId: string) {
  const activeId = ref<string | null>(null)
  const activeSubId = ref<string | null>(null)
  const ACTIVE_LINE = 160
  let ticking = false

  function update() {
    ticking = false
    const prose = document.getElementById(proseId)
    if (!prose) return
    const rect = prose.getBoundingClientRect()
    const viewport = window.innerHeight
    const progress = Math.min(1, Math.max(0, (viewport * 0.35 - rect.top) / Math.max(1, rect.height - viewport * 0.5)))
    document.documentElement.style.setProperty('--rp', progress.toFixed(4))

    let section: string | null = null
    let sub: string | null = null
    for (const heading of headings()) {
      const el = document.getElementById(heading.id)
      if (!el || el.getBoundingClientRect().top >= ACTIVE_LINE) continue
      if (heading.level === 2) {
        section = heading.id
        sub = null
      }
      else {
        sub = heading.id
      }
    }
    activeId.value = section
    activeSubId.value = sub
  }

  function onScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    document.documentElement.style.removeProperty('--rp')
  })

  return { activeId, activeSubId }
}
