import { ref, watch, onMounted, useContext } from '@nuxtjs/composition-api'

/**
 * テーマ設定用Hooks
 * @returns
 */
export const useTheme = () => {
  const { $colorMode } = useContext()
  const isDark = ref<boolean>(false)

  onMounted(() => {
    const preference = $colorMode.preference
    if (preference === 'system')
      isDark.value = window.__NUXT_COLOR_MODE__.value === 'dark'
    else
      isDark.value = $colorMode.preference === 'dark'
  })

  watch(isDark, now => {
    const body = document.body
    if (now) {
      $colorMode.preference = 'dark'
      body.setAttribute('vs-theme', 'dark')
    } else {
      $colorMode.preference = 'light'
      body.removeAttribute('vs-theme')
    }
  })
  return {
    isDark,
  }
}
