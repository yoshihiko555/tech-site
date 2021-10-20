<template>
  <vs-sidebar
    v-model="active"
    :open.sync="isOpen"
    right
  >
    Sidebar
  </vs-sidebar>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, onMounted, computed, SetupContext, watch, onUpdated } from '@nuxtjs/composition-api'
type Props = {
  isOpen: boolean
}
type State = {
  active: string
  open: boolean
}
// サイドバーを独立したコンポーネントにしたかったが、知識が足りず断念
// 調査して再度挑戦したい。
// この辺の記事参考に使用と思ったが、emitを送っても反応がなかった。
// https://se-tomo.com/2018/11/10/vue-js-%E3%82%B3%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%AE%E9%96%93%E3%81%AE%E9%80%9A%E4%BF%A1%EF%BC%92/
// ※現時点で使用していない
export default defineComponent({
  props: {
    isOpen: {
      type: Boolean
    }
  },
  setup (props: Props, ctx: SetupContext) {
    const { isOpen } = toRefs<Props>(props)
    const { active, open } = toRefs(reactive<State>({
      active: 'home',
      open: false,
    }))
    onMounted(() => {
      // open.value = props.isOpen
    })
    onUpdated(() => {
      console.log('update', props)
    })
    watch(isOpen, (now, old) => {
      console.log('isOpen watch', now, old)
      open.value = now
    })
    watch(open, (now, old) => {
      console.log('open watch', now, old)
      ctx.emit('input', now)
    })
    return {
      active,
      open,
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
