import Vue from 'vue'
import { Feature, Path, Project, ProjectRootPath } from '~/types';

declare module 'vue/types/vue' {
  interface Vue {
    $routes: Routes
  }
}

interface Routes {
  home(): string,
  login(): string,
  feature(path: Path, feature: Feature): string,
  organization(slug: string): string,
  path(path: Path): string,
  project(path: ProjectRootPath): string,
  register(): string
}

Vue.prototype.$routes = {
  home: (): string => '/',
  login: (): string => '/login',
  feature: (path: Path, feature: Feature): string => {
    return feature.rootProject?.organization
      ? `/organization/${feature.rootProject.organization.slug}/project/${feature.rootProject.slug}/path/${path.slug}/${path.id}/feature/${feature.slug}`
      : `/project/${feature.rootProject?.slug}/path/${path.slug}/${path.id}/feature/${feature.slug}`
  },
  organization: (slug: string): string => `/organization/${slug}`,
  path: (path: Path): string => {
    return path.rootProject?.organization
      ? `/organization/${path.rootProject.organization.slug}/project/${path.rootProject.slug}/path/${path.slug}/${path.id}`
      : `/project/${path.rootProject?.slug}/path/${path.slug}/${path.id}`
  },
  project: (project: Project): string => {
    return project.organization
      ? `/organization/${project.organization.slug}/project/${project.slug}/path/${project.rootPath.slug}/${project.rootPath.id}`
      : `/project/${project.slug}/path/${project.rootPath.slug}/${project.rootPath.id}`
  },
  register: (): string => '/register'
} as Routes;
