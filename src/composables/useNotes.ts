import { computed } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { archiveNoteApi, createNoteApi, deleteNoteApi, getNotesApi, updateNoteApi } from '@/services/notes'
import type { NotePayload } from '@/types/note'

const NOTES_QUERY_KEY = ['notes']

export function useNotes() {
  const queryClient = useQueryClient()

  const notesQuery = useQuery({
    queryKey: NOTES_QUERY_KEY,
    queryFn: getNotesApi,
  })

  const createMutation = useMutation({
    mutationFn: (payload: NotePayload) => createNoteApi(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: NotePayload }) => updateNoteApi(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteNoteApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
  })

  const archiveMutation = useMutation({
    mutationFn: (id: number) => archiveNoteApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY }),
  })

  return {
    notesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
    archiveMutation,
    notes: computed(() => notesQuery.data.value ?? []),
  }
}
