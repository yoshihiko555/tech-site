/**
 * What the top page tells the background city shader. Plain mutable state,
 * written by event handlers and read by the shader every frame (browser only).
 */
export const citySignals = {
  /** centre of the hovered article row, in viewport px */
  hover: null as { x: number; y: number } | null,
  /** brightness the city eases to */
  dim: 0.7,
  /** bumped to send a scan band down the screen */
  sweeps: 0,
  /** a click ripple waiting to be drawn, in viewport px */
  ripple: null as { x: number; y: number } | null,
  /** true while the intro covers the page; the city fades in when it turns false */
  covered: false,
}
