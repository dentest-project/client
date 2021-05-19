import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import {
  BaseUser,
  CreateFeature,
  CreatePath,
  CreateProject,
  Feature,
  Login,
  LoginResponse,
  Organization,
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
  Register,
  Step,
  UpdateFeature, UpdateFeatureParentPath,
  UpdateFeaturePath,
  UpdateOrganizationName,
  UpdatePath,
  UpdatePathParent,
  UpdateProject,
  UpdateStep,
  User
} from '~/types';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: NuxtAxiosInstance,
    $api: Api
  }
}

declare module '@nuxt/types' {
  interface Context {
    $axios: NuxtAxiosInstance,
    $api: Api
  }
}

interface Api {
  createFeature(feature: CreateFeature, axios?: NuxtAxiosInstance): Promise<Feature>,
  createOrganization(organization: Organization, axios?: NuxtAxiosInstance): Promise<Organization>,
  createOrganizationUser(organization: Organization, user: BaseUser, axios?: NuxtAxiosInstance): Promise<OrganizationUser>,
  createPath(path: CreatePath, axios?: NuxtAxiosInstance): Promise<Path>,
  createProject(project: CreateProject, axios?: NuxtAxiosInstance): Promise<Project>,
  createProjectUser(project: Project, user: BaseUser, axios?: NuxtAxiosInstance): Promise<ProjectUser>,
  createProjectUserToken(projectId: string, userId: string, axios?: NuxtAxiosInstance): Promise<ProjectUserToken>,
  createStep(step: Step, axios?: NuxtAxiosInstance): Promise<Step>,
  deleteFeature(id:string, axios?: NuxtAxiosInstance): Promise<void>,
  deleteOrganization(id: string, axios?: NuxtAxiosInstance): Promise<void>,
  deleteOrganizationUser(organizationId: string, userId: string, axios?: NuxtAxiosInstance): Promise<void>,
  deletePath(id:string, axios?: NuxtAxiosInstance): Promise<void>,
  deleteProject(id: string, axios?: NuxtAxiosInstance): Promise<void>,
  deleteProjectUser(projectId: string, userId: string, axios?: NuxtAxiosInstance): Promise<void>,
  getFeature(pathId: string, featureSlug: string, axios?: NuxtAxiosInstance): Promise<Feature>,
  getOrganizations(axios?: NuxtAxiosInstance): Promise<OrganizationList>,
  getOrganization(slug: string, axios?: NuxtAxiosInstance): Promise<Organization>,
  getOrganizationProjects(id: string, axios?: NuxtAxiosInstance): Promise<ProjectList>,
  getOrganizationUsers(organizationSlug?: string, axios?: NuxtAxiosInstance): Promise<OrganizationUserList>,
  getPath(id: string, axios?: NuxtAxiosInstance): Promise<Path>,
  getPathRoot(id: string, axios?: NuxtAxiosInstance): Promise<Path>,
  getProjectSteps(id: string, axios?: NuxtAxiosInstance): Promise<Array<Step>>,
  getProject(projectSlug: string, organizationSlug?: string, axios?: NuxtAxiosInstance): Promise<Project>,
  getProjects(axios?: NuxtAxiosInstance): Promise<ProjectList>,
  getProjectUsers(projectSlug: string, organizationSlug?: string, axios?: NuxtAxiosInstance): Promise<ProjectUserList>,
  getProjectUserToken(projectId: string, userId: string, axios?: NuxtAxiosInstance): Promise<ProjectUserToken>,
  login(user: Login, axios?: NuxtAxiosInstance): Promise<LoginResponse>,
  register(user: Register, axios?: NuxtAxiosInstance): Promise<User>,
  saveFeature(feature: UpdateFeature, axios?: NuxtAxiosInstance): Promise<Feature>,
  searchUsers(query: string, organizationSlug?: string | null, axios?: NuxtAxiosInstance): Promise<Array<BaseUser>>,
  updateFeaturePath(featurePath: UpdateFeatureParentPath, axios?: NuxtAxiosInstance): Promise<Path>,
  updateOrganization(organization: UpdateOrganizationName, axios?: NuxtAxiosInstance): Promise<Organization>,
  updateOrganizationUser(organizationId: string, userId: string, permissions: Array<OrganizationPermission>, axios?: NuxtAxiosInstance): Promise<OrganizationUser>
  updatePath(path: UpdatePath, axios?: NuxtAxiosInstance): Promise<Path>,
  updatePathParent(path: UpdatePathParent, axios?: NuxtAxiosInstance): Promise<Path>,
  updateProject(project: UpdateProject, axios?: NuxtAxiosInstance): Promise<Project>,
  updateProjectUser(projectId: string, userId: string, permissions: Array<ProjectPermission>, axios?: NuxtAxiosInstance): Promise<ProjectUser>,
  updateStep(step: UpdateStep, axios?: NuxtAxiosInstance): Promise<Step>
}

