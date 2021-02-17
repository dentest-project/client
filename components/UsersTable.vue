<template>
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <users-table-row v-for="(user, i) in users" :key="i" :user="user" :mode="mode" @change="onUserChanged" />
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import UsersTableRow from '~/components/UsersTableRow.vue';
import {
  OrganizationUser,
  OrganizationUserList, ProjectUser,
  ProjectUserList
} from '~/types';

enum Mode {
  Project = 'project',
  Organization = 'organization'
}

export default Vue.extend({
  components: {
    UsersTableRow
  },
  props: {
    users: {
      type: Array,
      required: true
    } as PropOptions<OrganizationUserList | ProjectUserList>,
    mode: {
      type: String,    projectUsers: {
      type: Array,
      required: false
    } as PropOptions<ProjectUserList>,
      required: true
    } as PropOptions<Mode>
  },
  methods: {
    onUserChanged: function (user: ProjectUser | OrganizationUser) {
      this.$emit('change', user);
    }
  }
});
</script>
