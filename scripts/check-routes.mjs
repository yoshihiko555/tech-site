// Checks that the static build covers every URL of the old site.
// Source of truth: scripts/fixtures/live-sitemap.xml (the old site's sitemap, 2026-11-03)
// plus the pagination pages, which the old sitemap left out on purpose.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const OUTPUT = process.argv[2] || '.output/public'
const REMOVED = new Set(['/about', '/works', '/contact']) // now redirects
const EXTRA = ['/blog/page/2', '/blog/page/3', '/feed.xml', '/sitemap.xml', '/robots.txt', '/sw.js']

const sitemap = readFileSync(new URL('./fixtures/live-sitemap.xml', import.meta.url), 'utf8')
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, loc]) => new URL(loc).pathname.replace(/\/$/, '') || '/')
  .filter((path) => !REMOVED.has(path))

function fileFor(path) {
  if (/\.[a-z]+$/.test(path)) return join(OUTPUT, path)
  return path === '/' ? join(OUTPUT, 'index.html') : join(OUTPUT, path, 'index.html')
}

const wanted = [...new Set([...paths, ...EXTRA])]
const missing = wanted.filter((path) => !existsSync(fileFor(path)))

console.log(`checked ${wanted.length} paths in ${OUTPUT}`)
if (missing.length) {
  console.error(`missing ${missing.length}:\n  ${missing.join('\n  ')}`)
  process.exit(1)
}
console.log('all present')
