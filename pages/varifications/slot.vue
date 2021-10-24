<template>
  <div>
    <h1 class="page-title">Slot</h1>
    <slot-child>
      <p ref='root'>Update Value in Default Slot</p>
      <template #hoge>
        <p>Update value in Named Slot</p>
      </template>
    </slot-child>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import SlotChild from '~/components/varification/slot-child.vue'
export default defineComponent({
  components: {
    SlotChild,
  },
  setup (_, { refs }) {
    onMounted(() => console.log(refs))
    return {

    }
  }
})
</script>

<style lang="scss" scoped>

</style>
