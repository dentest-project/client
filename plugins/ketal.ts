import { defineNuxtPlugin } from 'nuxt/app'
import { ketalApi } from '~/api/ketal'
import { setKetalBaseUrl } from '~/api/ketal/jsonRpc'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  setKetalBaseUrl(config.public.ketalUrl as string)

  return {
    provide: {
      ketal: ketalApi
    }
  }
})
