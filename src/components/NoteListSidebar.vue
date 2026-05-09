<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Note } from '@/types/note'

const props = defineProps<{
  notes: Note[]
  selectedId: number | null
  search: string
}>()

const emit = defineEmits<{
  select: [id: number]
  create: []
  search: [value: string]
}>()

const filtered = computed(() => {
  const keyword = props.search.trim().toLowerCase()
  if (!keyword) return props.notes
  return props.notes.filter((note) => note.title.toLowerCase().includes(keyword))
})
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between gap-2">
        <CardTitle class="text-sm">Notes</CardTitle>
        <Button size="sm" variant="secondary" @click="emit('create')">New</Button>
      </div>
    </CardHeader>

    <CardContent>
      <Input
        class="mb-3"
        :model-value="search"
        placeholder="Search by title"
        @update:model-value="emit('search', String($event))"
      />

      <ul class="space-y-1">
        <li v-for="note in filtered" :key="note.id">
          <Button
            type="button"
            variant="ghost"
            class="w-full justify-start"
            :class="selectedId === note.id ? 'bg-accent' : ''"
            @click="emit('select', note.id)"
          >
            {{ note.title || 'Untitled' }}
          </Button>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