const Api = (context: any) => {
  const del = (url: string, axios?: NuxtAxiosInstance) => {
    const a = typeof axios !== 'undefined' ? axios : context.$axios;

    return a.$delete(`${a.defaults.baseURL}/${url}`);
  }

  const get = (url: string, axios?: NuxtAxiosInstance) => {
    const a = typeof axios !== 'undefined' ? axios : context.$axios;

    return a.$get(`${a.defaults.baseURL}/${url}`);
  }

  const post = (url: string, body: any, axios?: NuxtAxiosInstance) => {
    const a = typeof axios !== 'undefined' ? axios : context.$axios;

    return a.$post(`${a.defaults.baseURL}/${url}`, body);
  }

  const put = (url: string, body: any, axios?: NuxtAxiosInstance) => {
    const a = typeof axios !== 'undefined' ? axios : context.$axios;

    return a.$put(`${a.defaults.baseURL}/${url}`, body);
  }

  context.$api = {
    createFeature: async (feature: CreateFeature, axios?: NuxtAxiosInstance): Promise<Feature> => post('features', feature, axios),
    createOrganization: async (organization: Organization, axios?: NuxtAxiosInstance): Promise<Organization> => post('organizations', organization, axios),
    createOrganizationUser: async (organization: Organization, user: BaseUser, axios?: NuxtAxiosInstance): Promise<OrganizationUser> => post(`organizations/${organization.id}/users/${user.id}`, {}, axios),
    createPath: async (path: CreatePath, axios?: NuxtAxiosInstance): Promise<Path> => post('paths', path, axios),
    createProject: async (project: CreateProject, axios?: NuxtAxiosInstance): Promise<Project> => post('projects', project, axios),
    createProjectUser: async (project: Project, user: BaseUser, axios?: NuxtAxiosInstance): Promise<ProjectUser> => post(`projects/${project.id}/users/${user.id}`, {}, axios),
    createProjectUserToken: async (projectId: string, userId: string, axios?: NuxtAxiosInstance): Promise<ProjectUserToken> => put(`projects/${projectId}/users/${userId}/token`, {}, axios),
    createStep: async (step: Step, axios?: NuxtAxiosInstance): Promise<Step> => post('steps', step, axios),
    deleteFeature: async (id: string, axios?: NuxtAxiosInstance): Promise<void> => del(`features/${id}`, axios),
    deleteOrganization: async (id: string, axios?: NuxtAxiosInstance): Promise<void> => del(`organizations/${id}`, axios),
    deleteOrganizationUser: async (organizationId: string, userId: string, axios?: NuxtAxiosInstance): Promise<void> => del(`organizations/${organizationId}/users/${userId}`, axios),
    deletePath: async (id: string, axios?: NuxtAxiosInstance): Promise<void> => del(`paths/${id}`, axios),
    deleteProject: async (id: string, axios?: NuxtAxiosInstance): Promise<void> => del(`projects/${id}`, axios),
    deleteProjectUser: async (projectId: string, userId: string, axios?: NuxtAxiosInstance): Promise<void> => del(`projects/${projectId}/users/${userId}`, axios),
    getFeature: async (pathId: string, featureSlug: string, axios?: NuxtAxiosInstance): Promise<Feature> => get(`paths/${pathId}/features/${featureSlug}`, axios),
    getOrganizations: async (axios?: NuxtAxiosInstance): Promise<OrganizationList> => get(`organizations`, axios),
    getOrganization: async (slug: string, axios?: NuxtAxiosInstance): Promise<Organization> => get(`organizations/${slug}`, axios),
    getOrganizationProjects: async (id: string, axios?: NuxtAxiosInstance): Promise<ProjectList> => get(`organizations/${id}/projects`, axios),
    getOrganizationUsers: async (organizationSlug: string, axios?: NuxtAxiosInstance): Promise<OrganizationUserList> => get(`organizations/${organizationSlug}/users`, axios),
    getPath: async (id: string, axios?: NuxtAxiosInstance): Promise<Path> => get(`paths/${id}`, axios),
    getPathRoot: async (id: string, axios?: NuxtAxiosInstance): Promise<Path> => get(`paths/${id}/root`, axios),
    getProjectSteps: async (id: string, axios?: NuxtAxiosInstance): Promise<Array<Step>> => get(`projects/${id}/steps`, axios),
    getProject: async (projectSlug: string, organizationSlug?: string, axios?: NuxtAxiosInstance): Promise<Project> => {
      return organizationSlug ? get(`organizations/${organizationSlug}/projects/${projectSlug}`, axios) : get(`projects/${projectSlug}`, axios);
    },
    getProjects: async (axios?: NuxtAxiosInstance): Promise<ProjectList> => get(`projects`, axios),
    getProjectUsers: async (projectSlug: string, organizationSlug?: string, axios?: NuxtAxiosInstance): Promise<ProjectUserList> => {
      return organizationSlug ? get(`organizations/${organizationSlug}/projects/${projectSlug}/users`, axios) : get(`projects/${projectSlug}/users`, axios);
    },
    getProjectUserToken: async (projectId: string, userId: string, axios?: NuxtAxiosInstance): Promise<ProjectUserToken> => get(`projects/${projectId}/users/${userId}/token`, axios),
    login: async (user: Login, axios?: NuxtAxiosInstance): Promise<LoginResponse> => post(`login`, user, axios),
    register: async (user: Register, axios?: NuxtAxiosInstance): Promise<User> => post(`register`, user, axios),
    saveFeature: async (feature: UpdateFeature, axios?: NuxtAxiosInstance): Promise<Feature> => {
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
      const feat = await put('features', toSave, axios)

      return await get(`paths/${feat.path.id}/features/${feat.slug}`, axios);
    },
    searchUsers: async (query: string, organizationSlug?: string | null, axios?: NuxtAxiosInstance): Promise<Array<BaseUser>> => {
      return await get(`users?q=${query}${organizationSlug ? `&organization=${organizationSlug}` : ''}`, axios);
    },
    updateFeaturePath: async (featurePath: UpdateFeatureParentPath, axios?: NuxtAxiosInstance): Promise<Path> => put('features', { id: featurePath.id, path: { id: featurePath.newParentId } }, axios),
    updateOrganization: async (organization: UpdateOrganizationName, axios?: NuxtAxiosInstance): Promise<Organization> => put(`organizations`, organization, axios),
    updateOrganizationUser: async (organizationId: string, userId: string, permissions: Array<OrganizationPermission>, axios?: NuxtAxiosInstance): Promise<OrganizationUser> => put(`organizations/${organizationId}/users/${userId}`, { permissions }, axios),
    updatePath: async (path: UpdatePath, axios?: NuxtAxiosInstance): Promise<Path> => put('paths', path, axios),
    updatePathParent: async (path: UpdatePathParent, axios?: NuxtAxiosInstance): Promise<Path> => put('paths', { id: path.id, parent: { id: path.newParentId } }, axios),
    updateProject: async (project: UpdateProject, axios?: NuxtAxiosInstance): Promise<Project> => put('projects', project, axios),
    updateProjectUser: async (projectId: string, userId: string, permissions: Array<ProjectPermission>, axios?: NuxtAxiosInstance): Promise<ProjectUser> => put(`projects/${projectId}/users/${userId}`, { permissions }, axios),
    updateStep: async (step: UpdateStep, axios?: NuxtAxiosInstance): Promise<Step> => put('steps', step, axios)
  } as Api;
};

const ApiPlugin: Plugin = Api;
Api(Vue.prototype);

export default ApiPlugin;
