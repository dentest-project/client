import { defineNuxtPlugin } from 'nuxt/app'
import {
  type BaseUser,
  type CreateFeature,
  type CreatePath,
  type CreateProject, type CreateStep, type CreateTag,
  type Feature,
  type Login,
  type LoginResponse,
  type Organization, OrganizationIssueTrackerConfigurationDetailed,
  type OrganizationList,
  OrganizationPermission,
  type OrganizationUser,
  type OrganizationUserList,
  type Path,
  type Project,
  type ProjectList,
  ProjectPermission,
  type ProjectUser,
  type ProjectUserList,
  type ProjectUserToken,
  type Register, type ResetPassword, type ResetPasswordRequest,
  type Step, type Tag,
  type UpdateFeature, type UpdateFeatureParentPath, type UpdateFeatureStatus, type UpdateMe,
  type UpdateOrganizationName,
  type UpdatePath,
  type UpdatePathParent,
  type UpdateProject,
  type UpdateStep,
  type User
} from '~/types'

interface QueryOptions {
  method: string,
  body?: any
}

const query = async (url: string, options: QueryOptions) => {
  const { token } = useAuthState()

  const result = await useFetch(`${API_URL}/${url}`, {
    ...options,
    headers: {
      Authorization: token.value
    }
  } as any)

  if (result.error.value) {
    throw result.error.value
  }

  return result.data.value
}

const get = async (url: string) => await query(url, { method: 'GET' })


const del = async (url: string) => await query(url, { method: 'DELETE' })

const post = async (url: string, body: any) => await query(url, { method: 'POST', body })


const put = async (url: string, body: any) => await query(url, { method: 'PUT', body })

