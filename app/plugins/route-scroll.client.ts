export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  // Nuxt restores its scroll handler during mounting; wrap it afterwards.
  nuxtApp.hook('app:mounted', () => {
    const scrollBehavior = router.options.scrollBehavior
    if (!scrollBehavior) return

    router.options.scrollBehavior = async (to, from, savedPosition) => {
      const position = await scrollBehavior.call(router, to, from, savedPosition)
      // Keep Nuxt's timing, history restoration and anchor handling.
      if (position && to.path !== from.path && !to.hash) {
        return { ...position, behavior: 'instant' }
      }
      return position
    }
  })
})
