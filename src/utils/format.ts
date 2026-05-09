export type DateInput = string | Date | undefined | null

function toValidDate(value: DateInput) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value: DateInput, fallback = 'Unknown date') {
  const date = toValidDate(value)
  if (!date) return fallback

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatDateTime(value: DateInput, fallback = 'Unknown') {
  const date = toValidDate(value)
  if (!date) return fallback

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
