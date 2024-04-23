// https://nuxt.com/docs/api/configuration/nuxt-config
import { Session } from './types'

// @ts-ignore
export default defineNuxtConfig({
    /*
    ** Global CSS
    */
    css: [
      // 'vue-json-pretty/lib/styles.css'
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
      '~/plugins/api.ts',
      '~/plugins/colors.ts',
      '~/plugins/mode.ts',
      '~/plugins/routes.ts',
      '~/plugins/vue-json-pretty.ts',
    ],
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [],
    /*
    ** Nuxt.js modules
    */
    modules: [
      '@sidebase/nuxt-auth',
      '@element-plus/nuxt',
      '@pinia/nuxt',
      '@pinia-plugin-persistedstate/nuxt',
      '@vueuse/nuxt',
    ],
    /*
    ** Build configuration
    */
    build: {
        vendor: [
            'vue-slider-component'
        ]
    },
    auth: {
      baseURL: `${process.env.API_URL}/`,
      globalAppMiddleware: true,
      provider: {
        type: 'local',
        endpoints: {
          signIn: { path: '/login', method: 'post' },
          signOut: { path: '/logout', method: 'post' },
          signUp: { path: '/register', method: 'post' },
          getSession: { path: '/me', method: 'get' }
        },
        sessionDataType: Session,
        token: {
          maxAgeInSeconds: 31557600
        }
      },
      addDefaultCallbackUrl: '/'
    },
    loaders: {
        vue: {
            compilerOptions: {
                preserveWhiteSpace: false,
            }
        }
    },
    vite: {
      define: {
        API_URL: JSON.stringify(process.env.API_URL)
      }
    }
})
