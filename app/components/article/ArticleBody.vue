<script setup lang="ts">
/** The rendered post body. Adds copy buttons and the section-number flicker on the client. */
defineProps<{ html: string, id: string }>()

const root = ref<HTMLElement | null>(null)
const GLYPHS = '0123456789#%/<>=+*'
let observer: IntersectionObserver | null = null

function flicker(el: Element) {
  const final = el.textContent ?? ''
  let step = 0
  const tick = () => {
    step++
    el.textContent = step < 12
      ? Array.from({ length: final.length }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('')
      : final
    if (step < 12) setTimeout(tick, 40)
  }
  tick()
}

async function copy(button: HTMLButtonElement) {
  const code = button.closest('.code')?.querySelector('pre code, pre')
  if (!code) return
  const done = (label: string) => {
    button.textContent = label
    button.classList.add('ok')
    setTimeout(() => {
      button.textContent = 'COPY'
      button.classList.remove('ok')
    }, 1600)
  }
  try {
    await navigator.clipboard.writeText(code.textContent ?? '')
    done('COPIED')
  }
  catch {
    const range = document.createRange()
    range.selectNodeContents(code)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    done('SELECTED')
  }
}

function onClick(e: MouseEvent) {
  const button = (e.target as Element | null)?.closest('button.copy')
  if (button instanceof HTMLButtonElement) copy(button)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.value) return
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      observer?.unobserve(entry.target)
      flicker(entry.target)
    }
  }, { rootMargin: '0px 0px -20% 0px' })
  root.value.querySelectorAll('h2 .h-no').forEach(el => observer!.observe(el))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <!-- eslint-disable vue/no-v-html -- body is rendered from our own Contentful posts at build time -->
  <article
    :id="id"
    ref="root"
    class="prose"
    @click="onClick"
    v-html="html"
  />
</template>
