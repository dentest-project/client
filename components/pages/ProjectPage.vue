<template>
  <v-main>
    <breadcrumb :items="breadcrumbItems" />
    <editable-title v-if="$auth.loggedIn && canAdministrate" :value="title" label="Title" @submit="onTitleUpdated" />
    <h1 v-else>{{ title }}</h1>
    <actions-bar v-if="$auth.loggedIn && isProjectUser">
      <add-folder-button v-if="canWrite" @click.stop="activateCreatePathDialog" />
      <add-feature-button v-if="canWrite" @click.stop="activateCreateFeatureDialog" />
      <v-spacer />
      <users-button v-if="canAdministrate" :to="usersLink" />
      <exit-button v-if="isProjectUser" label="Leave project" @click="activateLeaveProjectDialog" />
      <delete-button v-if="canAdministrate" @click.stop="onDeleteButtonClicked" />
    </actions-bar>
    <grid3>
      <path-card v-for="subPath in path.children" :key="subPath.id" :path="subPath" />
      <feature-card v-for="feature in path.features" :key="feature.id" :feature="feature" :path="path" />
    </grid3>
    <create-path-dialog
      v-model="createPathDialog"
      @close="deactivateCreatePathDialog"
      @created="onPathCreated"
      @errored="onPathErrored"
      :path="path"
    />
    <create-feature-dialog
      v-model="createFeatureDialog"
      @close="deactivateCreateFeatureDialog"
      @created="onFeatureCreated"
      @errored="onFeatureErrored"
      :path="path"
    />
    <delete-path-dialog
      v-model="deletePathDialog"
      @close="deactivateDeletePathDialog"
      @deleted="onPathDeleted"
      @errored="onPathDeleteErrored"
      :path="path"
    />
    <leave-project-dialog
      v-model="leaveProjectDialog"
      @close="deactivateLeaveProjectDialog"
      @deleted="onProjectLeft"
      @errored="onProjectLeaveErrored"
      :path="path"
    />
    <delete-project-dialog
      v-model="deleteProjectDialog"
      @close="deactivateDeleteProjectDialog"
      @deleted="onProjectDeleted"
      @errored="onProjectDeleteErrored"
      :path="path"
    />
    <v-snackbar v-model="pathCreatedSnackbarOpened" :color="$colors.success">Folder created</v-snackbar>
    <v-snackbar v-model="featureCreatedSnackbarOpened" :color="$colors.success">Feature created</v-snackbar>
    <v-snackbar v-model="pathDeleteSnackbarOpened" :color="$colors.success">Folder deleted</v-snackbar>
    <v-snackbar v-model="pathUpdatedSnackbarOpened" :color="$colors.success">Folder updated</v-snackbar>
    <v-snackbar v-model="projectDeleteSnackbarOpened" :color="$colors.success">Project deleted</v-snackbar>
    <v-snackbar v-model="projectLeftSnackbarOpened" :color="$colors.success">Project left</v-snackbar>
    <v-snackbar v-model="projectUpdatedSnackbarOpened" :color="$colors.success">Project updated</v-snackbar>
    <v-snackbar v-model="pathCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the folder</v-snackbar>
    <v-snackbar v-model="featureCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the feature</v-snackbar>
    <v-snackbar v-model="pathUpdateErrorSnackbarOpened" :color="$colors.error">An error occurred while updating the folder</v-snackbar>
    <v-snackbar v-model="pathDeleteErrorSnackbarOpened" :color="$colors.error">An error occurred while deleting the folder</v-snackbar>
    <v-snackbar v-model="projectUpdateErrorSnackbarOpened" :color="$colors.error">An error occurred while updating the project</v-snackbar>
    <v-snackbar v-model="projectDeleteErrorSnackbarOpened" :color="$colors.error">An error occurred while deleting the project</v-snackbar>
    <v-snackbar v-model="projectLeaveErrorSnackbarOpened" :color="$colors.error">An error occurred while leaving the project</v-snackbar>
  </v-main>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import ActionsBar from '~/components/ActionsBar.vue';
