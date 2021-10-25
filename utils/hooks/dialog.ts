import { ref } from '@nuxtjs/composition-api'

/**
 * ダイアログ用Hooks
 * @returns
 */
export const useDialog = () => {
  const isOpen = ref<boolean>(false)
  const open = () => isOpen.value = true
  const close = () => isOpen.value = false

  return {
    isOpen,
    open,
    close,
  }
}
