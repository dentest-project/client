<template>
  <v-main>
    <breadcrumb :items="breadcrumbItems" />
    <h1>Organization "{{ organization.name }}" users</h1>
    <users-table :users="users" mode="organization" :search-users-within-organization="false" @add="onUserAdd" @delete="onUserDelete" @change="onUserChanged" />
    <v-snackbar v-model="addSuccessSnackbarOpened" :color="$colors.success">User added</v-snackbar>
    <v-snackbar v-model="deleteSuccessSnackbarOpened" :color="$colors.success">User removed</v-snackbar>
    <v-snackbar v-model="updateSuccessSnackbarOpened" :color="$colors.success">User updated</v-snackbar>
    <v-snackbar v-model="addErrorSnackbarOpened" :color="$colors.error">An error occurred while updating the user</v-snackbar>
    <v-snackbar v-model="addConflictErrorSnackbarOpened" :color="$colors.error">The user is already in this organization</v-snackbar>
    <v-snackbar v-model="deleteErrorSnackbarOpened" :color="$colors.error">An error occurred while removing the user</v-snackbar>
    <v-snackbar v-model="updateErrorSnackbarOpened" :color="$colors.error">An error occurred while updating the user</v-snackbar>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import UsersTable from '~/components/UsersTable.vue';
import {
  BaseUser,
  Breadcrumb as BreadcrumbType, Organization, OrganizationUser,
  OrganizationUserList
} from '~/types';

interface InitialData {
  users: OrganizationUserList,
  organization: Organization
}

export default Vue.extend({
  auth: true,
  components: {
    UsersTable
  },
  async asyncData({ $api, params }): Promise<InitialData> {
    const [users, organization]: [OrganizationUserList, Organization] = await Promise.all([
      $api.getOrganizationUsers(params.organization_slug),
      $api.getOrganization(params.organization_slug)
    ]);

    return {
      users,
      organization
    };
  },
  data: function () {
    return {
      users: [] as OrganizationUserList,
      organization: {} as Organization,
      addSuccessSnackbarOpened: false,
      addConflictErrorSnackbarOpened: false,
      addErrorSnackbarOpened: false,
      deleteSuccessSnackbarOpened: false,
      deleteErrorSnackbarOpened: false,
      updateSuccessSnackbarOpened: false,
      updateErrorSnackbarOpened: false
    };
  },
  methods: {
    onUserAdd: async function (user: BaseUser) {
      try {
        await this.$api.createOrganizationUser(this.organization, user, this.$axios);
        this.addSuccessSnackbarOpened = true;
        await this.reload();
      } catch (error) {
        if (error.response.status === 409) {
          this.addConflictErrorSnackbarOpened = true;
        } else {
          this.addErrorSnackbarOpened = true;
        }
      }
    },
    onUserDelete: async function (user: OrganizationUser) {
      if (!this.organization.id) {
        return;
      }
      try {
        await this.$api.deleteOrganizationUser(this.organization.id, user.user.id, this.$axios);
        this.deleteSuccessSnackbarOpened = true;
        await this.reload();
      } catch (error) {
        this.deleteErrorSnackbarOpened = true;
      }
    },
    onUserChanged: async function (user: OrganizationUser) {
      if (!this.organization.id) {
        return;
      }
      try {
        await this.$api.updateOrganizationUser(this.organization.id, user.user.id, user.permissions, this.$axios);
        this.updateSuccessSnackbarOpened = true;
        await this.reload();
      } catch (e) {
        this.updateErrorSnackbarOpened = true;
      }
    },
    reload: async function () {
      const params = this.$route.params;

      this.users = await this.$api.getOrganizationUsers(params.organization_slug, this.$axios);
    }
  },
  computed: {
    breadcrumbItems(): BreadcrumbType {
      const out = [] as BreadcrumbType;
      let organization = (this as any).organization;

      out.push({
        text: organization.name,
        href: (this as any).$routes.organization(organization.slug),
        disabled: false
      });

      out.push({
        text: 'Users',
        href: '',
        disabled: true
      });

      return out;
    }
  }
});
</script>
