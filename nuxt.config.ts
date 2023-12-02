// https://nuxt.com/docs/api/configuration/nuxt-config
import { Session } from './types'

// @ts-ignore
export default defineNuxtConfig({
    /*
    ** Global CSS
    */
    css: [
      'vue-json-pretty/lib/styles.css'
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
      // { src: '~/plugins/polyfill-dnd.js', mode: 'client' }
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
    hooks: {
      // replace with definePageMeta on given pages: https://nuxt.com/docs/guide/directory-structure/pages#special-metadata
      // 'pages:extend' (routes) {
      //   routes.push({
      //     path: '/project/:project_slug/path/:path_slug/:path_id',
      //     component: resolve(__dirname, 'pages/organization/_organization_slug/project/_project_slug/path/_path_slug/_path_id/index.vue')
      //   });
      //   routes.push({
      //     path: '/project/:project_slug/path/:path_slug/:path_id/feature/:feature_slug',
      //     component: resolve(__dirname, 'pages/organization/_organization_slug/project/_project_slug/path/_path_slug/_path_id/feature/_feature_slug/index.vue')
      //   });
      //   routes.push({
      //     path: '/project/:project_slug/users',
      //     component: resolve(__dirname, 'pages/organization/_organization_slug/project/_project_slug/users/index.vue')
      //   });
      // }
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
        sessionDataType: Session
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
