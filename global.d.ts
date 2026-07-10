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

declare global {
  const API_URL: string | undefined
  const KETAL_URL: string
}

export {}
