<template>
  <UserSearch :search-within-organization="searchUsersWithinOrganization" @selected="onUserAdd" />
  <table class="el-table el-table--striped">
    <tbody>
    <UsersTableRow
      v-for="user in users"
      :user="user"
      :context="context"
      @update:permissions="onUserUpdated"
      @remove="onUserRemoved"
    />
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { type BaseUser, Context, type OrganizationUser, type OrganizationUserList, type ProjectUser, type ProjectUserList } from '~/types'

const props = defineProps<{
  users: OrganizationUserList | ProjectUserList,
  context: Context,
  searchUsersWithinOrganization: boolean
}>()

const emit = defineEmits(['added', 'updated', 'removed'])

const onUserAdd = (user?: BaseUser) => {
  if (user) {
    emit('added', user)
  }
}

const onUserUpdated = (user: ProjectUser | OrganizationUser) => {
  emit('updated', user)
}

const onUserRemoved = (user: ProjectUser | OrganizationUser) => {
  emit('removed', user)
}
</script>

<style scoped>
table {
  width: 100%;
}
</style>
