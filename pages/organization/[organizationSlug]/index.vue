<template>
  <el-main>
    <h1 v-if="!isLoggedIn || !canAdministrateOrganization">{{ organizationName }}</h1>
    <EditableTitle v-else v-model="organizationName" label="Organization name" @submit="onNameSubmitted" />
    <ActionsBar>
      <AddProjectButton v-if="canCreateProject" @click="createProjectDialog = true" />
      <UsersLink v-if="canAdministrateOrganization" :to="`/organization/${organization.slug}/users`" />
      <LeaveButton v-if="isOrganizationUser" label="Leave organization" @left="onOrganizationLeft" />
      <DeleteButton v-if="canAdministrateOrganization" label="Delete organization" @deleted="onOrganizationDeleted" />
    </ActionsBar>
    <el-row :gutter="20">
      <el-col v-for="project in projects" :span="6" :md="6" :sm="12" :xs="24">
        <ProjectCard :project="project" />
      </el-col>
    </el-row>
    <Panel v-if="projects.length === 0 && isOrganizationUser" type="warning">
      <el-text size="default">
        This organization has no project yet. You can create one by clicking on the button above.
      </el-text>
    </Panel>
  </el-main>
  <CreateProjectDialog v-model="createProjectDialog" :organization="organization" @created="onProjectCreated" />
</template>

<script setup async lang="ts">
import { ElNotification } from 'element-plus'
import { isAuthenticated, loggedInUser } from '~/helpers/auth'
import { OrganizationPermission } from '~/types'

definePageMeta({
  auth: false
})

const { $api, $router, $routes } = useNuxtApp()
const { params } = useRoute()
const { status } = useAuth()

const organization = await $api.getOrganization(params.organizationSlug)
const organizationName = ref(organization.name)
const createProjectDialog = ref(false)
const projects = ref(await $api.getOrganizationProjects(params.organizationSlug))

useHead({
  title: `${organization.name} | Dentest`
})

const { data } = useAuth()

const onProjectCreated = () => {
  reloadProjects()
}

const onNameSubmitted = async () => {
  try {
    if (organizationName.value === organization.name) {
      return
    }

    const newOrganization = await $api.updateOrganization(
      {
        id: organization.id,
        name: organizationName.value,
      }
    )

    ElNotification({
      title: 'Organization name updated',
      message: 'The organization name has been successfully updated',
      type: 'success',
    })

    $router.push($routes.organization(newOrganization.slug))
  } catch (error) {
    if (error.statusCode === 409) {
      ElNotification({
        title: 'Already taken',
        message: 'The organization name already exists',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while updating the organization name',
        type: 'error',
      })
    }
  }
}

const onOrganizationLeft = async () => {
  try {
    await $api.deleteOrganizationUser(organization.id, loggedInUser(data.value).id)

    ElNotification({
      title: 'Organization left',
      message: 'The organization has been successfully left',
      type: 'success',
    })

    $router.push($routes.home())
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while leaving the organization',
      type: 'error',
    })
  }
}

const onOrganizationDeleted = async () => {
  try {
    await $api.deleteOrganization(organization.id)

    ElNotification({
      title: 'Organization deleted',
      message: 'The organization has been successfully deleted',
      type: 'success',
    })

    $router.push($routes.home())
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while deleting the organization',
      type: 'error',
    })
  }
}

const reloadProjects = async () => {
  projects.value = await $api.getOrganizationProjects(params.organizationSlug)
}

const canAdministrateOrganization = computed(() => organization.permissions.includes(OrganizationPermission.Admin))

const canCreateProject = computed(() => organization.permissions.some(
  (p) => [OrganizationPermission.Admin, OrganizationPermission.ProjectCreate].includes(p)
))

const isOrganizationUser = computed(() => organization.permissions.some(
  (p) => [
    OrganizationPermission.Admin,
    OrganizationPermission.ProjectWrite,
    OrganizationPermission.ProjectCreate,
    OrganizationPermission.Read
  ].includes(p)
))

const isLoggedIn = computed(() => isAuthenticated(status.value))
</script>
