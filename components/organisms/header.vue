<template>
  <div>
    <header class="fixed flex w-full items-center justify-between px-4 py-2 h-16 z-50 bg-white dark:bg-site-black-theme rounded-b-3xl">
      <nuxt-link to="/">
        <img v-if="$colorMode.value === 'light'" src='~/assets/img/logo.svg' alt="logo" width="30" height="30" />
        <img v-else src='~/assets/img/logo-dark.svg' alt="logo" width="30" height="30" />
      </nuxt-link>

      <div class="hidden sm:flex items-center gap-4">
        <nuxt-link class='navi-link' to='/about'>About</nuxt-link>
        <nuxt-link class='navi-link' to='/blog'>Blog</nuxt-link>
        <nuxt-link class='navi-link' to='/works'>Works</nuxt-link>
        <!-- <nuxt-link class='navi-link' to='/contact'>Contact</nuxt-link> -->
        <vs-tooltip bottom>
          <vs-button icon href='https://twitter.com/yoshihiko5555' blank size="small">
            <i class="bx bxl-twitter header-icon" />
          </vs-button>
          <template #tooltip>
            @yoshihiko5555
          </template>
        </vs-tooltip>
        <vs-tooltip bottom>
          <vs-button icon href='https://github.com/yoshihiko555' blank>
            <i class="bx bxl-github header-icon" />
          </vs-button>
          <template #tooltip>
            yoshihiko555
          </template>
        </vs-tooltip>
        <vs-switch v-model="isDark">
          <template #off>
            <i class="bx bx-sun" />
          </template>
          <template #on>
            <i class="bx bx-moon" />
          </template>
        </vs-switch>
        <!-- 検索 -->
        <search-btn
          @click.native="open"
          v-shortkey="{ windows: ['ctrl', 'k'], mac: ['meta', 'k'] }"
          @shortkey.native="open"

        />
      </div>
      <sidebar class="sm:hidden" />
    </header>
    <search-dialog
      v-if="isOpen"
      :open.sync="isOpen"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
import { useDialog, useTheme } from '~/utils/hooks'
import Sidebar from '~/components/organisms/sidebar.vue'
import SearchBtn from '~/components/atoms/search-btn.vue'
import SearchDialog from '~/components/organisms/search-dialog.vue'

export default defineComponent({
  components: {
    Sidebar,
    SearchBtn,
    SearchDialog,
  },
  setup () {
    const {
      isOpen,
      open,
      close,
    } = useDialog()
    const { isDark } = useTheme()

    return {
      isOpen,
      open,
      close,
      isDark,
    }
  }
})
</script>
