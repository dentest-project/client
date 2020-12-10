<template>
  <main>
    <h1>Projects list</h1>
    <actions-bar v-if="$auth.loggedIn">
      <add-button @click.stop="activateCreateProjectDialog" />
    </actions-bar>
    <grid3>
      <project-card v-for="project in projects" :key="project.id" :project="project" />
    </grid3>
    <create-project-dialog v-model="createProjectDialog" @close="deActivateCreateProjectDialog" @created="onCreated" @errored="onErrored" />
    <v-snackbar v-model="createdSnackbarOpened" :color="$colors.success">Project created</v-snackbar>
    <v-snackbar v-model="creationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the project</v-snackbar>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import ActionsBar from '~/components/ActionsBar.vue';
import AddButton from '~/components/buttons/AddButton.vue';
import CreateProjectDialog from '~/components/dialogs/CreateProjectDialog.vue';
import Grid3 from '~/components/Grid3.vue';
import PrimaryLinkButton from '~/components/buttons/PrimaryLinkButton.vue';
import ProjectCard from '~/components/cards/ProjectCard.vue';
import { ProjectList } from '~/types';

interface InitialData {
  projects: ProjectList
}

export default Vue.extend({
  auth: false,
  components: { AddButton, ActionsBar, CreateProjectDialog, Grid3, PrimaryLinkButton, ProjectCard },
  async asyncData({ $api }): Promise<InitialData> {
    const projects = await $api.getProjects();

    return {
      projects
    };
  },
  data: function () {
    return {
      projects: [] as ProjectList,
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
      this.projects = await this.$api.getProjects(this.$axios);
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
