import { Plugin } from '@nuxt/types'

/**
 * 対象文字列のフィルター処理
 * @param value 対象文字列
 * @param max 最大値
 * @param suffix 接尾辞
 * @returns
 */
const truncate = (value: string, max: number, suffix: string = '...') => {
  if (!value) return ''
  if (value.length >= max) return value.substr(0, max) + suffix
  return value
}

export class Logger {
  private readonly isDev: boolean
  constructor (env: string | undefined) {
    this.isDev = env !== 'production'
  }

  info (...msg: any[]) {
    console.info('[info]:', ...msg)
  }

  debug (...msg: any[]) {
    if (this.isDev) console.debug('[debug]:', ...msg)
  }

  warn (...msg: any[]) {
    if (this.isDev) console.warn('[warn]:', ...msg)
  }

  error (...msg: any[]) {
    if (this.isDev) console.error('[error]:', ...msg)
  }
}

const plugins: Plugin = (ctx, inject) => {
  inject('truncate', truncate)
  inject('log', new Logger(process.env.NODE_ENV))
}

export default plugins
