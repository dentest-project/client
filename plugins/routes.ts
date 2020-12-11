import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $routes: Routes
  }
}

interface Routes {
  home(): string,
  login(): string,
  feature(slug: string): string,
  organization(slug: string): string,
  project(slug: string): string,
  register(): string
}

Vue.prototype.$routes = {
  home: (): string => '/',
  login: (): string => '/login',
  feature: (slug: string): string => `/feature/${slug}`,
  organization: (slug: string): string => `/organization/${slug}`,
  project: (slug: string): string => `/project/${slug}`,
  register: (): string => '/register'
} as Routes;
