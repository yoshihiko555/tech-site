/**
 * 非同期処理で実行タイミングをずらす
 * @returns
 */
export const shiftFunc = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, 500)
  })
}