import AddFeatureButton from '~/components/buttons/AddFeatureButton.vue';
import AddFolderButton from '~/components/buttons/AddFolderButton.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import DeleteButton from '~/components/buttons/DeleteButton.vue';
import CreateFeatureDialog from '~/components/dialogs/CreateFeatureDialog.vue';
import CreatePathDialog from '~/components/dialogs/CreatePathDialog.vue';
import DeletePathDialog from '~/components/dialogs/DeletePathDialog.vue';
import DeleteProjectDialog from '~/components/dialogs/DeleteProjectDialog.vue';
import EditableTitle from '~/components/EditableTitle.vue';
import ExitButton from '~/components/buttons/ExitButton.vue';
import FeatureCard from '~/components/cards/FeatureCard.vue';
import Grid3 from '~/components/Grid3.vue';
import LeaveProjectDialog from '~/components/dialogs/LeaveProjectDialog.vue';
import PathCard from '~/components/cards/PathCard.vue';
import UsersButton from '~/components/buttons/UsersButton.vue';
import { Breadcrumb as BreadcrumbType, OrganizationPermission, Path, ProjectPermission } from '~/types';

interface Data {
  createPathDialog: boolean,
  createFeatureDialog: boolean,
  deletePathDialog: boolean,
  deleteProjectDialog: boolean,
  leaveProjectDialog: boolean,
  pathCreatedSnackbarOpened: boolean,
  featureCreatedSnackbarOpened: boolean,
  pathDeleteSnackbarOpened: boolean,
  pathUpdatedSnackbarOpened: boolean,
  projectDeleteSnackbarOpened: boolean,
  projectLeftSnackbarOpened: boolean,
  projectUpdatedSnackbarOpened: boolean,
  pathCreationErrorSnackbarOpened: boolean,
  featureCreationErrorSnackbarOpened: boolean,
  pathDeleteErrorSnackbarOpened: boolean,
  pathUpdateErrorSnackbarOpened: boolean,
  projectDeleteErrorSnackbarOpened: boolean,
  projectLeaveErrorSnackbarOpened: boolean,
  projectUpdateErrorSnackbarOpened: boolean,
}

