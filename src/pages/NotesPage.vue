<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppTopbar from '@/components/AppTopbar.vue'
import NoteListSidebar from '@/components/NoteListSidebar.vue'
import MarkdownEditor from '@/editor/MarkdownEditor.vue'
import { useNotes } from '@/composables/useNotes'
import type { NotePayload } from '@/types/note'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'

const { notes, notesQuery, createMutation, updateMutation, deleteMutation } = useNotes()

const selectedId = ref<number | null>(null)
const search = ref('')
const title = ref('')
const content = ref('')
const status = ref<'High' | 'Mid' | 'Low'>('Mid')

watch(
  () => notes.value,
  (nextNotes) => {
    if (!nextNotes.length) {
      selectedId.value = null
      title.value = ''
      content.value = ''
      return
    }

    if (!selectedId.value || !nextNotes.some((note) => note.id === selectedId.value)) {
      const first = nextNotes[0]
      selectedId.value = first.id
      title.value = first.title
      content.value = first.content
    }
  },
  { immediate: true },
)

const selectedNote = computed(() => notes.value.find((note) => note.id === selectedId.value) ?? null)

watch(selectedNote, (note) => {
  if (!note) return
  title.value = note.title
  content.value = note.content
})

function onSelect(id: number) {
  selectedId.value = id
}

function onCreateDraft() {
  selectedId.value = null
  title.value = ''
  content.value = ''
}

async function onSave() {
  const payload: NotePayload = {
    title: title.value.trim() || 'Untitled',
    content: content.value,
    status: status.value,
  }

  try {
    if (!selectedId.value) {
      const note = await createMutation.mutateAsync(payload)
      selectedId.value = note.id
      toast.success('Note created')
      return
    }

    await updateMutation.mutateAsync({ id: selectedId.value, payload })
    toast.success('Note updated')
  } catch {
    toast.error('Failed to save note')
  }
}

async function onDelete() {
  if (!selectedId.value) return
  try {
    await deleteMutation.mutateAsync(selectedId.value)
    selectedId.value = null
    toast.success('Note deleted')
  } catch {
    toast.error('Failed to delete note')
  }
}
</script>

<template>
  <AppTopbar />

  <section class="grid gap-4 md:grid-cols-[280px,1fr]">
    <NoteListSidebar
      :notes="notes"
      :selected-id="selectedId"
      :search="search"
      @select="onSelect"
      @create="onCreateDraft"
      @search="(value) => (search = value)"
    />

    <Card>
      <CardHeader class="pb-3">
        <CardTitle>{{ selectedId ? 'Edit Note' : 'Create Note' }}</CardTitle>
      </CardHeader>

      <CardContent>
        <div class="mb-3 flex flex-wrap items-end gap-2">
          <div class="min-w-[220px] flex-1 space-y-2">
            <Label for="note-title">Title</Label>
            <Input id="note-title" v-model="title" placeholder="Note title" />
          </div>
          <Button :disabled="createMutation.isPending.value || updateMutation.isPending.value" @click="onSave">Save</Button>
          <Button variant="destructive" :disabled="!selectedId || deleteMutation.isPending.value" @click="onDelete">Delete</Button>
        </div>

        <MarkdownEditor v-model="content" />

        <p v-if="notesQuery.isLoading.value" class="mt-3 text-sm text-muted-foreground">Loading notes...</p>
        <p v-if="notesQuery.isError.value" class="mt-3 text-sm text-destructive">Failed to load notes.</p>
      </CardContent>
    </Card>
  </section>
</template>

