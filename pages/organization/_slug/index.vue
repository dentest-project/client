<template>
  <v-main>
    <h1 v-if="!$auth.loggedIn">{{ organization.name }}</h1>
    <editable-title v-else label="Organization name" v-model="name" @submit="onNameUpdated" />
    <actions-bar v-if="$auth.loggedIn">
      <add-button @click.stop="activateCreateProjectDialog" />
    </actions-bar>
    <grid3 v-if="projects.length > 0">
      <project-card v-for="project in projects" :key="project.id" :project="project" />
    </grid3>
    <p v-else>This organization has no project.</p>
    <create-project-dialog v-model="createProjectDialog" :organization="organization" @close="deactivateCreateProjectDialog" @created="onCreated" @errored="onErrored" />
    <v-snackbar v-model="createdSnackbarOpened" :color="$colors.success">Project created</v-snackbar>
    <v-snackbar v-model="organizationUpdatedSnackbarOpened" :color="$colors.success">Organization updated</v-snackbar>
    <v-snackbar v-model="creationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the project</v-snackbar>
    <v-snackbar v-model="organizationUpdateConflictErrorSnackbarOpened" :color="$colors.error">This organization name is already taken :/</v-snackbar>
    <v-snackbar v-model="organizationUpdateErrorSnackbarOpened" :color="$colors.error">An error occurred while updating the organization</v-snackbar>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionsBar from '~/components/ActionsBar.vue';
import AddButton from '~/components/buttons/AddButton.vue';
import CreateProjectDialog from '~/components/dialogs/CreateProjectDialog.vue';
import EditableTitle from '~/components/EditableTitle.vue';
import Grid3 from '~/components/Grid3.vue';
import PrimaryLinkButton from '~/components/buttons/PrimaryLinkButton.vue';
import ProjectCard from '~/components/cards/ProjectCard.vue';
import { Organization, ProjectList } from '~/types';

interface InitialData {
  organization: Organization,
  projects: ProjectList,
  name: string
}

export default Vue.extend({
  auth: false,
  components: { AddButton, ActionsBar, CreateProjectDialog, EditableTitle, Grid3, PrimaryLinkButton, ProjectCard },
  async asyncData({ $api, params }): Promise<InitialData> {
    const [projects, organization] = await Promise.all([
      $api.getOrganizationProjects(params.slug),
      $api.getOrganization(params.slug)
    ]);

    return {
      organization,
      projects,
      name: organization.name
    };
  },
  data: function () {
    return {
      name: '',
      projects: [] as ProjectList,
      organization: {} as Organization,
      createProjectDialog: false,
      createdSnackbarOpened: false,
      creationErrorSnackbarOpened: false,
      organizationUpdatedSnackbarOpened: false,
      organizationUpdateConflictErrorSnackbarOpened: false,
      organizationUpdateErrorSnackbarOpened: false,
    }
  },
  methods: {
    activateCreateProjectDialog(): void {
      this.createProjectDialog = true;
    },
    deactivateCreateProjectDialog(): void {
      this.createProjectDialog = false;
    },
    async loadProjects(): Promise<void> {
      this.projects = await this.$api.getOrganizationProjects(this.$route.params.slug, this.$axios);
    },
    onCreated(): void {
      this.deactivateCreateProjectDialog();
      this.createdSnackbarOpened = true;
      this.loadProjects();
    },
    onErrored(): void {
      this.deactivateCreateProjectDialog();
      this.creationErrorSnackbarOpened = true;
    },
    async onNameUpdated(): Promise<void> {
      try {
        const newOrganization = await this.$api.updateOrganization({
          id: this.organization.id || '',
          name: this.name
        }, this.$axios);
        this.organizationUpdatedSnackbarOpened = true;
        setTimeout(() => {
          if (newOrganization.id) {
            this.$router.push(this.$routes.organization(newOrganization.id));
          }
        }, 2000);
      } catch (error) {
        if (error.response.status === 409) {
          this.organizationUpdateConflictErrorSnackbarOpened = true;
        } else {
          this.organizationUpdateErrorSnackbarOpened = true;
        }
      }
    }
  }
});
</script>
