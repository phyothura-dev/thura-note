<script setup lang="ts">
import { MoonStar, Sun } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/stores/ui';

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'icon' | 'default' | 'lg';
    class?: string;
  }>(),
  {
    size: 'icon',
    class: '',
  },
);

const uiStore = useUiStore();
</script>

<template>
  <Button variant="ghost" :size="props.size" :class="props.class" @click="uiStore.toggleTheme">
    <Sun v-if="uiStore.theme === 'dark'" class="size-5" />
    <MoonStar v-else class="size-5" />
  </Button>
</template>
