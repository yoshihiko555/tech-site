import { describe, expect, it } from 'vitest'
import { renderFeedHtml, renderPost } from '../../server/utils/markdown'

const ORIGIN = 'https://yoshihiko.tech'

describe.each([
  { label: '記事', render: async (source: string) => (await renderPost(source, ORIGIN)).html },
  { label: 'RSS', render: (source: string) => renderFeedHtml(source, ORIGIN) },
])('$label の脚注', ({ render }) => {
  it('名前付きの脚注を上付きの番号と末尾の一覧に変換し、本文に戻るリンクを付ける', async () => {
    const html = await render('本文[^takatani]と補足[^detail]。\n\n[^takatani]: 一つ目の注釈。\n[^detail]: 二つ目の注釈。')
    expect(html).toContain('<sup class="footnote-ref"><a href="#fn-footnote-1" id="fnref-footnote-1">[1]</a></sup>')
    expect(html).toContain('<sup class="footnote-ref"><a href="#fn-footnote-2" id="fnref-footnote-2">[2]</a></sup>')
    expect(html).toContain('<section class="footnotes">\n<ol class="footnotes-list">')
    expect(html).toContain('<li id="fn-footnote-1" class="footnote-item"><p>一つ目の注釈。')
    expect(html).toContain('<li id="fn-footnote-2" class="footnote-item"><p>二つ目の注釈。')
    expect(html).toContain('<a href="#fnref-footnote-1" class="footnote-backref">↩︎</a>')
    expect(html).toContain('<a href="#fnref-footnote-2" class="footnote-backref">↩︎</a>')
    expect(html).toMatch(/<\/ol>\n<\/section>\n$/)
    expect(html).not.toContain('[^')
  })

  it('脚注内の外部リンクにも別タブの設定を適用し、同一サイトのリンクは相対 URL にする', async () => {
    const html = await render([
      '本文[^source]。',
      '[^source]: **出典**は[外部](https://example.com/source)と[内部](https://yoshihiko.tech/blog/a?ref=1#setup)。',
      '    二段落目。',
    ].join('\n\n'))
    expect(html).toContain('<strong>出典</strong>')
    expect(html).toContain('<a href="https://example.com/source" target="_blank" rel="noopener noreferrer">外部</a>')
    expect(html).toContain('<a href="/blog/a?ref=1#setup">内部</a>')
    expect(html).toContain('<p>二段落目。')
    expect(html).not.toMatch(/<a href="#fn[^>]*target=/)
  })

  it('同じ脚注を複数回参照しても ID を重複させず、それぞれの位置へ戻れる', async () => {
    const html = await render('最初[^note]と再び[^note]。\n\n[^note]: 共通の注釈。')
    expect(html).toContain('href="#fn-footnote-1" id="fnref-footnote-1"')
    expect(html).toContain('href="#fn-footnote-1" id="fnref-footnote-1:1"')
    expect(html).toContain('href="#fnref-footnote-1" class="footnote-backref"')
    expect(html).toContain('href="#fnref-footnote-1:1" class="footnote-backref"')
    expect(html.match(/class="footnote-item"/g)).toHaveLength(1)
    const ids = Array.from(html.matchAll(/ id="([^"]+)"/g), (match) => match[1])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(['fn-footnote-1', 'fnref-footnote-1', 'fnref-footnote-1:1'])(
    '見出し %s のアンカーを維持しながら脚注 ID の衝突を避ける',
    async (heading) => {
      const html = await render(`## ${heading}\n\n本文[^note]と再参照[^note]。\n\n[^note]: 注釈。`)
      expect(html).toContain(`<h2 id="${heading}"`)
      expect(html).toContain('href="#fn-footnote--1" id="fnref-footnote--1"')
      expect(html).toContain('href="#fnref-footnote--1:1" class="footnote-backref"')
      const ids = Array.from(html.matchAll(/ id="([^"]+)"/g), (match) => match[1])
      expect(new Set(ids).size).toBe(ids.length)
    },
  )

  it('別の記事を描画するたびに脚注番号と ID をリセットする', async () => {
    await render('## fn-footnote-1\n\n本文[^a]と[^b]。\n\n[^a]: A\n[^b]: B')
    const html = await render('本文[^c]。\n\n[^c]: C')
    expect(html).toContain('href="#fn-footnote-1" id="fnref-footnote-1">[1]</a>')
    expect(html).not.toContain('fn-footnote--')
    expect(html).not.toContain('[2]')
  })

  it('脚注を使わない本文の HTML を変えない', async () => {
    const html = await render('本文 **強調** と `inline`。\n\n[内部](/blog/a)と[外部](https://example.com)。')
    expect(html).toBe(
      '<p>本文 <strong>強調</strong> と <code>inline</code>。</p>\n'
      + '<p><a href="/blog/a">内部</a>と<a href="https://example.com" target="_blank" rel="noopener noreferrer">外部</a>。</p>\n',
    )
  })

  it('対応する定義がない脚注の参照は元の記法のまま残す', async () => {
    const html = await render('本文[^missing]。')
    expect(html).toBe('<p>本文[^missing]。</p>\n')
  })
})

describe('renderPost', () => {
  it('見出し内の脚注番号を目次に混ぜず、既存の見出し ID を維持する', async () => {
    const { html, headings } = await renderPost('## 導入[^note]\n\n### 準備\n\n[^note]: 注釈。', ORIGIN)
    expect(headings).toEqual([
      { level: 2, id: '導入', text: '導入' },
      { level: 3, id: '準備', text: '準備' },
    ])
    expect(html).toContain('id="fn-footnote-1"')
  })

  it('drops the [[toc]] placeholder; the outline is built from headings instead', async () => {
    const { html } = await renderPost('[[toc]]\n\n## Intro\n\nbody', ORIGIN)
    expect(html).not.toContain('[[toc]]')
  })

  it('collects h2 and h3 only, with readable ids', async () => {
    const source = '# Title\n\n## はじめに\n\n### 準備\n\n#### 細かい話\n\n## Setup steps'
    const { html, headings } = await renderPost(source, ORIGIN)
    expect(headings).toEqual([
      { level: 2, id: 'はじめに', text: 'はじめに' },
      { level: 3, id: '準備', text: '準備' },
      { level: 2, id: 'setup-steps', text: 'Setup steps' },
    ])
    for (const heading of headings) {
      expect(html).toContain(`id="${heading.id}"`)
    }
  })

  it('keeps the old site\'s anchors reachable: they were these ids, percent-encoded', async () => {
    // the old site linked #%E3%81%AF... ; browsers percent-decode a fragment before matching ids
    const { headings } = await renderPost('## はじめに の 準備\n\n## Setup steps', ORIGIN)
    expect(headings.map((heading) => encodeURIComponent(heading.id))).toEqual([
      encodeURIComponent('はじめに-の-準備'),
      'setup-steps',
    ])
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

  it('puts a bar with the language, line count and a copy button on each code block', async () => {
    const { html } = await renderPost('```bash\necho one\necho two\n```\n\n```ts\nconst a = 1\n```', ORIGIN)
    expect(html).toContain('<span class="lang">BASH</span><span>2 LINES</span>')
    expect(html).toContain('<span class="lang">TS</span><span>1 LINE</span>')
    expect(html.match(/<button class="copy" type="button"/g)).toHaveLength(2)
  })

  it('wraps tables in a scroll box', async () => {
    const { html } = await renderPost('| a | b |\n| - | - |\n| 1 | 2 |', ORIGIN)
    expect(html).toMatch(/<div class="tbl"[^>]*><table>[\s\S]*<\/table><\/div>/)
  })

  it('numbers each h2 in order and leaves h3 alone', async () => {
    const { html } = await renderPost('## One\n\n### Sub\n\n## Two', ORIGIN)
    expect(html.match(/<span class="h-no" aria-hidden="true">\d+<\/span>/g)).toEqual([
      '<span class="h-no" aria-hidden="true">01</span>',
      '<span class="h-no" aria-hidden="true">02</span>',
    ])
  })

  it('restarts numbering for every post', async () => {
    await renderPost('## A\n\n## B', ORIGIN)
    const { html } = await renderPost('## C', ORIGIN)
    expect(html).toContain('<span class="h-no" aria-hidden="true">01</span>')
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
