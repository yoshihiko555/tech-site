import type { Ref } from 'vue'

/**
 * Top page wiring: as sections pass the middle of the screen, update the header nav
 * (`active-section`), the rail tag, the city's brightness and its scan sweep.
 * Sections opt in with `data-tag` (rail text) and `data-nav` (header item).
 */
export function useHomeSections(root: Ref<HTMLElement | null>) {
  const active = useState<string | null>('active-section', () => null)
  const railTag = useState('rail-tag', () => '<home/>')
  const sound = useSound()
  let current: Element | null = null
  let observer: IntersectionObserver | null = null

  function enter(el: HTMLElement) {
    if (el === current) return
    const first = current === null
    current = el
    active.value = el.dataset.nav || null
    railTag.value = el.dataset.tag || '<home/>'
    citySignals.dim = el.dataset.dim ? Number(el.dataset.dim) : 0.7
    if (first) return
    citySignals.sweeps++
    sound.sweep()
  }

  useFrame(({ vel }) => {
    const v = motionReduced() ? 0 : clamp(vel / 30, -1, 1)
    document.documentElement.style.setProperty('--v', v.toFixed(2))
  })

  onMounted(async () => {
    await nextTick()
    if (!root.value) return
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) enter(entry.target as HTMLElement)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    root.value.querySelectorAll<HTMLElement>('[data-tag]').forEach((el) => observer!.observe(el))
  })
  onBeforeUnmount(() => {
    observer?.disconnect()
    active.value = null
    railTag.value = '<home/>'
    document.documentElement.style.removeProperty('--v')
  })
}

/** Blips on hover and press while the top page is open (only when SOUND is on). */
export function useHomeSounds() {
  const sound = useSound()
  const HOVER = 'a,button,.row,.witem'
  const PRESS = '.btn,.hbtn,.row,.witem'

  function onOver(e: PointerEvent) {
    if ((e.target as Element | null)?.closest?.(HOVER)) sound.hover()
  }
  function onDown(e: PointerEvent) {
    const hit = (e.target as Element | null)?.closest?.(PRESS)
    if (hit && !hit.matches('[data-sound-toggle]')) sound.click()
  }
  onMounted(() => {
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerdown', onDown)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('pointerover', onOver)
    document.removeEventListener('pointerdown', onDown)
  })
}
