<template>
  <vs-navbar
    fixed
    class="py-2"
  >
    <template #left>
      <nuxt-link to='/'>
        <img src='~/assets/img/logo.svg' alt="logo" width="30" height="30" />
      </nuxt-link>
    </template>
    <template #right>
      <div class='hidden sm:flex items-center gap-4'>
        <nuxt-link class='link' to='/about'>About</nuxt-link>
        <nuxt-link class='link' to='/blog'>Blog</nuxt-link>
        <nuxt-link class='link' to='/works'>Works</nuxt-link>
        <!-- <nuxt-link class='link' to='/contact'>Contact</nuxt-link> -->
        <vs-tooltip bottom>
          <vs-button icon href='https://twitter.com/yoshihiko5555' blank>
            <i class="bx bxl-twitter" />
          </vs-button>
          <template #tooltip>
            @yoshihiko5555
          </template>
        </vs-tooltip>
        <vs-tooltip bottom>
          <vs-button icon href='https://github.com/yoshihiko555' blank>
            <i class="bx bxl-github" />
          </vs-button>
          <template #tooltip>
            yoshihiko555
          </template>
        </vs-tooltip>
        <!-- 検索 -->
        <search-btn
          @click.native="open"
          v-shortkey="{ windows: ['ctrl', 'k'], mac: ['meta', 'k'] }"
          @shortkey.native="open"

        />
        <search-dialog
          v-if="isOpen"
          :open.sync="isOpen"
        />
      </div>
      <sidebar class="sm:hidden" />
    </template>
  </vs-navbar>
</template>

<script lang='ts'>
import { defineComponent, Ref } from '@nuxtjs/composition-api'
import { useDialog } from '~/utils/hooks'
import Sidebar from '~/components/organisms/sidebar.vue'
import SearchBtn from '~/components/atoms/search-btn.vue'
import SearchDialog from '~/components/organisms/search-dialog.vue'

type Data = {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
}

export default defineComponent({
  components: {
    Sidebar,
    SearchBtn,
    SearchDialog,
  },
  setup (): Data {
    const {
      isOpen,
      open,
      close,
    } = useDialog()

    return {
      isOpen,
      open,
      close,
    }
  }
})
</script>

<style lang="scss" scoped>
.link {
  @apply relative mx-2 font-medium;
  transition: .3s;

  &::after {
    @apply absolute left-0 w-0 bg-gray-600 duration-300;
    content: '';
    height: 1.2px;
    bottom: -4px;
  }

  &:hover::after {
    width: 100%;
  }
}

.vs-navbar-content {
  @apply transition-transform;

  &.hidden {
    @apply block;
  }
}
</style>
