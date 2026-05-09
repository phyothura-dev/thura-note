<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, Plus, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import ThemeToggleButton from '@/components/ThemeToggleButton.vue'

interface Props {
  search?: string
  showAddButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  search: '',
  showAddButton: true,
})

const emit = defineEmits<{
  'update:search': [value: string]
  create: []
}>()

const authStore = useAuthStore()
const router = useRouter()
const searchRef = ref<HTMLInputElement | null>(null)

function signOut() {
  authStore.logout()
  router.push({ name: 'login' })
}

function focusSearch() {
  searchRef.value?.focus()
}

function onGlobalKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  const isTypingTarget = Boolean(
    target &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable),
  )

  if (event.key === '/' && !isTypingTarget) {
    event.preventDefault()
    focusSearch()
    return
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    focusSearch()
    return
  }

  if (props.showAddButton && !isTypingTarget && event.key.toLowerCase() === 'n') {
    event.preventDefault()
    emit('create')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
    <div class="mx-auto flex w-full max-w-8xl  gap-3 px-4 py-3 md:grid md:grid-cols-[auto_minmax(420px,1fr)_auto] md:items-center md:gap-4 md:px-6 md:py-4">
      <h1 class="hidden md:flex order-1 text-lg font-bold leading-tight text-primary">
        <router-link :to="{ name: 'home' }">Thura Note</router-link>
      </h1>

      <div class="order-3 w-full md:order-2 md:flex md:justify-center">
        <label
          class="group flex h-11 w-full items-center gap-2 rounded-lg border border-border/70 bg-card/85 px-3 shadow-sm transition-all duration-200 focus-within:border-primary/70 focus-within:shadow-md md:mx-auto md:max-w-2xl">
          <Search class="size-4 text-muted-foreground transition group-focus-within:text-primary" />
          <input ref="searchRef" :value="search" type="search" aria-label="Search notes" placeholder="Search notes"
            class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            @input="emit('update:search', String(($event.target as HTMLInputElement).value))">
          <span
            class="hidden rounded-md border border-border/70 px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline">/</span>
        </label>
      </div>

      <div class="order-2 flex items-center justify-between gap-2 md:order-3 md:justify-end md:flex-nowrap">
        <Button v-if="showAddButton"
          class="fixed -bottom-140 right-5 z-50 h-12 rounded-lg px-6 shadow-lg transition-all duration-200 hover:-translate-y-0.5 md:static md:h-10 md:rounded-lg md:px-4 md:shadow-sm"
          @click="emit('create')">
          <Plus class="size-5 md:size-4" />
          <span class="hidden md:inline">Add</span>
        </Button>

        <div class="ml-auto flex items-center gap-2">
          <ThemeToggleButton class="size-10 rounded-lg" />
          <Button variant="ghost" size="sm" class="h-10 rounded-lg px-4" @click="signOut">
            <LogOut class="size-5" />
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>
