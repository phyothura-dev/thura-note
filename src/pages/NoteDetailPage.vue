<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Loader2, PencilLine, Trash2 } from 'lucide-vue-next';
import { MdPreview } from 'md-editor-v3';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import AppBreadcrumb from '@/components/AppBreadcrumb.vue';
import ThemeToggleButton from '@/components/ThemeToggleButton.vue';
import { useNotes } from '@/composables/useNotes';
import { useUiStore } from '@/stores/ui';
import { formatDateTime } from '@/utils/format';
import { statusTone } from '@/utils/note';

const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
const { notes, notesQuery, deleteMutation } = useNotes();

const noteId = computed(() => Number(route.params.id));
const note = computed(() => notes.value.find((item) => item.id === noteId.value) ?? null);
const previewCodeTheme = computed(() => (uiStore.theme === 'dark' ? 'atom' : 'github'));
const previewId = 'detail-preview';
const tocItems = ref<Array<{ id: string; text: string; level: number }>>([]);
const activeTocId = ref('');

function buildTableOfContents() {
  const previewRoot = document.querySelector(`#${previewId}`) as HTMLElement | null;
  if (!previewRoot) {
    tocItems.value = [];
    return;
  }

  const headings = Array.from(previewRoot.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLElement[];

  tocItems.value = headings.map((heading, index) => {
    if (!heading.id) {
      heading.id = `note-heading-${index + 1}`;
    }

    return {
      id: heading.id,
      text: heading.textContent?.trim() || `Section ${index + 1}`,
      level: Number(heading.tagName.slice(1)),
    };
  });
}

function scrollToHeading(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  activeTocId.value = id;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

watch(
  () => [note.value?.content, uiStore.theme],
  async () => {
    await nextTick();
    buildTableOfContents();
    if (!tocItems.value.some((item) => item.id === activeTocId.value)) {
      activeTocId.value = tocItems.value[0]?.id ?? '';
    }
  },
  { immediate: true },
);

async function onDelete() {
  if (!note.value) return;

  try {
    await deleteMutation.mutateAsync(note.value.id);
    toast.success('Note deleted');
    router.push({ name: 'home' });
  } catch {
    toast.error('Failed to delete note');
  }
}
</script>

<template>
  <main class="mx-auto w-full max-w-7xl overflow-x-hidden px-4 pb-8 pt-8 md:px-6 md:pt-10">
    <section class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <AppBreadcrumb />
      <div class="flex w-full items-center justify-end gap-2 sm:w-auto">
        <Button v-if="note" class="rounded-lg" size="sm" @click="router.push({ name: 'note-edit', params: { id: note.id } })">
          <PencilLine class="size-4" />
          Edit
        </Button>
        <Button v-if="note" variant="destructive" size="sm" class="rounded-lg" :disabled="deleteMutation.isPending.value" @click="onDelete">
          <Trash2 class="size-4" />
          Delete
        </Button>
        <ThemeToggleButton class="rounded-lg" />
      </div>
    </section>

    <section v-if="note" class="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span class="rounded-full border border-border/70 bg-card/70 px-3 py-1.5">Created {{ formatDateTime(note.created_at) }}</span>
      <span class="rounded-full border border-border/70 bg-card/70 px-3 py-1.5">Updated {{ formatDateTime(note.updated_at) }}</span>
      <span class="rounded-full border px-3 py-1.5 font-semibold" :class="statusTone(note.status)">
        {{ note.status }}
      </span>
    </section>

    <section v-if="notesQuery.isLoading.value" class="px-6 py-10 text-center">
      <Loader2 class="mx-auto h-10 w-10 animate-spin text-primary" />
    </section>

    <section v-else-if="!note" class="rounded-lg border border-dashed border-border/70 bg-card/65 px-6 py-12 text-center">
      <h2 class="mb-2 text-xl font-semibold">Note not found</h2>
      <p class="mb-5 text-sm text-muted-foreground">This note might be deleted or archived already.</p>
      <Button class="rounded-lg" @click="router.push({ name: 'home' })">Back to home</Button>
    </section>

    <article v-else class="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <section class="order-2 min-w-0 space-y-5 rounded-lg border border-border/70 bg-card/84 p-4 shadow-sm sm:p-6 lg:order-1">
        <header class="border-b border-border/60 pb-4">
          <h1 class="text-2xl font-bold tracking-tight md:text-4xl">{{ note.title || 'Untitled' }}</h1>
        </header>

        <div class="rounded-lg bg-background/30 p-1">
          <MdPreview :editor-id="previewId" :model-value="note.content" :theme="uiStore.theme" preview-theme="github" :code-theme="previewCodeTheme" class="detail-markdown" />
        </div>
      </section>

      <aside class="order-1 min-w-0 h-fit rounded-lg border border-border/70 bg-card/78 p-4 shadow-sm lg:order-2 lg:sticky lg:top-28">
        <h3 class="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Table of Contents</h3>
        <ul v-if="tocItems.length" class="space-y-1.5">
          <li v-for="item in tocItems" :key="item.id">
            <button
              type="button"
              class="w-full border-l-2 border-transparent py-1 text-left text-sm text-muted-foreground transition hover:cursor-pointer hover:text-primary"
              :class="[item.level <= 2 ? 'font-medium' : '', activeTocId === item.id ? 'border-primary text-primary' : '']"
              :style="{ paddingLeft: `${(item.level - 1) * 12}px` }"
              @click="scrollToHeading(item.id)"
            >
              {{ item.text }}
            </button>
          </li>
        </ul>
        <p v-else class="text-sm text-muted-foreground">No headings found.</p>
      </aside>
    </article>
  </main>
</template>
