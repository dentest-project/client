<template>
  <home-content v-if="!$auth.loggedIn" />
  <v-main class="home" v-else>
    <actions-bar>
      <add-organization-button @click.stop="activateCreateOrganizationDialog" />
      <add-project-button @click.stop="activateCreateProjectDialog" />
    </actions-bar>
    <grid3 class="home-cards">
      <organization-card
        v-for="organization in organizations"
        :key="organization.id"
        :organization="organization"
      />
    </grid3>
    <grid3 class="home-cards">
      <project-card
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </grid3>
    <p v-if="organizations.length === 0 && projects.length === 0">
      You don't have any project nor organization.
    </p>
    <create-organization-dialog
      v-model="createOrganizationDialog"
      @close="deactivateCreateOrganizationDialog"
      @created="onOrganizationCreated"
      @errored="onOrganizationErrored"
    />
    <create-project-dialog
      v-model="createProjectDialog"
      @close="deactivateCreateProjectDialog"
      @created="onProjectCreated"
      @errored="onProjectErrored"
    />
    <v-snackbar
      v-model="organizationCreatedSnackbarOpened"
      :color="$colors.success"
      >Organization created</v-snackbar
    >
    <v-snackbar
      v-model="organizationCreationErrorSnackbarOpened"
      :color="$colors.error"
      >An error occurred while creating the organization</v-snackbar
    >
    <v-snackbar v-model="projectCreatedSnackbarOpened" :color="$colors.success"
      >Project created</v-snackbar
    >
    <v-snackbar
      v-model="projectCreationErrorSnackbarOpened"
      :color="$colors.error"
      >An error occurred while creating the project</v-snackbar
    >
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionsBar from '~/components/ActionsBar.vue'
import AddOrganizationButton from '~/components/buttons/AddOrganizationButton.vue'
import AddProjectButton from '~/components/buttons/AddProjectButton.vue'
import CreateOrganizationDialog from '~/components/dialogs/CreateOrganizationDialog.vue'
import CreateProjectDialog from '~/components/dialogs/CreateProjectDialog.vue'
import Grid3 from '~/components/Grid3.vue'
import HomeContent from '~/components/HomeContent.vue'
import OrganizationCard from '~/components/cards/OrganizationCard.vue'
import ProjectCard from '~/components/cards/ProjectCard.vue'
import { OrganizationList, ProjectList } from '~/types'

interface InitialData {
  organizations: OrganizationList
  projects: ProjectList
}

export default Vue.extend({
  auth: false,
  components: {
    HomeContent,
    AddProjectButton,
    AddOrganizationButton,
    ActionsBar,
    CreateOrganizationDialog,
    CreateProjectDialog,
    Grid3,
    OrganizationCard,
    ProjectCard,
  },
  async beforeMount(): Promise<void> {
    if (this.$auth.loggedIn) {
      await Promise.all([this.loadOrganizations(), this.loadProjects()])
    }
  },
  data: function () {
    return {
      organizations: [] as OrganizationList,
      projects: [] as ProjectList,
      createOrganizationDialog: false,
      createProjectDialog: false,
      organizationCreatedSnackbarOpened: false,
      organizationCreationErrorSnackbarOpened: false,
      projectCreatedSnackbarOpened: false,
      projectCreationErrorSnackbarOpened: false,
    }
  },
  methods: {
    activateCreateOrganizationDialog(): void {
      this.createOrganizationDialog = true
    },
    deactivateCreateOrganizationDialog(): void {
      this.createOrganizationDialog = false
    },
    activateCreateProjectDialog(): void {
      this.createProjectDialog = true
    },
    deactivateCreateProjectDialog(): void {
      this.createProjectDialog = false
    },
    async loadOrganizations(): Promise<void> {
      this.organizations = await this.$api.getOrganizations(this.$axios)
    },
    async loadProjects(): Promise<void> {
      this.projects = await this.$api.getProjects(this.$axios)
    },
    onOrganizationCreated(): void {
      this.deactivateCreateOrganizationDialog()
      this.organizationCreatedSnackbarOpened = true
      this.loadOrganizations()
    },
    onOrganizationErrored(): void {
      this.deactivateCreateOrganizationDialog()
      this.organizationCreationErrorSnackbarOpened = true
    },
    onProjectCreated(): void {
      this.deactivateCreateProjectDialog()
      this.projectCreatedSnackbarOpened = true
      this.loadProjects()
    },
    onProjectErrored(): void {
      this.deactivateCreateProjectDialog()
      this.projectCreationErrorSnackbarOpened = true
    },
  },
})
</script>

<style scoped>
.home-cards {
  margin-top: 2rem;
}
</style>
