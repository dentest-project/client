<template>
  <v-main>
    <editable-title v-if="$auth.loggedIn" :value="title" label="Title" @submit="onTitleUpdated" />
    <h1 v-else>{{ title }}</h1>
    <breadcrumb :items="breadcrumbItems" />
    <actions-bar v-if="$auth.loggedIn">
      <add-folder-button @click.stop="activateCreatePathDialog" />
      <add-feature-button @click.stop="activateCreateFeatureDialog" />
      <v-spacer />
      <delete-button @click.stop="onDeleteButtonClicked" />
    </actions-bar>
    <grid3>
      <path-card v-for="path in path.children" :key="path.id" :path="path" />
      <feature-card v-for="feature in path.features" :key="feature.id" :feature="feature" />
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
    <delete-project-dialog
      v-model="deleteProjectDialog"
      @close="deactivateDeleteProjectDialog"
      @deleted="onProjectDeleted"
      @errored="onProjectDeleteErrored"
      :path="path"
    />
    <v-snackbar v-model="pathCreatedSnackbarOpened" :color="$colors.success">Path created</v-snackbar>
    <v-snackbar v-model="featureCreatedSnackbarOpened" :color="$colors.success">Feature created</v-snackbar>
    <v-snackbar v-model="pathDeleteSnackbarOpened" :color="$colors.success">Path deleted</v-snackbar>
    <v-snackbar v-model="pathUpdatedSnackbarOpened" :color="$colors.success">Path updated</v-snackbar>
    <v-snackbar v-model="projectDeleteSnackbarOpened" :color="$colors.success">Project deleted</v-snackbar>
    <v-snackbar v-model="projectUpdatedSnackbarOpened" :color="$colors.success">Project updated</v-snackbar>
    <v-snackbar v-model="pathCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the path</v-snackbar>
    <v-snackbar v-model="featureCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the feature</v-snackbar>
    <v-snackbar v-model="pathUpdateErrorSnackbarOpened" :color="$colors.error">An error occurred while updating the path</v-snackbar>
    <v-snackbar v-model="pathDeleteErrorSnackbarOpened" :color="$colors.error">An error occurred while deleting the path</v-snackbar>
    <v-snackbar v-model="projectUpdateErrorSnackbarOpened" :color="$colors.error">An error occurred while updating the project</v-snackbar>
    <v-snackbar v-model="projectDeleteErrorSnackbarOpened" :color="$colors.error">An error occurred while deleting the project</v-snackbar>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
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
import FeatureCard from '~/components/cards/FeatureCard.vue';
import Grid3 from '~/components/Grid3.vue';
import PathCard from '~/components/cards/PathCard.vue';
import { Breadcrumb as BreadcrumbType, Path, PathFeature, PathList } from '~/types';

interface InitialData {
  path: Path
}

interface Data extends InitialData {
  createPathDialog: boolean,
  createFeatureDialog: boolean,
  deletePathDialog: boolean,
  deleteProjectDialog: boolean,
  pathCreatedSnackbarOpened: boolean,
  featureCreatedSnackbarOpened: boolean,
  pathDeleteSnackbarOpened: boolean,
  pathUpdatedSnackbarOpened: boolean,
  projectDeleteSnackbarOpened: boolean,
  projectUpdatedSnackbarOpened: boolean,
  pathCreationErrorSnackbarOpened: boolean,
  featureCreationErrorSnackbarOpened: boolean,
  pathDeleteErrorSnackbarOpened: boolean,
  pathUpdateErrorSnackbarOpened: boolean,
  projectDeleteErrorSnackbarOpened: boolean,
  projectUpdateErrorSnackbarOpened: boolean,
}

export default Vue.extend({
  auth: false,
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
    FeatureCard,
    Grid3,
    PathCard
  },
  async asyncData({ $api, params }): Promise<InitialData> {
    const path: Path = await $api.getPath(params.slug);

    return {
      path
    };
  },
  data: function (): Data {
    return {
      path: {
        id: this.$route.params.slug,
        parent: undefined,
        project: undefined,
        path: '',
        children: [] as PathList,
        features: [] as Array<PathFeature>
      } as Path,
      createPathDialog: false,
      createFeatureDialog: false,
      deletePathDialog: false,
      deleteProjectDialog: false,
      pathCreatedSnackbarOpened: false,
      featureCreatedSnackbarOpened: false,
      pathDeleteSnackbarOpened: false,
      pathUpdatedSnackbarOpened: false,
      projectDeleteSnackbarOpened: false,
      projectUpdatedSnackbarOpened: false,
      pathCreationErrorSnackbarOpened: false,
      featureCreationErrorSnackbarOpened: false,
      pathDeleteErrorSnackbarOpened: false,
      pathUpdateErrorSnackbarOpened: false,
      projectDeleteErrorSnackbarOpened: false,
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
    async loadPath(): Promise<void> {
      this.path = await this.$api.getPath(this.$route.params.slug, this.$axios);
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
      this.loadPath();
    },
    onFeatureCreated(): void {
      this.deactivateCreateFeatureDialog();
      this.featureCreatedSnackbarOpened = true;
      this.loadPath();
    },
    onPathDeleted(): void {
      this.deactivateDeletePathDialog();
      this.pathDeleteSnackbarOpened = true;
      setTimeout(() => {
        if (this.path.parent) {
          this.$router.push(this.$routes.project(this.path.parent?.id));
        }
      }, 2000);
    },
    onProjectDeleted(): void {
      this.deactivateDeleteProjectDialog();
      this.projectDeleteSnackbarOpened = true;
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
      await this.loadPath();
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
            href: (this as any).$routes.organization(path.project.organization.id),
            disabled: false
          });
        }

        path = path.parent;
      }

      return out.reverse();
    }
  }
});
</script>
