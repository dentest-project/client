import { defineNuxtPlugin } from 'nuxt/app'
import { ketalApi } from '~/api/ketal'

export default defineNuxtPlugin(() => ({
  provide: {
    ketal: ketalApi
  }
}))
