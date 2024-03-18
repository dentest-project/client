import { defineStore } from 'pinia';

interface State {
  theme: 'dark' | 'light'
}

export const useThemeStore = defineStore('theme', {
  state: (): State => ({
    theme: 'dark'
  }),
  actions: {
    setTheme(theme: 'dark' | 'light') {
      this.theme = theme
    },

    getTheme() {
      return this.theme
    }
  },
  persist: true
})
