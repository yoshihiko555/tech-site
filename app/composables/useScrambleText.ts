const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%/<>=+*'
const STEPS = 14

interface ScrambleOptions {
  /** frames until the text settles (30ms each) */
  steps?: number
  /** also scramble text with non-ASCII characters (Japanese titles) */
  anyText?: boolean
}

/**
 * The text, briefly scrambled into glyphs whenever it changes (ASCII only unless `anyText`).
 * Starts as the final text, so server and browser render the same thing.
 */
export function useScrambleText(source: () => string, options: ScrambleOptions = {}) {
  const steps = options.steps ?? STEPS
  const shown = ref(source())
  let timer: ReturnType<typeof setTimeout> | undefined

  function run(final: string) {
    clearTimeout(timer)
    const reduced = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || (!options.anyText && /[^ -~]/.test(final))) {
      shown.value = final
      return
    }
    let step = 0
    const tick = () => {
      step++
      const settled = (step / steps) * final.length
      shown.value = Array.from(final, (ch, i) =>
        i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      ).join('')
      if (step < steps) timer = setTimeout(tick, 30)
    }
    tick()
  }

  onMounted(() => run(source()))
  watch(source, run)
  onBeforeUnmount(() => clearTimeout(timer))
  return shown
}
