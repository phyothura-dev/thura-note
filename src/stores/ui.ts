import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'developer-note-theme'

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

export const useUiStore = defineStore('ui', () => {
  const theme = ref<ThemeMode>(getInitialTheme())

  function applyTheme(nextTheme: ThemeMode) {
    theme.value = nextTheme
    localStorage.setItem(THEME_KEY, nextTheme)

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
      return
    }

    document.documentElement.classList.remove('dark')
  }

  function toggleTheme() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    applyTheme,
    toggleTheme,
  }
})
