<template>
  <tr>
    <td>{{ user.user.username }}</td>
    <td>
      <UserPermissionSwitch
        v-for="permission in displayedPermissions"
        :label="permission.label"
        :message="permission.message"
        :value="permission.value"
        :permission="permission.permission"
        :disabled="permission.disabled"
        @update:value="onValueUpdated"
      />
    </td>
    <td>
      <LeaveButton label="Remove user" @left="onRemove" />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { Context, OrganizationPermission, type OrganizationUser, ProjectPermission, type ProjectUser } from '~/types'

const props = defineProps<{
  context: Context,
  user: OrganizationUser | ProjectUser
}>()

interface PermissionUpdate {
  permission: ProjectPermission | OrganizationPermission,
  value: boolean
}

const emit = defineEmits(['remove', 'update:permissions'])

const onRemove = () => {
  emit('remove', {
    ...props.user
  })
}

const onValueUpdated = (v: PermissionUpdate) => {
  const permissions = props.user.permissions as Array<ProjectPermission | OrganizationPermission>

  if (!v.value) {
    const idx = permissions.indexOf(v.permission)

    if (idx !== -1) {
      permissions.splice(idx, 1)
    }
  } else {
    permissions.push(v.permission)
  }

  emit('update:permissions', {
    ...props.user,
    permissions,
  })
}

const displayedPermissions = computed(() => {
  if (props.context === Context.Organization) {
    const permissions = props.user.permissions as OrganizationPermission[]

    return [
      {
        label: 'Admin',
        message:
          "User has all rights on organization, can create and write in projects but not administrate projects they're not admin of",
        value: permissions.includes(OrganizationPermission.Admin),
        permission: OrganizationPermission.Admin,
        disabled: false,
      },
      {
        label: 'Create projects',
        message: 'User is able to create projects and become admin of them',
        value:
          permissions.includes(OrganizationPermission.ProjectCreate) ||
          permissions.includes(OrganizationPermission.Admin),
        permission: OrganizationPermission.ProjectCreate,
        disabled: permissions.includes(OrganizationPermission.Admin),
      },
      {
        label: 'Write projects',
        message:
          'User is able to create paths and write features in organization projects',
        value:
          permissions.includes(OrganizationPermission.ProjectWrite) ||
          permissions.includes(OrganizationPermission.Admin),
        permission: OrganizationPermission.ProjectWrite,
        disabled: permissions.includes(OrganizationPermission.Admin),
      },
    ]
  }

  const permissions = props.user.permissions as ProjectPermission[]

  return [
    {
      label: 'Admin',
      message: 'User has all rights on project, except pull rights',
      value: permissions.includes(ProjectPermission.Admin),
      permission: ProjectPermission.Admin,
      disabled: false,
    },
    {
      label: 'Write',
      message:
        'User is able to create paths and write features but not to edit/delete the project',
      value:
        permissions.includes(ProjectPermission.Write) ||
        permissions.includes(ProjectPermission.Admin),
      permission: ProjectPermission.Write,
      disabled: permissions.includes(ProjectPermission.Admin),
    },
    {
      label: 'Pull features',
      message:
        'User is able to pull features as Gherkin code using command line',
      value: permissions.includes(ProjectPermission.Pull),
      permission: ProjectPermission.Pull,
      disabled: false,
    },
  ]
})
</script>

<style scoped>
td:last-of-type {
  text-align: right;
}
</style>
