import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * Smooth, slightly weighted scrolling on every page (Lenis). Skipped when the
 * visitor asks for reduced motion; then `$lenis` is null and the page scrolls natively.
 */
export default defineNuxtPlugin(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lenis = reduced
    ? null
    : new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        autoRaf: true,
        // inner scroll areas (a long table of contents, code blocks) keep their own wheel
        allowNestedScroll: true,
        // a link to another page drops the remaining glide
        stopInertiaOnNavigate: true,
      })
  return { provide: { lenis } }
})
