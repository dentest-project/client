<template>
  <HomeContent v-if="!isLoggedIn" />
  <el-main v-else>
    <ActionsBar>
      <AddOrganizationButton @click="createOrganizationDialog = true" />
      <AddProjectButton @click="createProjectDialog = true" />
    </ActionsBar>
    <el-row :gutter="20">
      <el-col v-for="organization in organizations" :span="6" :md="6" :sm="12" :xs="24">
        <OrganizationCard :organization="organization" />
      </el-col>
      <el-col v-for="project in projects" :span="6" :md="6" :sm="12" :xs="24">
        <ProjectCard :project="project" />
      </el-col>
    </el-row>
    <Panel v-if="shouldDisplayEmptyMessage" type="warning">
      <el-text size="default">
        You're not part of any project nor organization on Dentest. If you joined Dentest via your company, please ask an
        administrator to add you to the company's organization or project.<br><br>
        Otherwise, you can start by creating your first project by clicking on the according button. You'll then be
        able to create directories, specify features, manage collaborators, and, if you are a developer, pull the features
        as Gherkin files alongside your code.
      </el-text>
    </Panel>
  </el-main>
  <CreateOrganizationDialog v-model="createOrganizationDialog" @created="onOrganizationCreated" />
  <CreateProjectDialog v-model="createProjectDialog" @created="onProjectCreated" />
</template>

<script setup async lang="ts">
import { isAuthenticated } from '~/helpers/auth'
import type { OrganizationList, ProjectList } from '~/types'

useHead({
  title: 'Dentest, a BDD solution'
})

definePageMeta({
  auth: false
})

const { $api } = useNuxtApp()
const { status } = useAuth()

const organizations = ref<OrganizationList>([])
const projects = ref<ProjectList>([])
const createOrganizationDialog = ref(false)
const createProjectDialog = ref(false)

const loadOrganizations = async () => {
  organizations.value = await $api.getOrganizations()
}

const loadProjects = async () => {
  projects.value = await $api.getProjects()
}

const onOrganizationCreated = () => {
  loadOrganizations()
}

const onProjectCreated = () => {
  loadProjects()
}

if (isAuthenticated(status.value)) {
  await loadOrganizations()
  await loadProjects()
}

const isLoggedIn = computed(() => isAuthenticated(status.value))

const shouldDisplayEmptyMessage = computed(() => organizations.value.length === 0 && projects.value.length === 0)
</script>

<style scoped>
.el-col {
  margin-bottom: 1rem;
}
</style>
