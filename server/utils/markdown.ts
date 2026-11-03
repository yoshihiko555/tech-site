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
const SAME_SITE_HOSTS = ['yoshihiko.tech', 'www.yoshihiko.tech']

function hostOf(url: string): string | null {
  try {
    return new URL(url).host
  } catch {
    return null
  }
}

/** The path of an absolute link to this site, or null for any other link. */
function sameSitePath(href: string, hosts: Set<string>): string | null {
  if (!/^https?:\/\//i.test(href)) return null
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }
  return hosts.has(url.host) ? `${url.pathname}${url.search}${url.hash}` : null
}

let pageRenderer: Promise<MarkdownIt> | null = null
let feedRenderer: MarkdownIt | null = null

const renderToken: RendererRule = (tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options)

/**
 * Heading id: markdown-it-anchor's default slug without the percent-encoding, so the
 * router can find the heading of a #hash it has decoded. The old site's links
 * (#%E3%81%AF...) still land, as browsers percent-decode a fragment before matching ids.
 */
function slugify(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, '-')
}

function baseRenderer(origin: string): MarkdownIt {
  const md = createMarkdownIt({ linkify: true, breaks: true })
  md.use(anchor, { slugify })

  const hosts = new Set([...SAME_SITE_HOSTS, hostOf(origin)].filter((host): host is string => !!host))
  const linkOpen = md.renderer.rules.link_open ?? renderToken
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]!
    const href = String(token.attrGet('href') ?? '')
    const local = sameSitePath(href, hosts)
    if (local !== null) {
      token.attrSet('href', local)
    } else if (/^https?:\/\//i.test(href)) {
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
    const label = md.utils.escapeHtml(lang)
    const lines = token.content.replace(/\n$/, '').split('\n').length
    const bar =
      `<div class="code-bar"><span class="lang">${label.toUpperCase()}</span>` +
      `<span>${lines} ${lines === 1 ? 'LINE' : 'LINES'}</span>` +
      `<button class="copy" type="button" data-cursor="COPY">COPY</button></div>`
    return `<figure class="code" data-lang="${label}">${bar}${fence(tokens, idx, options, env, self)}</figure>\n`
  }

  // tables scroll inside their own box on narrow screens
  md.renderer.rules.table_open = () => '<div class="tbl" tabindex="0" role="region" aria-label="Table"><table>\n'
  md.renderer.rules.table_close = () => '</table></div>\n'

  // sections are numbered 01, 02, ... in front of each h2
  const headingOpen = md.renderer.rules.heading_open ?? renderToken
  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const html = headingOpen(tokens, idx, options, env, self)
    const counter = env as { sectionCount?: number } | undefined
    if (tokens[idx]!.tag !== 'h2' || !counter) return html
    counter.sectionCount = (counter.sectionCount ?? 0) + 1
    return `${html}<span class="h-no" aria-hidden="true">${String(counter.sectionCount).padStart(2, '0')}</span>`
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
    // plain text, as markdown-it-anchor reads it (no ` or ** marks)
    const text = (tokens[i + 1]?.children ?? [])
      .filter((child) => child.type === 'text' || child.type === 'code_inline')
      .map((child) => child.content)
      .join('')
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
