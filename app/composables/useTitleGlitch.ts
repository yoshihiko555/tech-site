/**
 * Every few seconds one of the section titles on screen glitches (colour slices).
 * Titles join while they are visible; the timer runs only while any are registered.
 */
const visible = new Set<HTMLElement>()
let timer: ReturnType<typeof setTimeout> | undefined

function schedule() {
  timer = setTimeout(
    () => {
      const list = [...visible]
      if (list.length && !document.hidden) {
        replayClass(list[Math.floor(Math.random() * list.length)], 'glx', 360)
      }
      schedule()
    },
    2600 + Math.random() * 3600,
  )
}

export function setTitleVisible(el: HTMLElement, on: boolean) {
  if (motionReduced()) return
  if (on) visible.add(el)
  else visible.delete(el)
  if (visible.size && !timer) schedule()
  if (!visible.size && timer) {
    clearTimeout(timer)
    timer = undefined
  }
}
