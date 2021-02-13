<template>
  <v-main>
    <editable-title v-if="$auth.loggedIn && canWrite" label="Feature title" v-model="feature.title" @input="onChanged" />
    <h1 v-else>{{ feature.title }}</h1>
    <breadcrumb :items="breadcrumbItems" />
    <actions-bar v-if="$auth.loggedIn && canWrite">
      <save-button :enabled="saveEnabled" @click="save" />
      <v-spacer />
      <delete-button @click.stop="activateDeleteDialog" />
    </actions-bar>
    <feature-content v-model="feature" :feature-root-project="featureRootProject" :can-write="$auth.loggedIn && canWrite" @input="onChanged" />
    <delete-feature-dialog
      v-model="deleteDialog"
      :feature="feature"
      @close="deactivateDeleteDialog"
      @deleted="onDeleted"
      @errored="onDeleteErrored"
    />
    <v-snackbar v-model="deletedSnackbarOpened" :color="$colors.success">Feature deleted</v-snackbar>
    <v-snackbar v-model="deleteErrorSnackbarOpened" :color="$colors.error">An error occurred while deleting the feature</v-snackbar>
    <v-snackbar v-model="savedSnackbarOpened" :color="$colors.success">Feature saved</v-snackbar>
    <v-snackbar v-model="saveErrorSnackbarOpened" :color="$colors.error">An error occurred while saving the feature</v-snackbar>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionsBar from '~/components/ActionsBar.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import DeleteButton from '~/components/buttons/DeleteButton.vue';
import DeleteFeatureDialog from '~/components/dialogs/DeleteFeatureDialog.vue';
import EditableTitle from '~/components/EditableTitle.vue';
import FeatureContent from '~/components/FeatureContent.vue';
import SaveButton from '~/components/buttons/SaveButton.vue';
import {
  Breadcrumb as BreadcrumbType,
  Feature,
  FeatureRootProject, OrganizationPermission,
  Project,
  ProjectPermission,
  Scenario,
  UpdateFeature
} from '~/types';

interface InitialData {
  feature: Feature,
  featureRootProject: FeatureRootProject
}

interface Data extends InitialData {
  deleteDialog: boolean,
  deletedSnackbarOpened: boolean,
  deleteErrorSnackbarOpened: boolean,
  saveEnabled: boolean,
  savedSnackbarOpened: boolean,
  saveErrorSnackbarOpened: boolean
}

export default Vue.extend({
  auth: false,
  components: {
    SaveButton,
    ActionsBar,
    Breadcrumb,
    DeleteButton,
    DeleteFeatureDialog,
    EditableTitle,
    FeatureContent
  },
  async asyncData({ $api, params }): Promise<InitialData> {
    const [feature, featureRootProject]: [Feature, FeatureRootProject] = await Promise.all([
      $api.getFeature(params.slug),
      $api.getFeatureRootProject(params.slug)
    ]);

    return {
      feature,
      featureRootProject
    };
  },
  data: function (): Data {
    return {
      feature: {
        id: this.$route.params.slug,
        path: {},
        title: '',
        description: '',
        scenarios: [] as Array<Scenario>
      } as Feature,
      featureRootProject: {
        id: ''
      } as FeatureRootProject,
      deleteDialog: false,
      deletedSnackbarOpened: false,
      deleteErrorSnackbarOpened: false,
      saveEnabled: false,
      savedSnackbarOpened: false,
      saveErrorSnackbarOpened: false
    }
  },
  methods: {
    activateDeleteDialog(): void {
      this.deleteDialog = true;
    },
    deactivateDeleteDialog(): void {
      this.deleteDialog = false;
    },
    formatFeatureForSave(): UpdateFeature {
      return {
        ...this.feature,
        path: {
          id: this.feature.path.id
        }
      };
    },
    onChanged(): void {
      this.saveEnabled = true;
    },
    onDeleted(): void {
      this.deactivateDeleteDialog();
      this.deletedSnackbarOpened = true;
      setTimeout(() => this.$router.push(this.$routes.project(this.feature.path.id)), 2000);
    },
    onDeleteErrored(): void {
      this.deactivateDeleteDialog();
      this.deleteErrorSnackbarOpened = true;
    },
    onSaved(): void {
      this.savedSnackbarOpened = true;
      this.saveEnabled = false;
    },
    onSaveErrored(): void {
      this.saveErrorSnackbarOpened = true;
    },
    async save(): Promise<void> {
      try {
        this.feature = await this.$api.saveFeature(this.formatFeatureForSave(), this.$axios);
        this.onSaved();
      } catch (error) {
        this.onSaveErrored();
      }
    }
  },
  computed: {
    breadcrumbItems(): BreadcrumbType {
      const out = [{
        text: (this as any).feature.title,
        href: (this as any).id,
        disabled: true
      }] as BreadcrumbType;
      let path = (this as any).feature.path;

      while (path !== undefined) {
        out.push({
          text: path.project ? path.project.title : path.path,
          href: (this as any).$routes.project(path.id),
          disabled: false
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
    canWrite: function (): boolean {
      const rootProject = (this as any).featureRootProject as Project;

      if (typeof rootProject.permissions.find(p => p === ProjectPermission.Admin || p === ProjectPermission.Write) !== 'undefined') {
        return true;
      }
      if (!rootProject.organization) {
        return false;
      }

      return typeof rootProject.organization.permissions.find(p => p === OrganizationPermission.Admin || p === OrganizationPermission.ProjectWrite) !== 'undefined';
    }
  }
});
</script>
