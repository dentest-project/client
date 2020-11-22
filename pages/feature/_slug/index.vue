<template>
  <main>
    <editable-title label="Feature title" v-model="feature.title" @input="onChanged" />
    <breadcrumb :items="breadcrumbItems" />
    <actions-bar>
      <save-button :enabled="saveEnabled" @click="save" />
      <v-spacer />
      <delete-button @click.stop="activateDeleteDialog" />
    </actions-bar>
    <delete-feature-dialog
      v-model="deleteDialog"
      @close="deactivateDeleteDialog"
      @deleted="onDeleted"
      @errored="onDeleteErrored"
      :feature="feature"
    />
    <v-snackbar v-model="deletedSnackbarOpened" :color="$colors.success">Feature deleted</v-snackbar>
    <v-snackbar v-model="deleteErrorSnackbarOpened" :color="$colors.error">An error occurred while deleting the feature</v-snackbar>
    <v-snackbar v-model="savedSnackbarOpened" :color="$colors.success">Feature saved</v-snackbar>
    <v-snackbar v-model="saveErrorSnackbarOpened" :color="$colors.error">An error occurred while saving the feature</v-snackbar>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionsBar from '~/components/ActionsBar.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import DeleteButton from '~/components/buttons/DeleteButton.vue';
import SaveButton from '~/components/buttons/SaveButton.vue';
import DeleteFeatureDialog from '~/components/dialogs/DeleteFeatureDialog.vue';
import EditableTitle from '~/components/EditableTitle.vue';
import { Breadcrumb as BreadcrumbType, Feature, Scenario, UpdateFeature } from '~/types';

interface InitialData {
  feature: Feature
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
  components: {
    SaveButton,
    ActionsBar,
    Breadcrumb,
    DeleteButton,
    DeleteFeatureDialog,
    EditableTitle
  },
  async asyncData({ $api, params }): Promise<InitialData> {
    const feature: Feature = await $api.getFeature(params.slug);

    return {
      feature
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
        this.feature = await this.$api.saveFeature({
          ...this.feature,
          path: {
            id: this.feature.path.id
          }
        }, this.$axios);
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
        path = path.parent;
      }
      out.push({ text: 'Entest', href: '/', disabled: false });

      return out.reverse();
    }
  }
});
</script>
