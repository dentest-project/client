<template>
  <v-main class="home">
    <actions-bar v-if="$auth.loggedIn">
      <add-organization-button @click.stop="activateCreateOrganizationDialog" />
    </actions-bar>
    <grid3>
      <organization-card v-for="organization in organizations" :key="organization.id" :organization="organization" />
    </grid3>
    <create-organization-dialog v-model="createOrganizationDialog" @close="deactivateCreateOrganizationDialog" @created="onCreated" @errored="onErrored" />
    <v-snackbar v-model="createdSnackbarOpened" :color="$colors.success">Organization created</v-snackbar>
    <v-snackbar v-model="creationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the organization</v-snackbar>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionsBar from '~/components/ActionsBar.vue';
import AddButton from '~/components/buttons/AddButton.vue';
import AddOrganizationButton from '~/components/buttons/AddOrganizationButton.vue';
import CreateOrganizationDialog from '~/components/dialogs/CreateOrganizationDialog.vue';
import Grid3 from '~/components/Grid3.vue';
import OrganizationCard from '~/components/cards/OrganizationCard.vue';
import { OrganizationList } from '~/types';

interface InitialData {
  organizations: OrganizationList
}

export default Vue.extend({
  auth: false,
  components: { AddButton, AddOrganizationButton, ActionsBar, CreateOrganizationDialog, Grid3, OrganizationCard },
  async asyncData({ $api }): Promise<InitialData> {
    const organizations = await $api.getOrganizations();

    return {
      organizations
    };
  },
  data: function () {
    return {
      organizations: [] as OrganizationList,
      createOrganizationDialog: false,
      createdSnackbarOpened: false,
      creationErrorSnackbarOpened: false
    }
  },
  methods: {
    activateCreateOrganizationDialog(): void {
      this.createOrganizationDialog = true;
    },
    deactivateCreateOrganizationDialog(): void {
      this.createOrganizationDialog = false;
    },
    async loadOrganizations(): Promise<void> {
      this.organizations = await this.$api.getOrganizations(this.$axios);
    },
    onCreated(): void {
      this.deactivateCreateOrganizationDialog();
      this.createdSnackbarOpened = true;
      this.loadOrganizations();
    },
    onErrored(): void {
      this.deactivateCreateOrganizationDialog();
      this.creationErrorSnackbarOpened = true;
    }
  }
});
</script>

<style scoped>
main.home {
  margin-top: 5rem;
}
</style>
