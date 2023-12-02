<template>
  <el-main>
    <Breadcrumb :items="breadcrumb" />
    <h1>Project "{{ project.title }}" users</h1>
    <UsersTable
      :context="Context.Project"
      :users="users"
      :search-users-within-organization="searchUsersWithinOrganization"
      @added="onUserAdded"
      @updated="onUserUpdated"
      @removed="onUserRemoved"
    />
  </el-main>
</template>

<script setup async lang="ts">
import { ElNotification } from 'element-plus'
import {
  type BaseUser,
  type BreadcrumbItems,
  Context,
  type ProjectUser
} from '~/types'

const { $api, $routes } = useNuxtApp()
const { params } = useRoute()

definePageMeta({
  alias: '/project/:projectSlug/users'
})

const project = ref(await $api.getProject(params.projectSlug, params.organizationSlug))
const users = ref(await $api.getProjectUsers(params.projectSlug))



const onUserAdded = async (user: BaseUser) => {
  try {
    await $api.createProjectUser(project.value, user)
    ElNotification({
      title: 'User added',
      message: 'The user has been successfully added to the project',
      type: 'success',
    })
    await reload()
  } catch (error) {
    if (error.statusCode === 409) {
      ElNotification({
        title: 'User already in',
        message: 'The user is already part of the project',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while adding the user to the project',
        type: 'error',
      })
    }
  }
}

const onUserRemoved = async (user: ProjectUser) => {
  try {
    await $api.deleteProjectUser(project.value.id, user.user.id)
    ElNotification({
      title: 'User removed',
      message: 'The user has been successfully removed from the project',
      type: 'success',
    })
    await reload()
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while removing the user from the project',
      type: 'error',
    })
  }
}

const onUserUpdated = async (user: ProjectUser) => {
  try {
    await $api.updateProjectUser(project.value.id, user.user.id, user.permissions)
    ElNotification({
      title: 'User updated',
      message: 'The project user has been successfully updated',
      type: 'success',
    })
    await reload()
  } catch (e) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while updating the project user',
      type: 'error',
    })
  }
}

const reload = async () => {
  users.value = await $api.getProjectUsers(params.projectSlug, params.organizationSlug)
}

const searchUsersWithinOrganization = computed(() => !!params.organizationSlug)

const breadcrumb = computed((): BreadcrumbItems => (
  project.value.organization
    ? [
        {
          text: project.value.organization.name,
          href: $routes.organization(project.value.organization.slug),
          disabled: false,
        }
      ]
    : []
).concat([
  {
    text: project.value.title,
    href: $routes.project(project.value),
    disabled: false
  },
  {
    text: 'Users',
    href: '',
    disabled: true,
  }
]))

const title = computed(() => project.value.organization ? `Users - ${project.value.title} - ${project.value.organization.name} | Dentest` : `Users - ${project.value.title} | Dentest`)

useHead({
  title
})
</script>
