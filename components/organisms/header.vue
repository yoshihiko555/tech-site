<template>
  <div>
    <vs-navbar
      fixed
      hideScroll
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
            @click.native="openDialog"
            v-shortkey="{ windows: ['ctrl', 'k'], mac: ['meta', 'k'] }"
            @shortkey.native="openDialog"

          />
          <search-dialog
            v-if="isDialogOpen"
            :open.sync="isDialogOpen"
          />
        </div>
        <div class="sm:hidden">
          <vs-button
            @click='openSidebar'
            icon
            transparent
            color="#333333"
          >
            <i class='bx bx-menu' />
          </vs-button>
        </div>
      </template>
    </vs-navbar>
    <!-- TODO : スマホだとナビのメニュークリックしても自動で閉じてくれない -->
    <!-- サイドバー -->
    <!-- ついでに別のコンポーネント化してみる -->
    <vs-sidebar
      v-model="activeMenu"
      :open.sync="isSideOpen"
      right
    >
      <template #header>
        Search
      </template>
      <vs-sidebar-item
        v-for="site in sites"
        :key="site.id"
        :id="site.id"
        :to="site.url"
      >
        <span @click.self="closeSidebar">{{ site.title }}</span>
      </vs-sidebar-item>
      <template #footer>
        Footer
      </template>
    </vs-sidebar>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, Ref, useContext } from '@nuxtjs/composition-api'
import { useSidebar } from '~/utils/hooks/sidebar'
import Sidebar from '~/components/organisms/sidebar.vue'
import SearchBtn from '~/components/atoms/search-btn.vue'
import SearchDialog from '~/components/organisms/search-dialog.vue'
import { SITE_MAPS, SiteType } from '~/utils/const'
import { Maybe } from 'graphql/jsutils/Maybe'

type Data = {
  sites: SiteType[]
  isSideOpen: Ref<boolean>
  activeMenu: Ref<Maybe<string>>
  openSidebar: () => void
  closeSidebar: () => void
  isDialogOpen: Ref<boolean>
  openDialog: () => void
  closeDialog: () => void
}

export default defineComponent({
  components: {
    Sidebar,
    SearchBtn,
    SearchDialog,
  },
  setup (_, { refs }): Data {
    const { route } = useContext()
    const {
      isOpen: isSideOpen,
      active: activeMenu,
      open: openSidebar,
      close: closeSidebar,
    } = useSidebar(route)
    const isDialogOpen = ref<boolean>(false)
    const openDialog = () => isDialogOpen.value = true
    const closeDialog = () => isDialogOpen.value = false

    return {
      sites: SITE_MAPS,
      activeMenu,
      isSideOpen,
      openSidebar,
      closeSidebar,
      isDialogOpen,
      openDialog,
      closeDialog,
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

  .vs-sidebar-content.right {
    border-radius: 30px 0 0 30px;
  }
  .vs-button__content i {
    @include sm {
      font-size: 0.875em;
    }
  }
</style>
