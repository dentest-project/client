import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $routes: Routes
  }
}

interface Routes {
  home(): string,
  project(slug: string): string,
  feature(slug: string): string
}

Vue.prototype.$routes = {
  home: (): string => '/',
  project: (slug: string): string => `/project/${slug}`,
  feature: (slug: string): string => `/feature/${slug}`
} as Routes;
