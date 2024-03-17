import { defineNuxtPlugin } from 'nuxt/app'
import type { Feature, Organization, Path, Project } from '~/types'

export default defineNuxtPlugin(() => ({
  provide: {
    'routes': {
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
      organizationUsers: (organizationSlug: string) => `/organization/${organizationSlug}/users`,
      organizationIssueTrackers: (organization: Organization) => `/organization/${organization.slug}/issue-trackers`,
      projectUsers: function (project: Project): string {
        return project.organization
          ? `/organization/${project.organization.slug}/project/${project.slug}/users`
          : `/project/${project.slug}/users`
      },
      register: (): string => '/register',
      resetPassword: (): string => '/reset-password',
      updateProfile: (): string => '/update-profile'
    }
}}))
