import { NuxtColorModefunc } from './index'

declare global {
  interface Window {
    hoge: number
    __NUXT_COLOR_MODE__: NuxtColorModefunc
  }
}

// declare var window: Window
