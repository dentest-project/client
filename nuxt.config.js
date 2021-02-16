export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Entest',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@assets/css/materialdesignicons.min.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/api.ts',
    '~/plugins/colors.ts',
    '~/plugins/mode.ts',
    '~/plugins/routes.ts'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.BASE_URL
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  },

  router: {
    middleware: ['auth'],
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/project/:project_slug/path/:path_slug/:path_id',
        component: resolve(__dirname, 'pages/organization/_organization_slug/project/_project_slug/path/_path_slug/_path_id/index.vue')
      });
      routes.push({
        path: '/project/:project_slug/path/:path_slug/:path_id/feature/:feature_slug',
        component: resolve(__dirname, 'pages/organization/_organization_slug/project/_project_slug/path/_path_slug/_path_id/feature/_feature_slug/index.vue')
      });
    }
  },

  auth: {
    scopeKey: 'roles',
    strategies: {
      local: {
        token: {
          property: 'token',
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: 'data.token' },
          logout: false,
          user: { url: 'me', method: 'get', propertyName: 'data.user' }
        }
      }
    },
    redirect: {
      logout: false,
    }
  },

  vuetify: {
    icons: {
      iconfont: 'mdi'
    }
  }
}
