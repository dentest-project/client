import { DragHandle, SlickList, SlickItem } from 'vue-slicksort';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('DragHandle', DragHandle)
  nuxtApp.vueApp.component('SlickList', SlickList)
  nuxtApp.vueApp.component('SlickItem', SlickItem)
})
