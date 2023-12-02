<template>
  <el-main>
    <Breadcrumb :items="breadcrumb" />
    <h1>Organization "{{ organization.name }}" users</h1>
    <UsersTable
      :context="Context.Organization"
      :users="users"
      :search-users-within-organization="false"
      @added="onUserAdded"
      @updated="onUserUpdated"
      @removed="onUserRemoved"
    />
  </el-main>
</template>

<script setup async lang="ts">
import { ElNotification } from 'element-plus'
import { type BaseUser, type BreadcrumbItems, Context, type OrganizationUser } from '~/types'

const { $api, $routes } = useNuxtApp()
const { params } = useRoute()

const organization = ref(await $api.getOrganization(params.organizationSlug))
const users = ref(await $api.getOrganizationUsers(params.organizationSlug))

const onUserAdded = async (user: BaseUser) => {
  try {
    await $api.createOrganizationUser(organization.value, user)
    ElNotification({
      title: 'User added',
      message: 'The user has been successfully added to the organization',
      type: 'success',
    })
    await reload()
  } catch (error) {
    if (error.statusCode === 409) {
      ElNotification({
        title: 'User already in',
        message: 'The user is already part of the organization',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while adding the user to the organization',
        type: 'error',
      })
    }
  }
}

const onUserRemoved = async (user: OrganizationUser) => {
  try {
    await $api.deleteOrganizationUser(organization.value.id, user.user.id)
    ElNotification({
      title: 'User removed',
      message: 'The user has been successfully removed from the organization',
      type: 'success',
    })
    await reload()
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while removing the user from the organization',
      type: 'error',
    })
  }
}

const onUserUpdated = async (user: OrganizationUser) => {
  try {
    await $api.updateOrganizationUser(organization.value.id, user.user.id, user.permissions)
    ElNotification({
      title: 'User updated',
      message: 'The organization user has been successfully updated',
      type: 'success',
    })
    await reload()
  } catch (e) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while updating the organization user',
      type: 'error',
    })
  }
}

const reload = async () => {
  users.value = await $api.getOrganizationUsers(params.organizationSlug)
}

const breadcrumb = computed((): BreadcrumbItems => [
  {
    text: organization.value.name,
    href: $routes.organization(organization.value.slug),
    disabled: false,
  },
  {
    text: 'Users',
    href: '',
    disabled: true,
  }
])

useHead({
  title: `Users - ${organization.value.name} | Dentest`
})
</script>
