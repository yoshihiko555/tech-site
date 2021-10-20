<template>
  <div>
    <vs-navbar class="sm:px-6">
      <template #left>
        <nuxt-link to='/'>
          <img src='~/assets/img/logo.svg' alt="logo" width="30" height="30" />
        </nuxt-link>
      </template>
      <template #right>
        <div class='hidden sm:inline-block'>
          <!-- <nuxt-link v-for="site in sites" :key="site.id" :to="site.url" class="link">
            {{ site.id !== 'home' && site.title }}
          </nuxt-link> -->
          <nuxt-link class='link' to='/about'>About</nuxt-link>
          <nuxt-link class='link' to='/blog'>Blog</nuxt-link>
          <nuxt-link class='link' to='/works'>Works</nuxt-link>
          <!-- <nuxt-link class='link' to='/contact'>Contact</nuxt-link> -->
          <vs-tooltip bottom class="inline-block">
            <vs-button icon href='https://twitter.com/yoshihiko5555' blank>
              <i class="bx bxl-twitter" />
            </vs-button>
            <template #tooltip>
              @yoshihiko5555
            </template>
          </vs-tooltip>
          <vs-tooltip bottom class="inline-block">
            <vs-button icon href='https://github.com/yoshihiko555' blank>
              <i class="bx bxl-github" />
            </vs-button>
            <template #tooltip>
              yoshihiko555
            </template>
          </vs-tooltip>
        </div>
        <div class="sm:hidden">
          <vs-button @click='open' icon transparent color="#333333">
            <i class='bx bx-menu' />
          </vs-button>
        </div>
      </template>
    </vs-navbar>
    <vs-sidebar
      v-model="active"
      :open.sync="isOpen"
      right
    >
      <vs-sidebar-item
        v-for="site in sites"
        :key="site.id"
        :id="site.id"
        :to="site.url"
      >
        <span @click="isOpen = false">{{ site.title }}</span>
      </vs-sidebar-item>
    </vs-sidebar>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, Ref, useContext } from '@nuxtjs/composition-api'
import Sidebar from '~/components/organisms/sidebar.vue'
import { SITE_MAPS, SiteType } from '~/utils/const'

type Data = {
  active: Ref<string | null | undefined>
  isOpen: Ref<boolean>
  sites: SiteType[]
  open: () => void
}

export default defineComponent({
  components: {
    Sidebar,
  },
  setup (): Data {
    const active = ref<string | null | undefined>('home')
    const isOpen = ref<boolean>(false)
    const { route } = useContext()

    const open = () => {
      isOpen.value = !isOpen.value
      const tmpActive = route.value.name === 'index' ? 'home' : route.value.name
      active.
      value = tmpActive
    }

    return {
      active,
      isOpen,
      sites: SITE_MAPS,
      open,
    }
  }
})
</script>

<style lang="scss" scoped>
  .link {
    @apply relative mx-1 px-1 font-medium;
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

  .vs-sidebar-content.right {
    border-radius: 30px 0 0 30px;
  }
  .vs-button__content i {
    @include sm {
      font-size: 0.875em;
    }
  }
</style>
