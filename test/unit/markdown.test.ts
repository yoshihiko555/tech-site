import { describe, expect, it } from 'vitest'
import { renderFeedHtml, renderPost } from '../../server/utils/markdown'

const ORIGIN = 'https://yoshihiko.tech'

describe('renderPost', () => {
  it('drops the [[toc]] placeholder; the outline is built from headings instead', async () => {
    const { html } = await renderPost('[[toc]]\n\n## Intro\n\nbody', ORIGIN)
    expect(html).not.toContain('[[toc]]')
  })

  it('collects h2 and h3 only, with the same ids the old site used', async () => {
    const source = '# Title\n\n## はじめに\n\n### 準備\n\n#### 細かい話\n\n## Setup steps'
    const { html, headings } = await renderPost(source, ORIGIN)
    expect(headings).toEqual([
      { level: 2, id: encodeURIComponent('はじめに'), text: 'はじめに' },
      { level: 3, id: encodeURIComponent('準備'), text: '準備' },
      { level: 2, id: 'setup-steps', text: 'Setup steps' },
    ])
    for (const heading of headings) {
      expect(html).toContain(`id="${heading.id}"`)
    }
  })

  it('makes links to this site relative and opens other sites in a new tab', async () => {
    const source = [
      '[a](https://yoshihiko.tech/blog/rag-basic-knowledge)',
      '[b](https://www.yoshihiko.tech/)',
      '[c](https://github.com/yoshihiko555)',
      '[d](/tags/llm)',
    ].join('\n\n')
    const { html } = await renderPost(source, ORIGIN)
    expect(html).toContain('<a href="/blog/rag-basic-knowledge">a</a>')
    expect(html).toContain('<a href="/">b</a>')
    expect(html).toContain('<a href="https://github.com/yoshihiko555" target="_blank" rel="noopener noreferrer">c</a>')
    expect(html).toContain('<a href="/tags/llm">d</a>')
  })

  it('treats look-alike hosts as other sites', async () => {
    const { html } = await renderPost('[x](https://yoshihiko.tech.example.com/blog/a)', ORIGIN)
    expect(html).toContain(
      '<a href="https://yoshihiko.tech.example.com/blog/a" target="_blank" rel="noopener noreferrer">x</a>',
    )
  })

  it('keeps query and hash when it makes a link relative', async () => {
    const { html } = await renderPost('[x](https://yoshihiko.tech/blog/a?ref=1#setup)', ORIGIN)
    expect(html).toContain('<a href="/blog/a?ref=1#setup">x</a>')
  })

  it('gives the outline plain text, without markdown marks', async () => {
    const { headings } = await renderPost('## `CLAUDE.md` と **Hooks**', ORIGIN)
    expect(headings[0]?.text).toBe('CLAUDE.md と Hooks')
  })

  it('lazy-loads images', async () => {
    const { html } = await renderPost('![diagram](https://images.ctfassets.net/x.png)', ORIGIN)
    expect(html).toMatch(/<img [^>]*loading="lazy"/)
  })

  it('highlights code and names its language', async () => {
    const { html } = await renderPost('```ts\nconst a = 1\n```', ORIGIN)
    expect(html).toContain('<figure class="code" data-lang="ts">')
    expect(html).toContain('class="shiki')
  })

  it('falls back to plain text for languages it does not know', async () => {
    const { html } = await renderPost('```brainfuck\n+++.\n```', ORIGIN)
    expect(html).toContain('data-lang="brainfuck"')
    expect(html).toContain('+++.')
  })

  it('leaves mermaid as encoded source for the client to draw', async () => {
    const graph = 'graph TD\n  A-->B'
    const { html } = await renderPost(`\`\`\`mermaid\n${graph}\n\`\`\``, ORIGIN)
    expect(html).toContain(`data-mermaid-source="${encodeURIComponent(`${graph}\n`)}"`)
    expect(html).not.toContain('class="shiki')
  })

  it('counts reading time at 500 characters a minute, without code', async () => {
    const prose = 'あ'.repeat(1000)
    const code = `\`\`\`bash\n${'echo hi\n'.repeat(400)}\`\`\``
    expect((await renderPost(prose, ORIGIN)).readingMinutes).toBe(2)
    expect((await renderPost(`${'あ'.repeat(400)}\n\n${code}`, ORIGIN)).readingMinutes).toBe(1)
  })

  it('never reports less than one minute', async () => {
    expect((await renderPost('', ORIGIN)).readingMinutes).toBe(1)
  })
})

describe('renderFeedHtml', () => {
  it('keeps code plain, strips [[toc]] and rewrites links like the page', () => {
    const html = renderFeedHtml('[[toc]]\n\n[a](https://yoshihiko.tech/blog/x)\n\n```ts\nconst a = 1\n```', ORIGIN)
    expect(html).not.toContain('[[toc]]')
    expect(html).not.toContain('class="shiki')
    expect(html).toContain('<a href="/blog/x">a</a>')
  })
})
