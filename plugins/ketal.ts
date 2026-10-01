import { defineNuxtPlugin } from 'nuxt/app'
import { createKetalApi } from '~/api/ketal'
import { setKetalBaseUrl } from '~/api/ketal/jsonRpc'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { token } = useAuthState()

  setKetalBaseUrl(config.public.ketalUrl as string)

  return {
    provide: {
      ketal: createKetalApi(() => token.value),
    },
  }
})
