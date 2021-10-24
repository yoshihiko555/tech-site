<template>
  <div>
    <div class="mb-4">
      <p>v-modle</p>
      <input
        type="text"
        class="input"
        v-model="value"
      />
    </div>
    <div class="mb-4">
      <p>emit</p>
      <input
        type="text"
        class="input"
        :value="emitValue"
        @input="$emit('emit-event', $event.target.value)"
      />
    </div>
    <div class="mb-4">
      <p>sync</p>
      <input
        type="text"
        class="input"
        :value="syncValue"
        @input="$emit('update:syncValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  props: {
    // v-modelで受け渡しするやつ
    value: {
      type: String
    },
    // emitで受け渡しするやつ
    emitValue: {
      type: String
    },
    // syncで受け渡しするやつ
    syncValue: {
      type: String
    }
  },
  setup () {
    return {
    }
  }
})
</script>

<style lang='scss' scoped>
.input {
  @apply border border-site-theme-light;
}
</style>
