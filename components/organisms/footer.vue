<template>
  <footer class="mt-20 mb-8 text-center">
    <div class="mb-8">
        <nuxt-link class='link' to='/about'>About</nuxt-link>
        <nuxt-link class='link' to='/blog'>Blog</nuxt-link>
        <nuxt-link class='link' to='/works'>Works</nuxt-link>
    </div>
    <div class="mb-8">
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
    <small>&copy; 2021 Yoshihiko All Rights Reserved</small>
  </footer>
</template>

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
</style>
