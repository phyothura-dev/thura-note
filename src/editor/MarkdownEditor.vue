<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { MdEditor } from 'md-editor-v3'
import { useUiStore } from '@/stores/ui'

const props = withDefaults(
  defineProps<{
    modelValue: string
    height?: string
  }>(),
  {
    height: '640px',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const uiStore = useUiStore()
const editorTheme = computed(() => uiStore.theme)
const isMobile = ref(false)
let mediaQuery: MediaQueryList | null = null

function handleViewportChange() {
  isMobile.value = Boolean(mediaQuery?.matches)
}

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 767px)')
  handleViewportChange()
  mediaQuery.addEventListener('change', handleViewportChange)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', handleViewportChange)
})
</script>

<template>
  <MdEditor :key="isMobile ? 'mobile-editor' : 'desktop-editor'" :model-value="props.modelValue" :theme="editorTheme" code-theme="github"
    :preview="!isMobile" :toolbars-exclude="[]" :show-code-row-number="true" :auto-detect-code="true"
    :footers="['markdownTotal', '=', 'scrollSwitch']" :style="{ height: props.height }"
    class="mobile-editor rounded-lg border border-border/60" language="en-US"
    @update:model-value="(value) => emit('update:modelValue', value)" />
</template>
