export type NoteStatus = 'High' | 'Mid' | 'Low'

export interface Note {
  id: number
  title: string
  content: string
  status: NoteStatus
  created_at?: string
  updated_at?: string
}

export interface NotePayload {
  title: string
  content: string
  status: NoteStatus
}
