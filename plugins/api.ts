import { defineNuxtPlugin } from 'nuxt/app'
import axios from 'axios'
import type {
  BaseUser,
  CreateDomainEntityRequest,
  CreateDomainFixtureRequest,
  CreateFeature,
  CreatePath,
  CreateProject,
  CreateStep,
  CreateTag,
  DomainEntity,
  DomainEntityList,
  DomainFixture,
  DomainFixtureList,
  Feature,
  Issue,
  Organization,
  OrganizationIssueTrackerConfigurationDetailed,
  OrganizationIssueTrackerConfigurationEmbedded,
  OrganizationList,
  OrganizationPermission,
  OrganizationUser,
  OrganizationUserList,
  Path,
  Project,
  ProjectList,
  ProjectPermission,
  ProjectUser,
  ProjectUserList,
  ProjectUserToken,
  PulledFeature,
  Step,
  Tag,
  UpdateDomainEntityRequest,
  UpdateDomainFixtureRequest,
  UpdateFeature,
  UpdateFeatureParentPath,
  UpdateFeatureStatus,
  UpdateOrganizationName,
  UpdatePath,
  UpdatePathParent,
  UpdateProject,
  UpdateStep,
} from '~/types'

interface QueryOptions {
  method: string,
  body?: any
}

let apiBaseUrl = ''

const setApiBaseUrl = (value: string) => {
  apiBaseUrl = value
}

const query = async (url: string, options: QueryOptions) => {
  const { token } = useAuthState()

  try {
    const result = await axios.request({
      baseURL: apiBaseUrl,
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

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  setApiBaseUrl(config.public.apiUrl as string)

  return {
    provide: {
      'api': {
      createDomainEntity: async (domainEntity: CreateDomainEntityRequest): Promise<DomainEntity> =>
        post('domain-entities', domainEntity),
      createDomainFixture: async (projectId: string, domainFixture: CreateDomainFixtureRequest): Promise<DomainFixture> =>
        post(`projects/${projectId}/fixtures`, domainFixture),
      createFeature: async (feature: CreateFeature): Promise<Feature> => post('features', feature),
      createOrganizationUser: async (organization: Organization, user: BaseUser): Promise<OrganizationUser> => post(`organizations/${organization.id}/users/${user.id}`, {}),
      createPath: async (path: CreatePath): Promise<Path> => post('paths', path),
      createProject: async (project: CreateProject): Promise<Project> => post('projects', project),
      createProjectUser: async (project: Project, user: BaseUser): Promise<ProjectUser> => post(`projects/${project.id}/users/${user.id}`, {}),
      createProjectUserToken: async (projectId: string, userId: string): Promise<ProjectUserToken> => put(`projects/${projectId}/users/${userId}/token`, {}),
      createStep: async (step: CreateStep): Promise<Step> => post('steps', step),
      createTag: async (projectId: string, tag: CreateTag): Promise<Tag> => post(`projects/${projectId}/tags`, tag),
      deleteDomainEntity: async (id: string): Promise<void> => del(`domain-entities/${id}`),
      deleteDomainFixture: async (id: string): Promise<void> => del(`fixtures/${id}`),
      deleteFeature: async (id: string): Promise<void> => del(`features/${id}`),
      deleteMe: async (): Promise<void> => del('me'),
      deleteOrganization: async (id: string): Promise<void> => del(`organizations/${id}`),
      deleteOrganizationUser: async (organizationId: string, userId: string): Promise<void> => del(`organizations/${organizationId}/users/${userId}`),
      deleteOrganizationIssueTrackerConfiguration: async (organizationIssueTrackerConfigurationId: string): Promise<void> => del(`organization-issue-tracker-configurations/${organizationIssueTrackerConfigurationId}`),
      deletePath: async (id: string): Promise<void> => del(`paths/${id}`),
      deleteProject: async (id: string): Promise<void> => del(`projects/${id}`),
      deleteProjectUser: async (projectId: string, userId: string): Promise<void> => del(`projects/${projectId}/users/${userId}`),
      deleteStep: async (id: string): Promise<void> => del(`steps/${id}`),
      getDomainFixtureById: async (fixtureId: string): Promise<DomainFixture> => get(`fixtures/${fixtureId}`),
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
      getProjectDomainModel: async (projectId: string): Promise<DomainEntityList> => get(`projects/${projectId}/domain-model`),
      getProjectFixtures: async (projectId: string): Promise<DomainFixtureList> => get(`projects/${projectId}/fixtures`),
      getProjects: async (): Promise<ProjectList> => get(`projects`),
      getProjectUsers: async (projectSlug: string, organizationSlug?: string): Promise<ProjectUserList> => {
        return organizationSlug ? get(`organizations/${organizationSlug}/projects/${projectSlug}/users`) : get(`projects/${projectSlug}/users`);
      },
      getTags: async (projectId: string): Promise<Array<Tag>> => get(`projects/${projectId}/tags`),
      getProjectUserToken: async (projectId: string, userId: string): Promise<ProjectUserToken> => get(`projects/${projectId}/users/${userId}/token`),
      pullFeatures: async (pullToken: string): Promise<PulledFeature[]> => get('pull/features?inlineParameterWrapper=%22&withId=1', { headers: { Authorization: `Pull ${pullToken}` } }),
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
      updateOrganization: async (organization: UpdateOrganizationName): Promise<Organization> => put(`organizations`, organization),
      updateOrganizationUser: async (organizationId: string, userId: string, permissions: Array<OrganizationPermission>): Promise<OrganizationUser> => put(`organizations/${organizationId}/users/${userId}`, { permissions }),
      updatePath: async (path: UpdatePath): Promise<Path> => put('paths', path),
      updatePathParent: async (path: UpdatePathParent): Promise<Path> => put('paths', { id: path.id, parent: { id: path.newParentId } }),
      updateDomainEntity: async (domainEntity: UpdateDomainEntityRequest): Promise<DomainEntity> =>
        put('domain-entities', domainEntity),
      updateDomainFixture: async (projectId: string, domainFixture: UpdateDomainFixtureRequest): Promise<DomainFixture> =>
        put(`projects/${projectId}/fixtures`, domainFixture),
      updateProject: async (project: UpdateProject): Promise<Project> => put('projects', project),
      updateProjectUser: async (projectId: string, userId: string, permissions: Array<ProjectPermission>): Promise<ProjectUser> => put(`projects/${projectId}/users/${userId}`, { permissions }),
      updateStep: async (step: UpdateStep): Promise<Step> => put('steps', step),
      }
    }
  }
})
