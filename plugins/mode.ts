import { defineNuxtPlugin } from 'nuxt/app'
import { Mode } from '~/types'

interface Modes {
  view: Mode,
  edit: Mode
}

export default defineNuxtPlugin(() => ({
  provide: {
    'modes': (): Modes => ({
      view: Mode.View,
      edit: Mode.Edit
    })
  }
}))
