import { defineNuxtPlugin } from 'nuxt/app'
import axios from 'axios'
import {
  type BaseUser,
  type CreateFeature,
  type CreatePath,
  type CreateProject, type CreateStep, type CreateTag,
  type Feature, Issue,
  type Login,
  type LoginResponse,
  type Organization, OrganizationIssueTrackerConfigurationDetailed, OrganizationIssueTrackerConfigurationEmbedded,
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
  type ProjectUserToken, PulledFeature,
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

  try {
    const result = await axios.request({
      baseURL: API_URL,
      url,
      method: options.method ?? 'GET',
      data: options.body,
      headers: {
        Authorization: token.value
      },
      ...options
    })

    return result.data
  } catch (error) {
    throw {
      ...error,
      statusCode: error.status
    }
  }
}

const get = async (url: string, options: QueryOptions) => await query(url, { ...options, method: 'GET' })


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
      deleteStep: async (id: string): Promise<void> => del(`steps/${id}`),
      getFeature: async (pathId: string, featureSlug: string): Promise<Feature> => get(`paths/${pathId}/features/${featureSlug}`),
      getFeatureById: async (featureId: string): Promise<Feature> => get(`features/${featureId}`),
      getFeatureIssueTrackerConfigurations: async (pathId: string, featureSlug: string): Promise<OrganizationIssueTrackerConfigurationEmbedded[]> => get(`paths/${pathId}/features/${featureSlug}/issue-tracker-configurations`),
      getOrganizations: async (): Promise<OrganizationList> => get(`organizations`),
      getOrganization: async (slug: string): Promise<Organization> => get(`organizations/${slug}`),
      getOrganizationProjects: async (id: string): Promise<ProjectList> => get(`organizations/${id}/projects`),
      getOrganizationIssueTrackerConfigurations: async (organizationSlug: string): Promise<OrganizationIssueTrackerConfigurationDetailed[]> => get(`organizations/${organizationSlug}/issue-tracker-configurations`),
      getOrganizationUsers: async (organizationSlug: string): Promise<OrganizationUserList> => get(`organizations/${organizationSlug}/users`),
      getPath: async (id: string): Promise<Path> => get(`paths/${id}`),
      getPathRoot: async (id: string): Promise<Path> => get(`paths/${id}/root`),
      getProjectFeaturesWithBackground: async (id: string): Promise<Pick<Feature, 'id' | 'title'>[]> => get(`projects/${id}/features-with-backgrounds`),
      getProjectSteps: async (id: string): Promise<Array<Step>> => get(`projects/${id}/steps`),
      getProject: async (projectSlug: string, organizationSlug?: string): Promise<Project> => {
        return organizationSlug ? get(`organizations/${organizationSlug}/projects/${projectSlug}`) : get(`projects/${projectSlug}`);
      },
      getProjects: async (): Promise<ProjectList> => get(`projects`),
      getProjectUsers: async (projectSlug: string, organizationSlug?: string): Promise<ProjectUserList> => {
        return organizationSlug ? get(`organizations/${organizationSlug}/projects/${projectSlug}/users`) : get(`projects/${projectSlug}/users`);
      },
      getTags: async (projectId: string): Promise<Array<Tag>> => get(`projects/${projectId}/tags`),
      getProjectUserToken: async (projectId: string, userId: string): Promise<ProjectUserToken> => get(`projects/${projectId}/users/${userId}/token`),
      login: async (user: Login): Promise<LoginResponse> => post(`login`, user),
      pullFeatures: async (pullToken: string): Promise<PulledFeature[]> => get('pull/features?inlineParameterWrapper=%22&withId=1', { headers: { Authorization: `Pull ${pullToken}` } }),
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
      syncIssue: async (issue: Issue): Promise<void> => post(`issues/${issue.id ?? ''}/sync`, {}),
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
    }
}}))
