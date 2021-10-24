<template>
  <div>
    <p>Default Slot:<slot>Default Value</slot></p>
    <p>Named Slot:<slot name="hoge">Default Value</slot></p>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  setup () {

    return {

    }
  }
})
</script>

<style lang="scss" scoped>

</style>
