import createMarkdownIt from 'markdown-it'
import type { MarkdownIt, RendererRule } from 'markdown-it'
import anchor from 'markdown-it-anchor'
import markdownItShiki from '@shikijs/markdown-it'
import { createCssVariablesTheme } from 'shiki'
import type { BundledLanguage } from 'shiki'
import type { Heading } from '#shared/types/post'

/** Languages used across the posts (checked against all 24 articles). */
const LANGUAGES: BundledLanguage[] = [
  'bash',
  'shell',
  'json',
  'jsonc',
  'python',
  'typescript',
  'javascript',
  'tsx',
  'markdown',
  'yaml',
  'ini',
  'html',
  'css',
  'docker',
]
/** Shiki's built-in plain-text language; it needs no grammar, so it is not a BundledLanguage. */
const PLAIN_TEXT = 'text' as BundledLanguage

/** Colors come from CSS custom properties (--shiki-*), set by the site theme. */
const codeTheme = createCssVariablesTheme({
  name: 'site-code',
  variablePrefix: '--shiki-',
  fontStyle: true,
})

const CHARS_PER_MINUTE = 500
const TOC_PLACEHOLDER = /^\s*\[\[toc\]\]\s*$/gim
const SAME_SITE = ['https://yoshihiko.tech', 'https://www.yoshihiko.tech']

let pageRenderer: Promise<MarkdownIt> | null = null
let feedRenderer: MarkdownIt | null = null

const renderToken: RendererRule = (tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options)

function baseRenderer(origin: string): MarkdownIt {
  const md = createMarkdownIt({ linkify: true, breaks: true })
  md.use(anchor)

  const sameSite = [origin, ...SAME_SITE]
  const linkOpen = md.renderer.rules.link_open ?? renderToken
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]!
    const href = String(token.attrGet('href') ?? '')
    const local = sameSite.find((base) => base && href.startsWith(base))
    if (local) {
      token.attrSet('href', href.slice(local.length) || '/')
    } else if (/^https?:\/\//.test(href)) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener noreferrer')
    }
    return linkOpen(tokens, idx, options, env, self)
  }

  const image = md.renderer.rules.image ?? renderToken
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    tokens[idx]!.attrSet('loading', 'lazy')
    return image(tokens, idx, options, env, self)
  }
  return md
}

async function buildPageRenderer(origin: string): Promise<MarkdownIt> {
  const md = baseRenderer(origin)
  md.use(
    await markdownItShiki({
      theme: codeTheme,
      langs: LANGUAGES,
      langAlias: { sh: 'bash', zsh: 'bash', plaintext: 'text', dockerfile: 'docker' },
      defaultLanguage: PLAIN_TEXT,
      fallbackLanguage: PLAIN_TEXT,
    }),
  )

  // Mermaid stays as source; the client turns it into a diagram.
  // Every other block gets a wrapper that names its language.
  const fence = md.renderer.rules.fence ?? renderToken
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]!
    const lang = token.info.trim().split(/\s+/)[0] || 'text'
    if (lang === 'mermaid') {
      return (
        `<div class="mermaid-diagram" data-mermaid-source="${encodeURIComponent(token.content)}">` +
        `<pre class="mermaid-fallback"><code>${md.utils.escapeHtml(token.content)}</code></pre></div>\n`
      )
    }
    return `<figure class="code" data-lang="${md.utils.escapeHtml(lang)}">${fence(tokens, idx, options, env, self)}</figure>\n`
  }
  return md
}

function stripToc(source: string): string {
  return source.replace(TOC_PLACEHOLDER, '')
}

/** Article body for the post page: highlighted code, heading ids, and the outline. */
export async function renderPost(
  source: string,
  origin: string,
): Promise<{ html: string; headings: Heading[]; readingMinutes: number }> {
  pageRenderer ??= buildPageRenderer(origin)
  const md = await pageRenderer
  const body = stripToc(source)
  const env = {}
  const tokens = md.parse(body, env)

  const headings: Heading[] = []
  tokens.forEach((token, i) => {
    if (token.type !== 'heading_open' || (token.tag !== 'h2' && token.tag !== 'h3')) return
    const id = token.attrGet('id')
    const text = tokens[i + 1]?.content ?? ''
    if (id) headings.push({ level: token.tag === 'h2' ? 2 : 3, id: String(id), text })
  })

  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/\s+/g, '')
  return {
    html: md.renderer.render(tokens, md.options, env),
    headings,
    readingMinutes: Math.max(1, Math.ceil(prose.length / CHARS_PER_MINUTE)),
  }
}

/** Plain HTML for the RSS feed (no highlighting markup). */
export function renderFeedHtml(source: string, origin: string): string {
  feedRenderer ??= baseRenderer(origin)
  return feedRenderer.render(stripToc(source))
}
