<template>
  <v-main>
    <breadcrumb :items="breadcrumbItems" />
    <editable-title v-if="$auth.loggedIn && canAdministrate" :value="title" label="Title" @submit="onTitleUpdated" />
    <h1 v-else>{{ title }}</h1>
    <actions-bar v-if="$auth.loggedIn && isProjectUser">
      <add-folder-button v-if="canWrite" @click.stop="activateCreatePathDialog" />
      <add-feature-button v-if="canWrite" @click.stop="activateCreateFeatureDialog" />
      <v-spacer />
      <token-button v-if="canPull" @click.stop="activateGetTokenDialog" />
      <users-button v-if="canAdministrate" :to="usersLink" />
      <visibility-button v-if="canAdministrate" :visibility="path.rootProject.visibility" @click.stop="onVisibilityUpdated" />
      <exit-button v-if="isProjectUser" label="Leave project" @click="activateLeaveProjectDialog" />
      <delete-button v-if="canAdministrate" @click.stop="onDeleteButtonClicked" />
    </actions-bar>
    <grid3>
      <path-card v-for="subPath in path.children" :key="subPath.id" :path="subPath" :parent="path" :can-write="canWrite" @moved="onPathMoved" />
      <feature-card v-for="feature in path.features" :key="feature.id" :feature="feature" :path="path" :can-write="canWrite" @moved="onFeatureMoved" />
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
    <get-token-dialog
      v-model="getTokenDialog"
      @close="deactivateGetTokenDialog"
      :project="path.rootProject"
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
    <v-snackbar v-model="featureUpdatedSnackbarOpened" :color="$colors.success">Feature updated</v-snackbar>
    <v-snackbar v-model="pathDeleteSnackbarOpened" :color="$colors.success">Folder deleted</v-snackbar>
    <v-snackbar v-model="pathUpdatedSnackbarOpened" :color="$colors.success">Folder updated</v-snackbar>
    <v-snackbar v-model="projectDeleteSnackbarOpened" :color="$colors.success">Project deleted</v-snackbar>
    <v-snackbar v-model="projectLeftSnackbarOpened" :color="$colors.success">Project left</v-snackbar>
    <v-snackbar v-model="projectUpdatedSnackbarOpened" :color="$colors.success">Project updated</v-snackbar>
    <v-snackbar v-model="pathCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the folder</v-snackbar>
    <v-snackbar v-model="featureCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the feature</v-snackbar>
    <v-snackbar v-model="featureUpdateErrorSnackbarOpened" :color="$colors.error">An error occurred while updating the feature</v-snackbar>
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
import Breadcrumb from '~/components/Breadcrumb.vue';
import AddFeatureButton from '~/components/buttons/AddFeatureButton.vue';
import AddFolderButton from '~/components/buttons/AddFolderButton.vue';
import DeleteButton from '~/components/buttons/DeleteButton.vue';
import ExitButton from '~/components/buttons/ExitButton.vue';
import UsersButton from '~/components/buttons/UsersButton.vue';
import VisibilityButton from '~/components/buttons/VisibilityButton.vue';
import FeatureCard from '~/components/cards/FeatureCard.vue';
import PathCard from '~/components/cards/PathCard.vue';
import CreateFeatureDialog from '~/components/dialogs/CreateFeatureDialog.vue';
import CreatePathDialog from '~/components/dialogs/CreatePathDialog.vue';
import DeletePathDialog from '~/components/dialogs/DeletePathDialog.vue';
import DeleteProjectDialog from '~/components/dialogs/DeleteProjectDialog.vue';
import GetTokenDialog from '~/components/dialogs/GetTokenDialog.vue';
import LeaveProjectDialog from '~/components/dialogs/LeaveProjectDialog.vue';
import EditableTitle from '~/components/EditableTitle.vue';
import Grid3 from '~/components/Grid3.vue';
import {
  Breadcrumb as BreadcrumbType,
  OrganizationPermission,
  Path,
  Project,
  ProjectPermission,
  ProjectVisibility, UpdateFeaturePath, UpdatePathParent
} from '~/types';

interface Data {
  createPathDialog: boolean,
  createFeatureDialog: boolean,
  deletePathDialog: boolean,
  deleteProjectDialog: boolean,
  getTokenDialog: boolean,
  leaveProjectDialog: boolean,
  pathCreatedSnackbarOpened: boolean,
  featureCreatedSnackbarOpened: boolean,
  featureUpdatedSnackbarOpened: boolean,
  pathDeleteSnackbarOpened: boolean,
  pathUpdatedSnackbarOpened: boolean,
  projectDeleteSnackbarOpened: boolean,
  projectLeftSnackbarOpened: boolean,
  projectUpdatedSnackbarOpened: boolean,
  pathCreationErrorSnackbarOpened: boolean,
  featureCreationErrorSnackbarOpened: boolean,
  featureUpdateErrorSnackbarOpened: boolean,
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
    GetTokenDialog,
    Grid3,
    LeaveProjectDialog,
    PathCard,
    UsersButton,
    VisibilityButton
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
      getTokenDialog: false,
      deletePathDialog: false,
      deleteProjectDialog: false,
      featureUpdatedSnackbarOpened: false,
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
      featureUpdateErrorSnackbarOpened: false,
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
    activateGetTokenDialog(): void {
      this.getTokenDialog = true;
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
    deactivateGetTokenDialog(): void {
      this.getTokenDialog = false;
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
    async onFeatureMoved(newPath: UpdateFeaturePath) {
      try {
        await this.$api.updateFeaturePath(newPath, this.$axios);
        this.featureUpdatedSnackbarOpened = true;
        this.$emit('needReload');
      } catch {
        this.featureUpdateErrorSnackbarOpened = true;
      }
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
    async onPathMoved(newPath: UpdatePathParent) {
      try {
        await this.$api.updatePathParent(newPath, this.$axios);
        this.pathUpdatedSnackbarOpened = true;
        this.$emit('needReload');
      } catch {
        this.pathUpdateErrorSnackbarOpened = true;
      }
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
    },
    async onVisibilityUpdated(): Promise<void> {
      if (!this.path.rootProject || !this.path.rootProject.id) {
        return;
      }

      try {
        await this.$api.updateProject({
          id: this.path.rootProject.id,
          visibility: this.nextVisibility
        }, this.$axios);
        this.projectUpdatedSnackbarOpened = true;
      } catch (error) {
        this.projectUpdateErrorSnackbarOpened = true;
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
    canPull: function (): boolean {
      const rootProject = ((this as any).path as Path).rootProject;

      if (!rootProject) {
        return false;
      }

      return rootProject.permissions.includes(ProjectPermission.Pull);
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
    nextVisibility: function (): ProjectVisibility {
      const project = (this as any).path.rootProject as Project;

      switch (project?.visibility) {
        case ProjectVisibility.Public:
          return project.organization ? ProjectVisibility.Internal : ProjectVisibility.Private;
        case ProjectVisibility.Internal:
          return ProjectVisibility.Private;
        default:
          return ProjectVisibility.Public;
      }
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
