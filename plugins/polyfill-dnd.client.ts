import { polyfill } from 'mobile-drag-drop'

export default defineNuxtPlugin(() => {
  polyfill({
    holdToDrag: 500,
  })
})
