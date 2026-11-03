/**
 * The year the page was generated. Kept in the payload, so the browser shows the
 * same years and counts as the prerendered HTML even after New Year.
 */
export function useBuildYear() {
  return useState('build-year', () => new Date().getFullYear())
}
