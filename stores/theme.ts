import { defineStore } from 'pinia'
import { Theme } from '~~/constants/types'
import { LOCAL_STORAGE_THEME_KEY } from '~~/constants/settings'

export const useTheme = defineStore({
  id: 'theme',

  state: () => ({
    theme: '',
  }),

  getters: {
    darkMode: (state) => state.theme === 'dark',
  },

  actions: {
    setTheme(newTheme: Theme) {
      localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme)
      this.theme = newTheme
    },
    toggleTheme() {
      const themeDarkMode = this.darkMode
      if (themeDarkMode === true) {
        this.setTheme('light')
      } else {
        this.setTheme('dark')
      }
    },
  },
})
