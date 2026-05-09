import type { NoteStatus } from '@/types/note'

export function statusTone(status: NoteStatus) {
  if (status === 'High') return 'border-rose-400/45 bg-rose-500/10 text-rose-300'
  if (status === 'Mid') return 'border-amber-400/45 bg-amber-500/10 text-amber-300'
  return 'border-emerald-400/45 bg-emerald-500/10 text-emerald-300'
}
