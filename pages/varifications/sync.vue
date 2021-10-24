<template>
  <div>
    <h1 class="page-title">.sync修飾子</h1>
    <sync-child
      v-model="model"
      :emitValue="emit"
      @emit-event="emit = $event"
      :syncValue.sync="sync"
    />
    <div class="mb-4">
      <p>
        v-modelで受け渡ししている値は、単一方向のデータなので
        子供のv-modelで上書きを行ったら、怒られますよと
      </p>
      <p class="text-xl">v-model : {{ model }}</p>
    </div>
    <div class="mb-4">
      <p>
        emitを使用して、子供から親にイベントを通知してあげれば怒られずに済みますよ
        ただ、propsが増えてくると、その分記述量が多くなってしまい可読性が下がります
      </p>
      <p class="text-xl">emit : {{ emit }}</p>
    </div>
    <div>
      <p>
        syncを使用すれば、これだけの記述で通知が可能になるよ
        子供側で通知する時は、event名をupdate:props名にしてあげるよ
      </p>
      <p class="text-xl">sync : {{ sync }}</p>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import SyncChild from '~/components/varification/sync-child.vue'
export default defineComponent({
  components: { SyncChild },
  setup () {
    const model = ref<string>('')
    const emit = ref<string>('')
    const sync = ref<string>('')
    return {
      model,
      emit,
      sync,
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
