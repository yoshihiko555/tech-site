import type { Ref } from 'vue'

/** Whether the element is on screen (or within `margin` of it). False on the server. */
export function useInView(target: Ref<HTMLElement | null>, margin = '120px 0px') {
  const inView = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(async () => {
    await nextTick()
    if (!target.value) return
    observer = new IntersectionObserver(
      ([entry]) => {
        inView.value = !!entry?.isIntersecting
      },
      { rootMargin: margin },
    )
    observer.observe(target.value)
  })
  onBeforeUnmount(() => observer?.disconnect())
  return inView
}

/**
 * Entrance on first view. `shown` is true on the server and with reduced motion,
 * so the page is complete without JavaScript; in the browser it drops to false
 * after mounting and comes back when the element scrolls into view.
 */
export function useReveal(target: Ref<HTMLElement | null>, onReveal?: () => void, threshold = 0.15) {
  const shown = ref(true)
  let observer: IntersectionObserver | null = null

  onMounted(async () => {
    await nextTick()
    if (motionReduced() || !target.value) {
      onReveal?.()
      return
    }
    shown.value = false
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer?.disconnect()
        shown.value = true
        onReveal?.()
      },
      { threshold },
    )
    observer.observe(target.value)
  })
  onBeforeUnmount(() => observer?.disconnect())
  return shown
}
