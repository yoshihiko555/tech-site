let mermaidInstance: typeof import('mermaid').default | null = null

const getMermaid = async () => {
  if (!mermaidInstance) {
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      fontFamily: '"Noto Sans JP", sans-serif',
      securityLevel: 'loose',
    })
    mermaidInstance = mermaid
  }
  return mermaidInstance
}

export const renderMermaidDiagrams = async (): Promise<void> => {
  const containers = document.querySelectorAll('.mermaid-diagram[data-mermaid-source]')
  if (containers.length === 0) return

  const mermaid = await getMermaid()

  for (let i = 0; i < containers.length; i++) {
    const element = containers[i] as HTMLElement
    const source = element.getAttribute('data-mermaid-source')
    if (!source) continue

    try {
      const decodedSource = decodeURIComponent(source)
      const id = `mermaid-${Date.now()}-${i}`
      const result = await mermaid.render(id, decodedSource)

      const svg = typeof result === 'string' ? result : result.svg
      element.innerHTML = svg
      element.classList.add('mermaid-rendered')
      element.removeAttribute('data-mermaid-source')
    } catch (error) {
      console.error('Mermaid rendering error:', error)
      element.classList.add('mermaid-error')
    }
  }
}
