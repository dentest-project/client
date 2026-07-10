import type { KetalApi } from './api/ketal'

declare module 'vue-json-pretty'

declare module '#app' {
  interface NuxtApp {
    $ketal: KetalApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $ketal: KetalApi
  }
}

export {}
