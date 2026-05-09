<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { Toaster } from '@/components/ui/sonner'

const uiStore = useUiStore()
const toasterTheme = computed(() => uiStore.theme)

uiStore.applyTheme(uiStore.theme)
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <Toaster rich-colors position="top-right" :theme="toasterTheme" close-button />
    <RouterView />
  </div>
</template>
