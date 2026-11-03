const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%/<>=+*'
const STEPS = 14

/**
 * The text, briefly scrambled into glyphs whenever it changes (ASCII only).
 * Starts as the final text, so server and browser render the same thing.
 */
export function useScrambleText(source: () => string) {
  const shown = ref(source())
  let timer: ReturnType<typeof setTimeout> | undefined

  function run(final: string) {
    clearTimeout(timer)
    const reduced = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || /[^ -~]/.test(final)) {
      shown.value = final
      return
    }
    let step = 0
    const tick = () => {
      step++
      const settled = (step / STEPS) * final.length
      shown.value = Array.from(final, (ch, i) =>
        i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      ).join('')
      if (step < STEPS) timer = setTimeout(tick, 30)
    }
    tick()
  }

  onMounted(() => run(source()))
  watch(source, run)
  onBeforeUnmount(() => clearTimeout(timer))
  return shown
}
