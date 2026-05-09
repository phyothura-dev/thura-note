<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Save } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import MarkdownEditor from '@/editor/MarkdownEditor.vue';
import AppBreadcrumb from '@/components/AppBreadcrumb.vue';
import ThemeToggleButton from '@/components/ThemeToggleButton.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNotes } from '@/composables/useNotes';
import type { NotePayload, NoteStatus } from '@/types/note';

const route = useRoute();
const router = useRouter();
const { notes, notesQuery, createMutation, updateMutation } = useNotes();

const noteId = computed(() => Number(route.params.id));
const isEditMode = computed(() => route.name === 'note-edit');
const selectedNote = computed(() => notes.value.find((item) => item.id === noteId.value) ?? null);

const title = ref('');
const content = ref('');
const status = ref<NoteStatus | ''>('');

watch(
  [isEditMode, selectedNote],
  () => {
    if (isEditMode.value && selectedNote.value) {
      title.value = selectedNote.value.title;
      content.value = selectedNote.value.content;
      status.value = selectedNote.value.status;
      return;
    }

    if (!isEditMode.value) {
      title.value = '';
      content.value = '';
      status.value = '';
    }
  },
  { immediate: true },
);

async function onSave() {
  const payload: NotePayload = {
    title: title.value.trim() || 'Untitled',
    content: content.value,
    status: (status.value || 'Mid') as NoteStatus,
  };

  try {
    if (isEditMode.value && selectedNote.value) {
      await updateMutation.mutateAsync({ id: selectedNote.value.id, payload });
      toast.success('Note updated');
      router.push({ name: 'note-detail', params: { id: selectedNote.value.id } });
      return;
    }

    const created = await createMutation.mutateAsync(payload);
    toast.success('Note created');
    router.push({ name: 'note-detail', params: { id: created.id } });
  } catch {
    toast.error('Failed to save note');
  }
}

function onKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    void onSave();
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <main class="mx-auto w-full max-w-7xl px-4 pb-8 pt-8 md:px-6 md:pt-10">
    <section class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <AppBreadcrumb />

      <div class="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
        <Button variant="outline" size="sm" class="h-10 px-4" @click="router.push({ name: 'home' })">
          Cancel
        </Button>
        <Button size="sm" :disabled="createMutation.isPending.value || updateMutation.isPending.value" @click="onSave">
          <Save class="size-4" />
          Save
        </Button>

        <ThemeToggleButton />
      </div>
    </section>

    <section v-if="isEditMode && notesQuery.isLoading.value"
      class="rounded-lg border border-border/70 bg-card/80 px-6 py-10 text-center">
      <p class="text-sm text-muted-foreground">Loading note data...</p>
    </section>

    <section v-else-if="isEditMode && !selectedNote"
      class="rounded-lg border border-dashed border-border/70 bg-card/65 px-6 py-12 text-center">
      <h3 class="mb-2 text-xl font-semibold">Note not found</h3>
      <p class="mb-5 text-sm text-muted-foreground">The note may have been deleted or archived.</p>
      <Button class="rounded-lg" @click="router.push({ name: 'home' })">Back to home</Button>
    </section>

    <section v-else class="space-y-5">
      <article class="rounded-lg border border-border/70 bg-card/86 p-4 shadow-sm">
        <div class="grid gap-4 lg:grid-cols-2 mb-4">
          <Input id="note-title" v-model="title" placeholder="Title." class=" rounded-lg" />

          <Select v-model="status">
            <SelectTrigger aria-label="Priority" class="bg-transparent">
              <SelectValue placeholder="Priority." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Mid">Mid</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <MarkdownEditor v-model="content" />
      </article>
    </section>
  </main>
</template>
