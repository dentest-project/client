<template>
  <v-main>
    <h1>{{ organization.name }}</h1>
    <actions-bar v-if="$auth.loggedIn">
      <add-button @click.stop="activateCreateProjectDialog" />
    </actions-bar>
    <grid3 v-if="projects.length > 0">
      <project-card v-for="project in projects" :key="project.id" :project="project" />
    </grid3>
    <p v-else>This organization has no project.</p>
    <create-project-dialog v-model="createProjectDialog" :organization="organization" @close="deActivateCreateProjectDialog" @created="onCreated" @errored="onErrored" />
    <v-snackbar v-model="createdSnackbarOpened" :color="$colors.success">Project created</v-snackbar>
    <v-snackbar v-model="creationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the project</v-snackbar>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionsBar from '~/components/ActionsBar.vue';
import AddButton from '~/components/buttons/AddButton.vue';
import CreateProjectDialog from '~/components/dialogs/CreateProjectDialog.vue';
import Grid3 from '~/components/Grid3.vue';
import PrimaryLinkButton from '~/components/buttons/PrimaryLinkButton.vue';
import ProjectCard from '~/components/cards/ProjectCard.vue';
import { Organization, ProjectList } from '~/types';

interface InitialData {
  organization: Organization,
  projects: ProjectList
}

export default Vue.extend({
  auth: false,
  components: { AddButton, ActionsBar, CreateProjectDialog, Grid3, PrimaryLinkButton, ProjectCard },
  async asyncData({ $api, params }): Promise<InitialData> {
    const [projects, organization] = await Promise.all([
      $api.getOrganizationProjects(params.slug),
      $api.getOrganization(params.slug)
    ]);

    return {
      organization,
      projects
    };
  },
  data: function () {
    return {
      projects: [] as ProjectList,
      organization: {} as Organization,
      createProjectDialog: false,
      createdSnackbarOpened: false,
      creationErrorSnackbarOpened: false
    }
  },
  methods: {
    activateCreateProjectDialog(): void {
      this.createProjectDialog = true;
    },
    deActivateCreateProjectDialog(): void {
      this.createProjectDialog = false;
    },
    async loadProjects(): Promise<void> {
      this.projects = await this.$api.getOrganizationProjects(this.$route.params.slug, this.$axios);
    },
    onCreated(): void {
      this.deActivateCreateProjectDialog();
      this.createdSnackbarOpened = true;
      this.loadProjects();
    },
    onErrored(): void {
      this.deActivateCreateProjectDialog();
      this.creationErrorSnackbarOpened = true;
    }
  }
});
</script>
