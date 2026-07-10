// https://nuxt.com/docs/api/configuration/nuxt-config
import { Session } from './types'

// @ts-ignore
const hmrHost = process.env.HMR_HOST
const hmrPort = process.env.HMR_PORT ? Number(process.env.HMR_PORT) : undefined
const hmrClientPort = process.env.HMR_CLIENT_PORT ? Number(process.env.HMR_CLIENT_PORT) : undefined
const hmrProtocol = process.env.HMR_PROTOCOL
const apiUrl = process.env.NUXT_PUBLIC_API_URL || process.env.API_URL || 'http://api.dentest.local'
const ketalUrl = process.env.NUXT_PUBLIC_KETAL_URL || process.env.KETAL_URL || 'http://ketal.dentest.local/rpc'
const hmrConfig = hmrHost || hmrPort || hmrClientPort || hmrProtocol ? {
  ...(hmrHost ? { host: hmrHost } : {}),
  ...(hmrPort ? { port: hmrPort } : {}),
  ...(hmrClientPort ? { clientPort: hmrClientPort } : {}),
  ...(hmrProtocol ? { protocol: hmrProtocol } : {}),
} : undefined

const projectCompatibilityRoutes = [
  {
    name: 'project-projectSlug-users',
    path: '/project/:projectSlug/users',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/users/index.vue',
  },
  {
    name: 'project-projectSlug-domain-model',
    path: '/project/:projectSlug/domain-model',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/index.vue',
  },
  {
    name: 'project-projectSlug-domain-model-entity-new',
    path: '/project/:projectSlug/domain-model/entity/new',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/entity/new.vue',
  },
  {
    name: 'project-projectSlug-domain-model-entities-new',
    path: '/project/:projectSlug/domain-model/entities/new',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/entity/new.vue',
  },
  {
    name: 'organization-organizationSlug-project-projectSlug-domain-model-entities-new',
    path: '/organization/:organizationSlug/project/:projectSlug/domain-model/entities/new',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/entity/new.vue',
  },
  {
    name: 'project-projectSlug-domain-model-entity-entityId',
    path: '/project/:projectSlug/domain-model/entity/:entityId',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/entity/[entityId].vue',
  },
  {
    name: 'project-projectSlug-domain-model-entities-entityId',
    path: '/project/:projectSlug/domain-model/entities/:entityId',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/entity/[entityId].vue',
  },
  {
    name: 'organization-organizationSlug-project-projectSlug-domain-model-entities-entityId',
    path: '/organization/:organizationSlug/project/:projectSlug/domain-model/entities/:entityId',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/entity/[entityId].vue',
  },
  {
    name: 'project-projectSlug-domain-model-fixtures',
    path: '/project/:projectSlug/domain-model/fixtures',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/fixtures/index.vue',
  },
  {
    name: 'project-projectSlug-domain-model-fixture-new',
    path: '/project/:projectSlug/domain-model/fixture/new',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/fixtures/new.vue',
  },
  {
    name: 'project-projectSlug-domain-model-fixtures-new',
    path: '/project/:projectSlug/domain-model/fixtures/new',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/fixtures/new.vue',
  },
  {
    name: 'organization-organizationSlug-project-projectSlug-domain-model-fixture-new',
    path: '/organization/:organizationSlug/project/:projectSlug/domain-model/fixture/new',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/fixtures/new.vue',
  },
  {
    name: 'project-projectSlug-domain-model-fixtures-fixtureId',
    path: '/project/:projectSlug/domain-model/fixtures/:fixtureId',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/domain-model/fixtures/[fixtureId].vue',
  },
  {
    name: 'project-projectSlug-path-pathSlug-pathId',
    path: '/project/:projectSlug/path/:pathSlug/:pathId',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/path/[pathSlug]/[pathId]/index.vue',
  },
  {
    name: 'project-projectSlug-path-pathSlug-pathId-feature-featureSlug',
    path: '/project/:projectSlug/path/:pathSlug/:pathId/feature/:featureSlug',
    file: '~/pages/organization/[organizationSlug]/project/[projectSlug]/path/[pathSlug]/[pathId]/feature/[featureSlug]/index.vue',
  },
]

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
      '~/plugins/draggable.ts',
      '~/plugins/ketal.ts',
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
      'pinia-plugin-persistedstate/nuxt',
      '@vueuse/nuxt',
    ],
    runtimeConfig: {
      public: {
        apiUrl,
        ketalUrl,
      },
    },
    hooks: {
      'pages:extend'(pages) {
        pages.push(...projectCompatibilityRoutes)
      },
    },
    /*
    ** Build configuration
    */
    build: {
        vendor: [
            'vue-slider-component'
        ]
    },
    auth: {
      baseURL: `${apiUrl}/`,
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
      server: {
        watch: {
          usePolling: true,
          interval: 100,
        },
        ...(hmrConfig ? { hmr: hmrConfig } : {}),
      }
    },
})
