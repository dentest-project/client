<template>
  <v-main>
    <h1 v-if="!$auth.loggedIn || !canAdministrateOrganization">
      {{ organization.name }}
    </h1>
    <editable-title
      v-else
      label="Organization name"
      v-model="name"
      @submit="onNameUpdated"
    />
    <actions-bar v-if="$auth.loggedIn && isOrganizationUser">
      <add-project-button
        v-if="canCreateProject"
        @click.stop="activateCreateProjectDialog"
      />
      <v-spacer />
      <users-button v-if="canAdministrateOrganization" :to="usersLink" />
      <exit-button
        v-if="isOrganizationUser"
        label="Leave organization"
        @click="activateLeaveOrganizationDialog"
      />
      <delete-button
        v-if="canAdministrateOrganization"
        @click.stop="activateDeleteOrganizationDialog"
      />
    </actions-bar>
    <grid3 v-if="projects.length > 0">
      <project-card
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </grid3>
    <p v-else>This organization has no project.</p>
    <create-project-dialog
      v-model="createProjectDialog"
      :organization="organization"
      @close="deactivateCreateProjectDialog"
      @created="onCreated"
      @errored="onCreationErrored"
    />
    <delete-organization-dialog
      v-model="deleteOrganizationDialog"
      :organization="organization"
      @close="deactivateDeleteOrganizationDialog"
      @deleted="onOrganizationDeleted"
      @errored="onOrganizationDeleteError"
    />
    <leave-organization-dialog
      v-model="leaveOrganizationDialog"
      :organization="organization"
      @close="deactivateLeaveOrganizationDialog"
      @deleted="onOrganizationLeft"
      @errored="onOrganizationLeaveErrored"
    />
    <v-snackbar v-model="createdSnackbarOpened" :color="$colors.success"
      >Project created</v-snackbar
    >
    <v-snackbar v-model="creationErrorSnackbarOpened" :color="$colors.error"
      >An error occurred while creating the project</v-snackbar
    >
    <v-snackbar
      v-model="organizationUpdatedSnackbarOpened"
      :color="$colors.success"
      >Organization updated</v-snackbar
    >
    <v-snackbar
      v-model="organizationLeftSnackbarOpened"
      :color="$colors.success"
      >Organization left</v-snackbar
    >
    <v-snackbar
      v-model="organizationUpdateConflictErrorSnackbarOpened"
      :color="$colors.error"
      >This organization name is already taken :/</v-snackbar
    >
    <v-snackbar
      v-model="organizationUpdateErrorSnackbarOpened"
      :color="$colors.error"
      >An error occurred while updating the organization</v-snackbar
    >
    <v-snackbar
      v-model="organizationLeaveErrorSnackbarOpened"
      :color="$colors.error"
      >An error occurred while leaving the organization</v-snackbar
    >
    <v-snackbar
      v-model="deletedOrganizationSnackbarOpened"
      :color="$colors.success"
      >Organization deleted</v-snackbar
    >
    <v-snackbar
      v-model="deleteOrganizationErrorSnackbarOpened"
      :color="$colors.error"
      >An error occurred while deleting the organization</v-snackbar
    >
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionsBar from '~/components/ActionsBar.vue'
import AddProjectButton from '~/components/buttons/AddProjectButton.vue'
import DeleteButton from '~/components/buttons/DeleteButton.vue'
import ExitButton from '~/components/buttons/ExitButton.vue'
import UsersButton from '~/components/buttons/UsersButton.vue'
import CreateProjectDialog from '~/components/dialogs/CreateProjectDialog.vue'
import DeleteOrganizationDialog from '~/components/dialogs/DeleteOrganizationDialog.vue'
import LeaveOrganizationDialog from '~/components/dialogs/LeaveOrganizationDialog.vue'
import EditableTitle from '~/components/EditableTitle.vue'
import Grid3 from '~/components/Grid3.vue'
import PrimaryLinkButton from '~/components/buttons/PrimaryLinkButton.vue'
import ProjectCard from '~/components/cards/ProjectCard.vue'
import { Organization, OrganizationPermission, ProjectList } from '~/types'

interface InitialData {
  organization: Organization
  projects: ProjectList
  name: string
}

