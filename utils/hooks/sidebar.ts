import { ref, Ref } from '@nuxtjs/composition-api'
import { Route } from 'vue-router'

export type SidebarDataType = {
  isOpen: Ref<boolean>
  active: Ref<string>
  open: () => void
  close: () => void
}

/**
 * サイドバー用Hooks
 * @param route Ref<Route>
 * @returns
 */
export const useSidebar = (route: Ref<Route>): SidebarDataType => {
  const isOpen = ref<boolean>(false)
  const active = ref<string>('home')
  const open = () => {
    isOpen.value = true
    if (!route.value.name) return
    if (route.value.name === 'index') active.value = 'home'
    active.value = route.value.name
  }

  const close = () => isOpen.value = false

  return {
    isOpen,
    active,
    open,
    close,
  }
}
