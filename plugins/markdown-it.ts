import { Plugin } from '@nuxt/types'
import MarkdownIt from 'markdown-it'
import toc from 'markdown-it-table-of-contents'
import anchor from 'markdown-it-anchor'
import collasible from 'markdown-it-collapsible'

const plugins: Plugin = ({ $config }, inject) => {
  const md = new MarkdownIt({
    linkify: true,
    breaks: true,
  })

  // 目次生成
  md.use(toc)
  // 内部リンク
  md.use(anchor)
  // 折りたたみ
  md.use(collasible)

  const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // 同一オリジンの内部リンクへ置換
    const originReg = new RegExp(`^${$config.origin}`)
    if (tokens[idx]['attrs'][0][1].match(originReg))
      tokens[idx]['attrs'][0][1] = tokens[idx]['attrs'][0][1].replace($config.origin, '')

    if (tokens[idx]['attrs'][0][1].match('http')) {
      // Target blankの設定
      const targetIdx = tokens[idx].attrIndex('target')
      if (targetIdx < 0) tokens[idx].attrPush(['target', '_blank'])
      else tokens[idx].attrs[targetIdx][1] = '_blank'

      // rel要素の設定
      const relIdx = tokens[idx].attrIndex('rel')
      if (relIdx < 0) tokens[idx].attrPush(['rel', 'noopener noreferrer'])
      else tokens[idx].attrs[relIdx][1] = 'noopener noreferrer'
    }
    return defaultRender(tokens, idx, options, env, self)
  }

  inject('md', md)
}

export default plugins
