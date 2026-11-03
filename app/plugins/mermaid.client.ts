/** Turns mermaid code blocks in post bodies into diagrams after each page renders. */
export default defineNuxtPlugin((nuxtApp) => {
  let counter = 0
  nuxtApp.hook('page:finish', async () => {
    const blocks = document.querySelectorAll<HTMLElement>('.mermaid-diagram:not([data-rendered])')
    if (!blocks.length) return
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'strict' })
    for (const block of blocks) {
      const source = decodeURIComponent(block.dataset.mermaidSource ?? '')
      try {
        const { svg } = await mermaid.render(`mermaid-${++counter}`, source)
        block.innerHTML = svg
        block.dataset.rendered = 'true'
      }
      catch {
        block.dataset.rendered = 'failed'
      }
    }
  })
})
