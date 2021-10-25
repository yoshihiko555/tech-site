import { ref, Ref } from '@nuxtjs/composition-api'
import { Route } from 'vue-router'
import { Maybe } from '../../generated/graphql'

export type SidebarDataType = {
  isOpen: Ref<boolean>
  active: Ref<Maybe<string>>
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
  const active = ref<Maybe<string>>('home')
  const open = () => {
    isOpen.value = true
    const _active = route.value.name === 'index' ? 'home' : route.value.name
    active.value = _active
  }

  const close = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    active,
    open,
    close,
  }
}
