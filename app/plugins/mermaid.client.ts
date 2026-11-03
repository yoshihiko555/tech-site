/** Turns mermaid code blocks in post bodies into diagrams, on first load and after each navigation. */
export default defineNuxtPlugin((nuxtApp) => {
  let counter = 0

  async function renderDiagrams() {
    const blocks = [...document.querySelectorAll<HTMLElement>('.mermaid-diagram:not([data-rendered])')]
    if (!blocks.length) return
    // claim the blocks first, so overlapping calls never draw the same diagram twice
    blocks.forEach((block) => {
      block.dataset.rendered = 'pending'
    })
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'strict' })
    for (const block of blocks) {
      const source = decodeURIComponent(block.dataset.mermaidSource ?? '')
      try {
        const { svg } = await mermaid.render(`mermaid-${++counter}`, source)
        block.innerHTML = svg
        block.dataset.rendered = 'true'
      } catch {
        // keep the source listing that is already on the page
        block.dataset.rendered = 'failed'
      }
    }
  }

  nuxtApp.hook('app:mounted', renderDiagrams)
  nuxtApp.hook('page:finish', renderDiagrams)
})
