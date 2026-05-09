<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppNavBar from '@/components/AppNavBar.vue';
import { useNotes } from '@/composables/useNotes';
import type { NoteStatus } from '@/types/note';
import { formatDate } from '@/utils/format';
import { statusTone } from '@/utils/note';
import { Loader2 } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const { notes, notesQuery } = useNotes();

const search = ref(typeof route.query.q === 'string' ? route.query.q : '');
const filter = ref<'All' | NoteStatus>('All');

watch(search, (value) => {
  router.replace({
    name: 'home',
    query: value ? { q: value } : {},
  });
});

const visibleNotes = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  return notes.value.filter((note) => {
    const byStatus = filter.value === 'All' || note.status === filter.value;
    const byKeyword = !keyword || note.title.toLowerCase().includes(keyword) || note.content.toLowerCase().includes(keyword);

    return byStatus && byKeyword;
  });
});

function openCreate() {
  router.push({ name: 'note-create' });
}

function openDetail(id: number) {
  router.push({ name: 'note-detail', params: { id } });
}

</script>

<template>
  <AppNavBar :search="search" @update:search="(value) => (search = value)" @create="openCreate" />

  <main class="mx-auto w-full max-w-8xl px-4 pb-8 pt-32 md:px-6">
    <div class="mb-5 inline-flex flex-wrap rounded-lg border border-border/70 bg-card/80 p-1 shadow-sm">
      <button
        v-for="item in ['All', 'High', 'Mid', 'Low']"
        :key="item"
        class="rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:cursor-pointer md:px-6 md:py-3"
        :class="filter === item ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
        @click="filter = item as 'All' | NoteStatus"
      >
        {{ item }}
      </button>
    </div>

    <section v-if="notesQuery.isLoading.value" class="px-6 py-10 text-center">
      <Loader2 class="mx-auto h-10 w-10 animate-spin text-primary" />
    </section>

    <p v-else-if="notesQuery.isError.value" class="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      Failed to load notes. Please refresh and try again.
    </p>

    <section v-else-if="visibleNotes.length" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 ">
      <article
        v-for="note in visibleNotes"
        :key="note.id"
        role="button"
        tabindex="0"
        class="group rounded-xl border border-border/70 bg-card/86 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @click="openDetail(note.id)"
        @keyup.enter="openDetail(note.id)"
      >
        <div class="mb-3 flex items-start justify-between gap-3">
          <h3 class="line-clamp-1 text-lg font-bold">{{ note.title || 'Untitled' }}</h3>
          <span class="rounded-full border px-3 py-1 text-xs font-semibold" :class="statusTone(note.status)">
            {{ note.status }}
          </span>
        </div>

        <p class="line-clamp-3 text-sm leading-6 text-muted-foreground">{{ note.content || 'No content yet.' }}</p>

        <div class="mt-5 border-t border-border/60 pt-3 text-xs text-muted-foreground">Created {{ formatDate(note.created_at) }}</div>
      </article>
    </section>

    <section v-else class="rounded-lg border border-dashed border-border/70 bg-card/65 px-6 py-14 text-center">
      <h3 class="mb-2 text-xl text-primary font-semibold">No notes found</h3>
    </section>
  </main>
</template>