export default defineNuxtPlugin(() => ({
  provide: {
    'api': {
      createFeature: async (feature: CreateFeature): Promise<Feature> => post('features', feature),
      createOrganization: async (organization: Organization): Promise<Organization> => post('organizations', organization),
      createOrganizationUser: async (organization: Organization, user: BaseUser): Promise<OrganizationUser> => post(`organizations/${organization.id}/users/${user.id}`, {}),
      createPath: async (path: CreatePath): Promise<Path> => post('paths', path),
      createProject: async (project: CreateProject): Promise<Project> => post('projects', project),
      createProjectUser: async (project: Project, user: BaseUser): Promise<ProjectUser> => post(`projects/${project.id}/users/${user.id}`, {}),
      createProjectUserToken: async (projectId: string, userId: string): Promise<ProjectUserToken> => put(`projects/${projectId}/users/${userId}/token`, {}),
      createStep: async (step: CreateStep): Promise<Step> => post('steps', step),
      createTag: async (projectId: string, tag: CreateTag): Promise<Tag> => post(`projects/${projectId}/tags`, tag),
      deleteFeature: async (id: string): Promise<void> => del(`features/${id}`),
      deleteMe: async (): Promise<void> => del('me'),
      deleteOrganization: async (id: string): Promise<void> => del(`organizations/${id}`),
      deleteOrganizationUser: async (organizationId: string, userId: string): Promise<void> => del(`organizations/${organizationId}/users/${userId}`),
      deleteOrganizationIssueTrackerConfiguration: async (organizationIssueTrackerConfigurationId: string): Promise<void> => del(`organization-issue-tracker-configurations/${organizationIssueTrackerConfigurationId}`),
      deletePath: async (id: string): Promise<void> => del(`paths/${id}`),
      deleteProject: async (id: string): Promise<void> => del(`projects/${id}`),
      deleteProjectUser: async (projectId: string, userId: string): Promise<void> => del(`projects/${projectId}/users/${userId}`),
      deleteStep: async (id: number): Promise<void> => del(`steps/${id}`),
      getFeature: async (pathId: string, featureSlug: string): Promise<Feature> => get(`paths/${pathId}/features/${featureSlug}`),
      getOrganizations: async (): Promise<OrganizationList> => get(`organizations`),
      getOrganization: async (slug: string): Promise<Organization> => get(`organizations/${slug}`),
      getOrganizationProjects: async (id: string): Promise<ProjectList> => get(`organizations/${id}/projects`),
      getOrganizationIssueTrackerConfigurations: async (organizationSlug: string): Promise<OrganizationIssueTrackerConfigurationDetailed[]> => get(`organizations/${organizationSlug}/issue-tracker-configurations`),
      getOrganizationUsers: async (organizationSlug: string): Promise<OrganizationUserList> => get(`organizations/${organizationSlug}/users`),
      getPath: async (id: string): Promise<Path> => get(`paths/${id}`),
      getPathRoot: async (id: string): Promise<Path> => get(`paths/${id}/root`),
      getProjectSteps: async (id: string): Promise<Array<Step>> => get(`projects/${id}/steps`),
      getProject: async (projectSlug: string, organizationSlug?: string): Promise<Project> => {
        return organizationSlug ? get(`organizations/${organizationSlug}/projects/${projectSlug}`) : get(`projects/${projectSlug}`);
      },
      getProjects: async (): Promise<ProjectList> => get(`projects`),
      getProjectUsers: async (projectSlug: string, organizationSlug?: string): Promise<ProjectUserList> => {
        return organizationSlug ? get(`organizations/${organizationSlug}/projects/${projectSlug}/users`) : get(`projects/${projectSlug}/users`);
      },
      getStepPartChoices: async (stepPartId: number): Promise<Array<string>> => get(`step-parts/${stepPartId}/choices`),
      getTags: async (projectId: string): Promise<Array<Tag>> => get(`projects/${projectId}/tags`),
      getProjectUserToken: async (projectId: string, userId: string): Promise<ProjectUserToken> => get(`projects/${projectId}/users/${userId}/token`),
      login: async (user: Login): Promise<LoginResponse> => post(`login`, user),
      register: async (user: Register): Promise<User> => post(`register`, user),
      resetPassword: (resetPassword: ResetPassword): Promise<void> => post('reset-password', resetPassword),
      resetPasswordRequest: (resetPasswordRequest: ResetPasswordRequest): Promise<void> => post('reset-password-request', resetPasswordRequest),
      saveFeature: async (feature: UpdateFeature): Promise<Feature> => {
        const toSave = {
          ...feature,
          scenarios: feature.scenarios.map((s, sId) => ({
            ...s,
            steps: s.steps.map((st, stId) => ({
              ...st,
              priority: stId
            })),
            priority: sId,
          }))
        }
        const feat = await put('features', toSave)

        return get(`paths/${feat.path.id}/features/${feat.slug}`)
      },
      saveOrganizationIssueTrackerConfiguration: async (organizationIssueTrackerConfiguration: OrganizationIssueTrackerConfigurationDetailed): Promise<OrganizationIssueTrackerConfigurationDetailed> => put('organization-issue-tracker-configurations', organizationIssueTrackerConfiguration),
      searchUsers: async (query: string, organizationSlug?: string | null): Promise<Array<BaseUser>> => get(`users?q=${query}${organizationSlug ? `&organization=${organizationSlug}` : ''}`),
      updateFeaturePath: async (featurePath: UpdateFeatureParentPath): Promise<Path> => put('features', { id: featurePath.id, path: { id: featurePath.newParentId } }),
      updateFeatureStatus: async (featureStatus: UpdateFeatureStatus): Promise<Path> => put('features', { id: featureStatus.id, status: featureStatus.status }),
      updateMe: async (me: UpdateMe): Promise<void> => put('me', me),
      updateOrganization: async (organization: UpdateOrganizationName): Promise<Organization> => put(`organizations`, organization),
      updateOrganizationUser: async (organizationId: string, userId: string, permissions: Array<OrganizationPermission>): Promise<OrganizationUser> => put(`organizations/${organizationId}/users/${userId}`, { permissions }),
      updatePath: async (path: UpdatePath): Promise<Path> => put('paths', path),
      updatePathParent: async (path: UpdatePathParent): Promise<Path> => put('paths', { id: path.id, parent: { id: path.newParentId } }),
      updateProject: async (project: UpdateProject): Promise<Project> => put('projects', project),
      updateProjectUser: async (projectId: string, userId: string, permissions: Array<ProjectPermission>): Promise<ProjectUser> => put(`projects/${projectId}/users/${userId}`, { permissions }),
      updateStep: async (step: UpdateStep): Promise<Step> => put('steps', step),
      updateTag: async (projectId: string, tag: Tag): Promise<Tag> => put(`projects/${projectId}/tags`, tag),
    }
}}))
