import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import {
  CreateFeature,
  CreatePath,
  CreateProject,
  Feature,
  FeatureRootProject,
  Login,
  LoginResponse, Organization,
  OrganizationList,
  Path,
  Project,
  ProjectList, Register,
  Step,
  UpdateFeature, UpdateOrganizationName, UpdatePath, UpdateProject, User
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
  createPath(path: CreatePath, axios?: NuxtAxiosInstance): Promise<Path>,
  createProject(project: CreateProject, axios?: NuxtAxiosInstance): Promise<Project>,
  createStep(step: Step, axios?: NuxtAxiosInstance): Promise<Step>,
  deleteFeature(id:string, axios?: NuxtAxiosInstance): Promise<void>,
  deletePath(id:string, axios?: NuxtAxiosInstance): Promise<void>,
  deleteProject(id: string, axios?: NuxtAxiosInstance): Promise<void>,
  getFeature(id: string, axios?: NuxtAxiosInstance): Promise<Feature>,
  getFeatureRootProject(id: string, axios?: NuxtAxiosInstance): Promise<FeatureRootProject>,
  getOrganizations(axios?: NuxtAxiosInstance): Promise<OrganizationList>,
  getOrganization(id: string, axios?: NuxtAxiosInstance): Promise<Organization>,
  getOrganizationProjects(id: string, axios?: NuxtAxiosInstance): Promise<ProjectList>,
  getPath(id: string, axios?: NuxtAxiosInstance): Promise<Path>,
  getProjectSteps(id: string, axios?: NuxtAxiosInstance): Promise<Array<Step>>,
  getProjects(axios?: NuxtAxiosInstance): Promise<ProjectList>,
  login(user: Login, axios?: NuxtAxiosInstance): Promise<LoginResponse>,
  register(user: Register, axios?: NuxtAxiosInstance): Promise<User>,
  saveFeature(feature: UpdateFeature, axios?: NuxtAxiosInstance): Promise<Feature>,
  updateOrganization(organization: UpdateOrganizationName, axios?: NuxtAxiosInstance): Promise<Organization>,
  updatePath(path: UpdatePath, axios?: NuxtAxiosInstance): Promise<Path>,
  updateProject(project: UpdateProject, axios?: NuxtAxiosInstance): Promise<Project>
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
    createPath: async (path: CreatePath, axios?: NuxtAxiosInstance): Promise<Path> => post('paths', path, axios),
    createProject: async (project: CreateProject, axios?: NuxtAxiosInstance): Promise<Project> => post('projects', project, axios),
    createStep: async (step: Step, axios?: NuxtAxiosInstance): Promise<Step> => post('steps', step, axios),
    deleteFeature: async (id: string, axios?: NuxtAxiosInstance): Promise<void> => del(`features/${id}`, axios),
    deletePath: async (id: string, axios?: NuxtAxiosInstance): Promise<void> => del(`paths/${id}`, axios),
    deleteProject: async (id: string, axios?: NuxtAxiosInstance): Promise<void> => del(`projects/${id}`, axios),
    getFeature: async (id: string, axios?: NuxtAxiosInstance): Promise<Feature> => get(`features/${id}`, axios),
    getFeatureRootProject: async (id: string, axios?: NuxtAxiosInstance): Promise<FeatureRootProject> => get(`features/${id}/root-project`, axios),
    getOrganizations: async (axios?: NuxtAxiosInstance): Promise<OrganizationList> => get(`organizations`, axios),
    getOrganization: async (id: string, axios?: NuxtAxiosInstance): Promise<Organization> => get(`organizations/${id}`, axios),
    getOrganizationProjects: async (id: string, axios?: NuxtAxiosInstance): Promise<ProjectList> => get(`organizations/${id}/projects`, axios),
    getPath: async (id: string, axios?: NuxtAxiosInstance): Promise<Path> => get(`paths/${id}`, axios),
    getProjectSteps: async (id: string, axios?: NuxtAxiosInstance): Promise<Array<Step>> => get(`projects/${id}/steps`, axios),
    getProjects: async (axios?: NuxtAxiosInstance): Promise<ProjectList> => get(`projects`, axios),
    login: async (user: Login, axios?: NuxtAxiosInstance): Promise<LoginResponse> => post(`login`, user, axios),
    register: async (user: Register, axios?: NuxtAxiosInstance): Promise<User> => post(`register`, user, axios),
    saveFeature: async (feature: UpdateFeature, axios?: NuxtAxiosInstance): Promise<Feature> => {
      const feat = await put('features', feature, axios)

      return await get(`features/${feat.id}`, axios);
    },
    updateOrganization: async (organization: UpdateOrganizationName, axios?: NuxtAxiosInstance): Promise<Organization> => put(`organizations`, organization, axios),
    updatePath: async (path: UpdatePath, axios?: NuxtAxiosInstance): Promise<Path> => put('paths', path, axios),
    updateProject: async (project: UpdateProject, axios?: NuxtAxiosInstance): Promise<Project> => put('projects', project, axios),
  } as Api;
};

const ApiPlugin: Plugin = Api;
Api(Vue.prototype);

export default ApiPlugin;
