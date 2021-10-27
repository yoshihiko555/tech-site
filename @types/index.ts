export type NuxtError = {
  statusCode: number
  message?: string
  path?: string
}

export type NuxtColorModefunc = {
  preference: string
  value: string
  getColorScheme: () => string
  addClass: (value: string) => void
  removeClass: (value: string) => void
}
