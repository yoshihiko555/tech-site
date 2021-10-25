<template>
  <div>
    <vs-button
      @click="open"
      icon
      transparent
      color="#333333"
    >
      <i class="bx bx-menu" />
    </vs-button>
    <vs-sidebar
      v-model="active"
      :open.sync="isOpen"
      right
    >
      <template #header>
        <search-btn @click.native="openDialog" />
      </template>
      <vs-sidebar-item
        v-for="site in sites"
        :key="site.id"
        :id="site.id"
        :to="site.url"
        @click.native="close"
      >
        <span>{{ site.title }}</span>
      </vs-sidebar-item>
      <template #footer>
        <p class="text-center mb-2">Follow me!</p>
        <div class="flex justify-center mb-4 w-full">
          <vs-button icon href='https://twitter.com/yoshihiko5555' blank>
            <i class="bx bxl-twitter" />
          </vs-button>
          <vs-button icon href='https://github.com/yoshihiko555' blank>
            <i class="bx bxl-github" />
          </vs-button>
        </div>
      </template>
    </vs-sidebar>
    <search-dialog v-if="isOpenDialog" :open.sync="isOpenDialog" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { useSidebar, useDialog } from '~/utils/hooks'
import { SITE_MAPS } from '~/utils/const'
import SearchBtn from '~/components/atoms/search-btn.vue'
import SearchDialog from '~/components/organisms/search-dialog.vue'

export default defineComponent({
  components: {
    SearchBtn,
    SearchDialog,
  },
  setup () {
    const { route } = useContext()
    const { active, isOpen, open, close } = useSidebar(route)
    const {
      isOpen: isOpenDialog,
      open: openDialog,
    } = useDialog()
    return {
      sites: SITE_MAPS,
      active,
      isOpen,
      open,
      close,
      isOpenDialog,
      openDialog,
    }
  }
})
</script>

<style lang='scss' scoped>
.vs-sidebar-content::v-deep {

  &.right {
    border-radius: 30px 0 0 30px;
  }

  i {
    @include sm {
      font-size: 0.875em;
    }
  }

  .vs-sidebar__footer {
    @apply block;
  }
}

</style>