export default Vue.extend({
  auth: false,
  components: {
    AddProjectButton,
    ActionsBar,
    CreateProjectDialog,
    DeleteButton,
    DeleteOrganizationDialog,
    EditableTitle,
    ExitButton,
    Grid3,
    LeaveOrganizationDialog,
    PrimaryLinkButton,
    ProjectCard,
    UsersButton,
  },
  async asyncData({ $api, params }): Promise<InitialData> {
    const [projects, organization] = await Promise.all([
      $api.getOrganizationProjects(params.organization_slug),
      $api.getOrganization(params.organization_slug),
    ])

    return {
      organization,
      projects,
      name: organization.name,
    }
  },
  data: function () {
    return {
      name: '',
      projects: [] as ProjectList,
      organization: {} as Organization,
      createProjectDialog: false,
      createdSnackbarOpened: false,
      creationErrorSnackbarOpened: false,
      deleteOrganizationDialog: false,
      leaveOrganizationDialog: false,
      deletedOrganizationSnackbarOpened: false,
      deleteOrganizationErrorSnackbarOpened: false,
      organizationLeftSnackbarOpened: false,
      organizationLeaveErrorSnackbarOpened: false,
      organizationUpdatedSnackbarOpened: false,
      organizationUpdateConflictErrorSnackbarOpened: false,
      organizationUpdateErrorSnackbarOpened: false,
    }
  },
  methods: {
    activateCreateProjectDialog(): void {
      this.createProjectDialog = true
    },
    activateDeleteOrganizationDialog(): void {
      this.deleteOrganizationDialog = true
    },
    activateLeaveOrganizationDialog(): void {
      this.leaveOrganizationDialog = true
    },
    deactivateCreateProjectDialog(): void {
      this.createProjectDialog = false
    },
    deactivateDeleteOrganizationDialog(): void {
      this.deleteOrganizationDialog = false
    },
    deactivateLeaveOrganizationDialog(): void {
      this.leaveOrganizationDialog = false
    },
    async loadProjects(): Promise<void> {
      this.projects = await this.$api.getOrganizationProjects(
        this.$route.params.organization_slug,
        this.$axios
      )
    },
    onCreated(): void {
      this.deactivateCreateProjectDialog()
      this.createdSnackbarOpened = true
      this.loadProjects()
    },
    onCreationErrored(): void {
      this.deactivateCreateProjectDialog()
      this.creationErrorSnackbarOpened = true
    },
    async onNameUpdated(): Promise<void> {
      try {
        const newOrganization = await this.$api.updateOrganization(
          {
            id: this.organization.id || '',
            name: this.name,
          },
          this.$axios
        )
        this.organizationUpdatedSnackbarOpened = true
        setTimeout(() => {
          if (newOrganization.slug) {
            this.$router.push(this.$routes.organization(newOrganization.slug))
          }
        }, 2000)
      } catch (error) {
        if (error.response.status === 409) {
          this.organizationUpdateConflictErrorSnackbarOpened = true
        } else {
          this.organizationUpdateErrorSnackbarOpened = true
        }
      }
    },
    onOrganizationDeleted(): void {
      this.deactivateDeleteOrganizationDialog()
      this.deletedOrganizationSnackbarOpened = true
      setTimeout(() => this.$router.push(this.$routes.home()), 2000)
    },
    onOrganizationDeleteError(): void {
      this.deactivateDeleteOrganizationDialog()
      this.deleteOrganizationErrorSnackbarOpened = true
    },
    onOrganizationLeft(): void {
      this.deactivateLeaveOrganizationDialog()
      this.organizationLeftSnackbarOpened = true
      setTimeout(() => this.$router.push(this.$routes.home()), 2000)
    },
    onOrganizationLeaveErrored(): void {
      this.deactivateLeaveOrganizationDialog()
      this.organizationLeaveErrorSnackbarOpened = true
    },
  },
  computed: {
    canAdministrateOrganization: function (): boolean {
      return (
        typeof ((this as any).organization as Organization).permissions.find(
          (p) => p === OrganizationPermission.Admin
        ) !== 'undefined'
      )
    },
    canCreateProject: function (): boolean {
      return (
        typeof ((this as any).organization as Organization).permissions.find(
          (p) =>
            p === OrganizationPermission.Admin ||
            p === OrganizationPermission.ProjectCreate
        ) !== 'undefined'
      )
    },
    isOrganizationUser: function (): boolean {
      return (
        typeof ((this as any).organization as Organization).permissions.find(
          (p) =>
            p === OrganizationPermission.Admin ||
            p === OrganizationPermission.ProjectWrite ||
            p === OrganizationPermission.ProjectCreate ||
            p === OrganizationPermission.Read
        ) !== 'undefined'
      )
    },
    usersLink: function (): string {
      return `/organization/${
        (this as any).$route.params.organization_slug
      }/users`
    },
  },
})
</script>
