<script setup lang="ts">
/**
 * Article search (SEARCH in the header, or ⌘K / Ctrl+K anywhere): filters every post
 * by title, tag and category; ↑↓ to pick, Enter to open the article, Esc to close.
 */
const open = useState('search-open', () => false)
const { data } = await usePostIndex()
const nuxtApp = useNuxtApp()
const router = useRouter()

const query = ref('')
const active = ref(0)
/** in the DOM (stays a moment after closing for the fade) / faded in */
const rendered = ref(false)
const shown = ref(false)
const input = ref<HTMLInputElement | null>(null)
const list = ref<HTMLElement | null>(null)
const results = computed(() => searchPosts(data.value?.posts ?? [], query.value))
let lastFocus: HTMLElement | null = null
let closeTimer: ReturnType<typeof setTimeout> | undefined

/** 2026-05-07 -> 05/07, as the prototype shows it */
function monthDay(iso: string): string {
  return formatDate(iso).slice(5).replace('.', '/')
}

watch(open, async (isOpen) => {
  clearTimeout(closeTimer)
  if (isOpen) {
    lastFocus = document.activeElement as HTMLElement | null
    query.value = ''
    active.value = 0
    rendered.value = true
    nuxtApp.$lenis?.stop()
    await nextTick()
    input.value?.focus({ preventScroll: true })
    requestAnimationFrame(() => requestAnimationFrame(() => (shown.value = true)))
    return
  }
  shown.value = false
  closeTimer = setTimeout(() => (rendered.value = false), motionReduced() ? 0 : 300)
  if (!citySignals.covered) nuxtApp.$lenis?.start()
  lastFocus?.focus?.({ preventScroll: true })
})

watch(query, () => (active.value = 0))

/** keeps the highlighted row inside the scrolling list */
async function reveal() {
  await nextTick()
  const row = list.value?.children[active.value] as HTMLElement | undefined
  const box = list.value
  if (!row || !box) return
  if (row.offsetTop < box.scrollTop) box.scrollTop = row.offsetTop
  else if (row.offsetTop + row.offsetHeight > box.scrollTop + box.clientHeight) {
    box.scrollTop = row.offsetTop + row.offsetHeight - box.clientHeight
  }
}

function choose(i: number) {
  const post = results.value[i]
  open.value = false
  if (post) router.push(`/blog/${post.slug}`)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    const step = e.key === 'ArrowDown' ? 1 : -1
    active.value = clamp(active.value + step, 0, Math.max(0, results.value.length - 1))
    reveal()
  }
  else if (e.key === 'Enter') {
    e.preventDefault()
    if (results.value.length) choose(active.value)
  }
  else if (e.key === 'Escape') {
    e.preventDefault()
    open.value = false
  }
}

function onGlobalKey(e: KeyboardEvent) {
  // not while the top page's intro covers the screen
  if (citySignals.covered) return
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
  else if (e.key === 'Escape' && open.value) {
    open.value = false
  }
}

// a page change closes it (the chosen article, or back/forward while open)
const stopRouteHook = router.afterEach(() => {
  open.value = false
})
onMounted(() => document.addEventListener('keydown', onGlobalKey))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onGlobalKey)
  clearTimeout(closeTimer)
  stopRouteHook()
})
</script>

<template>
  <div
    v-if="rendered"
    class="pal"
    :class="{ open: shown }"
  >
    <div
      class="pal-scrim"
      @click="open = false"
    />
    <div
      class="pal-box chamfer"
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
      data-lenis-prevent
    >
      <label class="pal-q"><span aria-hidden="true">&gt;_</span><input
        ref="input"
        v-model="query"
        type="text"
        placeholder="search by title or tag"
        autocomplete="off"
        aria-label="Search articles"
        aria-controls="pal-res"
        :aria-activedescendant="results.length ? `pal-opt-${active}` : undefined"
        @keydown="onKey"
      ></label>
      <ul
        id="pal-res"
        ref="list"
        class="pal-res"
        role="listbox"
        aria-label="Results"
      >
        <li
          v-if="!results.length"
          class="empty"
        >
          NO MATCH. TRY ANOTHER WORD.
        </li>
        <li
          v-for="(post, i) in results"
          :id="`pal-opt-${i}`"
          :key="post.slug"
          role="option"
          :aria-selected="i === active"
          :class="{ act: i === active }"
          data-cursor="OPEN"
          @mousemove="active = i"
          @click="choose(i)"
        >
          <span>{{ post.title }}</span><time :datetime="post.publishedAt">{{ monthDay(post.publishedAt) }}</time>
        </li>
      </ul>
      <p class="pal-help">
        ↑↓ SELECT&#x3000;ENTER JUMP&#x3000;ESC CLOSE
      </p>
    </div>
  </div>
</template>

<style scoped>
.pal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  justify-items: center;
  align-items: start;
  padding: calc(env(safe-area-inset-top, 0px) + 12vh) var(--gut-r) 24px var(--gut-l);
}
.pal-scrim {
  position: absolute;
  inset: 0;
  background: rgba(8, 19, 21, 0.6);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  opacity: 0;
  transition: opacity 0.25s;
}
.pal-box {
  position: relative;
  width: min(560px, 100%);
  background: var(--base);
  box-shadow:
    inset 0 0 0 1.5px var(--aqua),
    0 30px 80px -20px rgba(0, 0, 0, 0.8);
  --c: 16px;
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  transition:
    opacity 0.25s,
    transform 0.5s var(--ease);
}
.pal.open .pal-scrim {
  opacity: 1;
}
.pal.open .pal-box {
  opacity: 1;
  transform: none;
}
.pal-q {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
  font: 14px var(--f-mono);
  color: var(--aqua);
}
.pal-q input {
  flex: 1;
  min-width: 0;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--ink);
  font: 15px var(--f-ja);
  outline: none;
  caret-color: var(--warm);
}
.pal-q input::placeholder {
  color: #6f8581;
  font: 400 11px var(--f-px);
  letter-spacing: 0.1em;
}
.pal-res {
  list-style: none;
  margin: 0;
  padding: 8px;
  max-height: min(46vh, 340px);
  overflow-y: auto;
  position: relative;
}
.pal-res li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  padding: 9px 12px;
  font: 14px var(--f-ja);
  color: #d6e6e2;
  cursor: pointer;
}
.pal-res li span {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.pal-res li time {
  font: 12px/1.7 var(--f-mono);
  color: var(--dim);
}
.pal-res li.act {
  background: var(--mustard);
  color: #18120f;
}
.pal-res li.act time {
  color: #18120f;
}
.pal-res li.empty {
  cursor: default;
  color: var(--dim);
  display: block;
  font: 400 11px var(--f-px);
}
.pal-help {
  margin: 0;
  padding: 10px 18px 14px;
  border-top: 1px solid rgba(92, 201, 190, 0.12);
  font: 400 10px/1.5 var(--f-px);
  letter-spacing: 0.1em;
  color: var(--dim);
}
</style>
