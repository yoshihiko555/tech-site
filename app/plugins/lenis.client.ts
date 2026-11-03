import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * Smooth, slightly weighted scrolling on every page (Lenis). Off only when the site
 * stops its motion (motionReduced); then `$lenis` is null and the page scrolls natively.
 */
export default defineNuxtPlugin(() => {
  const lenis = motionReduced()
    ? null
    : new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        autoRaf: true,
        // inner scroll areas (a long table of contents, code blocks) keep their own wheel
        allowNestedScroll: true,
        // a link to another page drops the remaining glide
        stopInertiaOnNavigate: true,
        // the OS "reduce motion" setting is not followed (see utils/motion)
        respectReducedMotion: false,
      })
  return { provide: { lenis } }
})