export default Vue.extend({
  components: {
    AddFeatureButton,
    AddFolderButton,
    ActionsBar,
    Breadcrumb,
    CreateFeatureDialog,
    CreatePathDialog,
    DeleteButton,
    DeletePathDialog,
    DeleteProjectDialog,
    EditableTitle,
    ExitButton,
    FeatureCard,
    Grid3,
    LeaveProjectDialog,
    PathCard,
    UsersButton
  },
  props: {
    path: {
      type: Object,
      required: true
    } as PropOptions<Path>
  },
  data: function (): Data {
    return {
      createPathDialog: false,
      createFeatureDialog: false,
      deletePathDialog: false,
      deleteProjectDialog: false,
      leaveProjectDialog: false,
      pathCreatedSnackbarOpened: false,
      featureCreatedSnackbarOpened: false,
      pathDeleteSnackbarOpened: false,
      pathUpdatedSnackbarOpened: false,
      projectDeleteSnackbarOpened: false,
      projectLeftSnackbarOpened: false,
      projectUpdatedSnackbarOpened: false,
      pathCreationErrorSnackbarOpened: false,
      featureCreationErrorSnackbarOpened: false,
      pathDeleteErrorSnackbarOpened: false,
      pathUpdateErrorSnackbarOpened: false,
      projectDeleteErrorSnackbarOpened: false,
      projectLeaveErrorSnackbarOpened: false,
      projectUpdateErrorSnackbarOpened: false
    }
  },
  methods: {
    activateCreatePathDialog(): void {
      this.createPathDialog = true;
    },
    activateCreateFeatureDialog(): void {
      this.createFeatureDialog = true;
    },
    activateDeletePathDialog(): void {
      this.deletePathDialog = true;
    },
    activateDeleteProjectDialog(): void {
      this.deleteProjectDialog = true;
    },
    activateLeaveProjectDialog(): void {
      this.leaveProjectDialog = true;
    },
    deactivateCreatePathDialog(): void {
      this.createPathDialog = false;
    },
    deactivateCreateFeatureDialog(): void {
      this.createFeatureDialog = false;
    },
    deactivateDeletePathDialog(): void {
      this.deletePathDialog = false;
    },
    deactivateDeleteProjectDialog(): void {
      this.deleteProjectDialog = false;
    },
    deactivateLeaveProjectDialog(): void {
      this.leaveProjectDialog = false;
    },
    onDeleteButtonClicked(): void {
      if (this.path.project) {
        this.activateDeleteProjectDialog();
      } else {
        this.activateDeletePathDialog();
      }
    },
    onPathCreated(): void {
      this.deactivateCreatePathDialog();
      this.pathCreatedSnackbarOpened = true;
      this.$emit('needReload');
    },
    onFeatureCreated(): void {
      this.deactivateCreateFeatureDialog();
      this.featureCreatedSnackbarOpened = true;
      this.$emit('needReload');
    },
    onPathDeleted(): void {
      this.deactivateDeletePathDialog();
      this.pathDeleteSnackbarOpened = true;
      setTimeout(() => {
        if (this.path.parent) {
          this.$router.push(this.$routes.path(this.path.parent));
        }
      }, 2000);
    },
    onProjectDeleted(): void {
      this.deactivateDeleteProjectDialog();
      this.projectDeleteSnackbarOpened = true;
      setTimeout(() => this.$router.push(this.$routes.home()), 2000);
    },
    onProjectLeft(): void {
      this.deactivateLeaveProjectDialog();
      this.projectLeftSnackbarOpened = true;
      setTimeout(() => this.$router.push(this.$routes.home()), 2000);
    },
    onPathErrored(): void {
      this.deactivateCreatePathDialog();
      this.pathCreationErrorSnackbarOpened = true;
    },
    onFeatureErrored(): void {
      this.deactivateCreateFeatureDialog();
      this.featureCreationErrorSnackbarOpened = true;
    },
    onPathDeleteErrored(): void {
      this.deactivateDeletePathDialog();
      this.pathDeleteErrorSnackbarOpened = true;
    },
    onProjectDeleteErrored(): void {
      this.deactivateDeleteProjectDialog();
      this.projectDeleteErrorSnackbarOpened = true;
    },
    onProjectLeaveErrored(): void {
      this.deactivateLeaveProjectDialog();
      this.projectLeaveErrorSnackbarOpened = true;
    },
    async onTitleUpdated(e: string): Promise<void> {
      if (this.path.project) {
        try {
          this.path.project.title = e;
          await this.$api.updateProject({
            id: this.path.project.id,
            title: e
          }, this.$axios);
          this.projectUpdatedSnackbarOpened = true;
        } catch (error) {
          this.projectUpdateErrorSnackbarOpened = true;
        }
      } else {
        try {
          this.path.path = e;
          await this.$api.updatePath({
            id: this.path.id,
            path: e
          }, this.$axios);
          this.pathUpdatedSnackbarOpened = true;
        } catch (error) {
          this.pathUpdateErrorSnackbarOpened = true;
        }
      }
      this.$emit('needReload');
    }
  },
  computed: {
    title(): string {
      return (this as any).path.project ? (this as any).path.project.title : (this as any).path.path;
    },
    breadcrumbItems(): BreadcrumbType {
      const out = [] as BreadcrumbType;
      let path = (this as any).path;

      while (path !== undefined) {
        out.push({
          text: path.project ? path.project.title : path.path,
          href: path.id,
          disabled: path.id === this.path.id
        });

        if (path.project && path.project.organization) {
          out.push({
            text: path.project.organization.name,
            href: (this as any).$routes.organization(path.project.organization.slug),
            disabled: false
          });
        }

        path = path.parent;
      }

      return out.reverse();
    },
    canAdministrate: function (): boolean {
      const path = (this as any).path as Path;

      if (!path.project) {
        return (this as any).canWrite;
      }

      if (!path.rootProject) {
        return false;
      }

      return typeof path.rootProject.permissions.find(p => p === ProjectPermission.Admin) !== 'undefined';
    },
    canWrite: function (): boolean {
      const rootProject = ((this as any).path as Path).rootProject;

      if (!rootProject) {
        return false;
      }

      if (typeof rootProject.permissions.find(p => p === ProjectPermission.Admin || p === ProjectPermission.Write) !== 'undefined') {
        return true;
      }
      if (!rootProject.organization) {
        return false;
      }

      return typeof rootProject.organization.permissions.find(p => p === OrganizationPermission.Admin || p === OrganizationPermission.ProjectWrite) !== 'undefined';
    },
    isProjectUser: function (): boolean {
      const rootProject = ((this as any).path as Path).rootProject;

      if (!rootProject) {
        return false;
      }

      return typeof rootProject.permissions.find(p => p === ProjectPermission.Admin || p === ProjectPermission.Write || p === ProjectPermission.Read || p === ProjectPermission.Pull) !== 'undefined';
    },
    usersLink: function (): string {
      const routeParams = (this as any).$route.params;

      if (routeParams.organization_slug) {
        return `/organization/${routeParams.organization_slug}/project/${routeParams.project_slug}/users`;
      }

      return `/project/${routeParams.project_slug}/users`;
    }
  }
});
</script>
