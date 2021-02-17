<template>
  <v-main>
    <h1>Users</h1>
    <users-table :users="users" mode="project" @change="onUserChanged" />
    <v-snackbar v-model="updateSuccessSnackbarOpened" :color="$colors.success">User updated</v-snackbar>
    <v-snackbar v-model="updateErrorSnackbarOpened" :color="$colors.error">An error occurred while updating the user</v-snackbar>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import UsersTable from '~/components/UsersTable.vue';
import { Project, ProjectUser, ProjectUserList } from '~/types';

interface InitialData {
  users: ProjectUserList,
  project: Project
}

export default Vue.extend({
  auth: true,
  components: {
    UsersTable
  },
  async asyncData({ $api, params }): Promise<InitialData> {
    const [users, project]: [ProjectUserList, Project] = await Promise.all([
      $api.getProjectUsers(params.project_slug, params.organization_slug),
      $api.getProject(params.project_slug, params.organization_slug)
    ]);

    return {
      users,
      project
    };
  },
  data: function () {
    return {
      users: [] as ProjectUserList,
      project: {} as Project,
      updateSuccessSnackbarOpened: false,
      updateErrorSnackbarOpened: false
    };
  },
  methods: {
    onUserChanged: async function (user: ProjectUser) {
      try {
        await this.$api.updateProjectUser(this.project.id, user.user.id, user.permissions, this.$axios);
        this.updateSuccessSnackbarOpened = true;
        await this.reload();
      } catch (e) {
        this.updateErrorSnackbarOpened = true;
      }
    },
    reload: async function () {
      const params = this.$route.params;

      this.users = await this.$api.getProjectUsers(params.project_slug, params.organization_slug, this.$axios);
    }
  }
});
</script>
