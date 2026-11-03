/**
 * Small synth blips for the top page. Off until the visitor turns it on
 * (SOUND in the header, or ENTER WITH SOUND in the intro).
 */
let context: AudioContext | null = null
let lastHover = 0

function play(frequency: number, duration: number, type: OscillatorType = 'triangle', volume = 0.03, to?: number) {
  try {
    context ??= new AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const now = context.currentTime
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, now)
    if (to) oscillator.frequency.exponentialRampToValueAtTime(to, now + duration)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(volume, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + duration + 0.03)
  } catch {
    // no audio device or the browser refused: stay silent
  }
}

export function useSound() {
  const on = useState('sound-on', () => false)

  const ifOn = (fn: () => void) => () => {
    if (on.value) fn()
  }
  const click = ifOn(() => {
    play(520, 0.08, 'square', 0.022)
    setTimeout(() => play(780, 0.1, 'square', 0.018), 70)
  })
  const hover = ifOn(() => {
    const now = performance.now()
    if (now - lastHover < 60) return
    lastHover = now
    play(1320, 0.04, 'triangle', 0.02)
  })
  const sweep = ifOn(() => play(160, 0.45, 'sine', 0.035, 640))

  function tone(frequency: number, duration: number) {
    if (on.value) play(frequency, duration, 'triangle', 0.02)
  }
  function set(value: boolean) {
    on.value = value
    if (value) click()
  }

  return { on, set, click, hover, sweep, tone }
}
