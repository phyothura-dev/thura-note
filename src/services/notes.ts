import type { ApiSuccess } from '@/types/api'
import type { Note, NotePayload } from '@/types/note'
import { http } from './http'

export async function getNotesApi() {
  const { data } = await http.get<ApiSuccess<Note[]>>('/tasks/')
  return data.data
}

export async function createNoteApi(payload: NotePayload) {
  const { data } = await http.post<ApiSuccess<Note>>('/tasks/', payload)
  return data.data
}

export async function updateNoteApi(id: number, payload: NotePayload) {
  const { data } = await http.put<ApiSuccess<Note>>(`/tasks/${id}`, payload)
  return data.data
}

export async function deleteNoteApi(id: number) {
  await http.delete(`/tasks/${id}`)
}

export async function archiveNoteApi(id: number) {
  const { data } = await http.post<ApiSuccess<Note>>(`/tasks/${id}/archive`)
  return data.data
}
