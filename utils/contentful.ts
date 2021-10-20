/**
 * ContentfulClient生成用ファイル
 * ※現在使用していない
 */
import { createClient } from 'contentful'

export type ContentfulConfig = {
  CTF_SPACE_ID: string
  CTF_CDA_TOKEN: string
}

const defaultConfig: ContentfulConfig = {
  CTF_SPACE_ID: process.env.CTF_SPACE_ID || '',
  CTF_CDA_TOKEN: process.env.CTF_CDA_TOKEN || '',
}

export const client = (config: ContentfulConfig = defaultConfig) => {
  return createClient({
    space: config.CTF_SPACE_ID,
    accessToken: config.CTF_CDA_TOKEN,
  })
}
