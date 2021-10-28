export default (to, from, prev) => {
  // TODO : 前回のポジションをどう扱うか検討
  // if (prev) return prev

  if (to.hash) {
    const offset = 100
    const hash = (() => {
      if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined')
        return `#${window.CSS.escape(to.hash.substr(1))}`
      return to.hash
    })()
    return {
      selector: hash,
      offset: { x:0, y: -offset },
      behavior: 'smooth',
    }
  }

  return { x: 0, y: 0 }
}
