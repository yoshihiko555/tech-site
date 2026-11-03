/** Same page size as the old /blog list. */
export const POSTS_PER_PAGE = 8

export function countPages(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE))
}

export function slicePage<T>(items: T[], page: number): T[] {
  return items.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
}

/** Page 1 lives at the base path; later pages at <base>/page/<n>. */
export function pagePath(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}/page/${page}`
}

/** A positive whole page number from a route param, or null when it is not one. */
export function parsePageParam(raw: string | string[] | undefined): number | null {
  const value = Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isInteger(value) && value >= 1 ? value : null
}
