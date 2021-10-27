import { ColorModeInstance } from '@nuxtjs/color-mode/types/color-mode'
import { ref, watch, onMounted, useContext, nextTick } from '@nuxtjs/composition-api'

export const useTheme = (colorMode: ColorModeInstance) => {
  const isDark = ref<boolean>(false)

  onMounted(() => {
    const prefrence = colorMode.preference
    if (prefrence === 'system') {
      // この中だとうまく型定義が読み込まれていない。。。
      // useContextの方でもうまくいかなかった
      // isDark.value = window
    } else {

    }
    isDark.value = colorMode.preference === 'dark'
    // const body = document.body
    // if (isDark.value) {
    //   body.setAttribute('vs-theme', 'dark')
    // } else {
    //   body.removeAttribute('vs-theme')
    // }
  })

  watch(isDark, now => {
    const body = document.body
    if (now) {
      colorMode.preference = 'dark'
      body.setAttribute('vs-theme', 'dark')
    } else {
      colorMode.preference = 'light'
      body.removeAttribute('vs-theme')
    }
  })
  return {
    isDark,
  }
}
