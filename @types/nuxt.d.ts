import Vue from 'vue'
import MarkdownIt from 'markdown-it'
import { Logger } from '~/plugins/utils'

declare module 'vue/types/vue' {
  interface Vue {
    $truncate: (value: string, max: number, suffix?: string ) => string
    $md: MarkdownIt
  }
}

declare module '@nuxt/types' {
  interface Context {
    $truncate: (value: string, max: number, suffix?: string ) => string
    $log: Logger
    $md: MarkdownIt
  }
}

declare module 'vuex' {
  interface Store<S> {
    readonly $log: Logger
  }
}
