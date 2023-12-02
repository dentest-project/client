<template>
  <tr>
    <td>{{ user.user.username }}</td>
    <td>
      <user-permission-switch
        v-for="(permission, i) in displayedPermissions"
        :label="permission.label"
        :message="permission.message"
        :value="permission.value"
        :permission="permission.permission"
        :disabled="permission.disabled"
        @change="onChange"
      />
    </td>
    <td>
      <exit-button label="Remove user" @click="onDelete" />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import ExitButton from '~/components/buttons/ExitButton.vue'
import UserPermissionSwitch from '~/components/switches/UserPermissionSwitch.vue'
import {
  OrganizationPermission,
  OrganizationUser,
  ProjectPermission,
  ProjectUser,
} from '~/types'

enum Mode {
  Project = 'project',
  Organization = 'organization',
}

interface ChangeEvent {
  value: boolean
  permission: ProjectPermission | OrganizationPermission
}

export default Vue.extend({
  components: {
    ExitButton,
    UserPermissionSwitch,
  },
  props: {
    mode: {
      type: String,
      required: true,
    } as PropOptions<Mode>,
    user: {
      type: Object,
      required: true,
    } as PropOptions<OrganizationUser | ProjectUser>,
  },
  methods: {
    onDelete: function () {
      this.$emit('delete', {
        ...this.user,
      })
    },
    onChange: function (e: ChangeEvent) {
      const permissions = this.user.permissions as Array<
        ProjectPermission | OrganizationPermission
      >

      if (!e.value) {
        const idx = permissions.indexOf(e.permission)

        if (idx !== -1) {
          permissions.splice(idx, 1)
        }
      } else {
        permissions.push(e.permission)
      }

      this.$emit('change', {
        ...this.user,
        permissions,
      })
    },
  },
  computed: {
    displayedPermissions: function () {
      if ((this as any).mode === Mode.Organization) {
        const permissions = ((this as any).user as OrganizationUser).permissions

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

      const permissions = ((this as any).user as ProjectUser).permissions

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
    },
  },
})
</script>
