import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import {
  CreateFeature,
  CreatePath,
  CreateProject,
  Feature,
  Path,
  Project,
  ProjectList,
  Step,
  UpdateFeature
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
  createPath(path: CreatePath, axios?: NuxtAxiosInstance): Promise<Path>,
  createProject(project: CreateProject, axios?: NuxtAxiosInstance): Promise<Project>,
  createStep(step: Step, axios?: NuxtAxiosInstance): Promise<Step>,
  deleteFeature(id:string, axios?: NuxtAxiosInstance): Promise<void>,
  deletePath(id:string, axios?: NuxtAxiosInstance): Promise<void>,
  deleteProject(id: string, axios?: NuxtAxiosInstance): Promise<void>,
  getFeature(id: string, axios?: NuxtAxiosInstance): Promise<Feature>,
  getPath(id: string, axios?: NuxtAxiosInstance): Promise<Path>,
  getProjects(axios?: NuxtAxiosInstance): Promise<ProjectList>,
  saveFeature(feature: UpdateFeature, axios?: NuxtAxiosInstance): Promise<Feature>,
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
    createPath: async (path: CreatePath, axios?: NuxtAxiosInstance): Promise<Path> => post('paths', path, axios),
    createProject: async (project: CreateProject, axios?: NuxtAxiosInstance): Promise<Project> => post('projects', project, axios),
    createStep: async (step: Step, axios?: NuxtAxiosInstance): Promise<Step> => post('steps', step, axios),
    deleteFeature: async (id: string, axios?: NuxtAxiosInstance): Promise<void> => del(`features/${id}`, axios),
    deletePath: async (id: string, axios?: NuxtAxiosInstance): Promise<void> => del(`paths/${id}`, axios),
    deleteProject: async (id: string, axios?: NuxtAxiosInstance): Promise<void> => del(`projects/${id}`, axios),
    getFeature: async (id: string, axios?: NuxtAxiosInstance): Promise<Feature> => get(`features/${id}`, axios),
    getPath: async (id: string, axios?: NuxtAxiosInstance): Promise<Path> => get(`paths/${id}`, axios),
    getProjects: async (axios?: NuxtAxiosInstance): Promise<ProjectList> => get(`projects`, axios),
    saveFeature: async (feature: UpdateFeature, axios?: NuxtAxiosInstance): Promise<Feature> => put('features', feature, axios),
  } as Api;
};

const ApiPlugin: Plugin = Api;
Api(Vue.prototype);

export default ApiPlugin;
