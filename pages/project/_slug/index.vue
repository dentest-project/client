<template>
  <main>
    <h1>{{ title }}</h1>
    <breadcrumb :items="breadcrumbItems" />
    <actions-bar>
      <add-folder-button @click.stop="activateCreatePathDialog" />
      <add-feature-button @click.stop="activateCreateFeatureDialog" />
    </actions-bar>
    <grid3>
      <primary-link-button v-for="path in path.children" :key="path.id" :to="`/project/${path.id}`" :content="path.path" />
      <secondary-link-button v-for="feature in path.features" :key="feature.id" :to="`/feature/${feature.id}`" :content="feature.title" />
    </grid3>
    <create-path-dialog
      v-model="createPathDialog"
      @close="deActivateCreatePathDialog"
      @created="onPathCreated"
      @errored="onPathErrored"
      :path="path"
    />
    <create-feature-dialog
      v-model="createFeatureDialog"
      @close="deActivateCreateFeatureDialog"
      @created="onFeatureCreated"
      @errored="onFeatureErrored"
      :path="path"
    />
    <v-snackbar v-model="pathCreatedSnackbarOpened" :color="$colors.success">Path created</v-snackbar>
    <v-snackbar v-model="featureCreatedSnackbarOpened" :color="$colors.success">Feature created</v-snackbar>
    <v-snackbar v-model="pathCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the path</v-snackbar>
    <v-snackbar v-model="featureCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the feature</v-snackbar>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionsBar from '~/components/ActionsBar.vue';
import AddFeatureButton from '~/components/buttons/AddFeatureButton.vue';
import AddFolderButton from '~/components/buttons/AddFolderButton.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import CreateFeatureDialog from '~/components/dialogs/CreateFeatureDialog.vue';
import CreatePathDialog from '~/components/dialogs/CreatePathDialog.vue';
import Grid3 from '~/components/Grid3.vue';
import PrimaryLinkButton from '~/components/buttons/PrimaryLinkButton.vue';
import SecondaryLinkButton from '~/components/buttons/SecondaryLinkButton.vue';
import { Breadcrumb as BreadcrumbType, Path, PathFeature, PathList } from '~/types';

interface InitialData {
  path: Path
}

interface Data extends InitialData {
  createPathDialog: boolean,
  createFeatureDialog: boolean,
  pathCreatedSnackbarOpened: boolean,
  featureCreatedSnackbarOpened: boolean,
  pathCreationErrorSnackbarOpened: boolean,
  featureCreationErrorSnackbarOpened: boolean
}

export default Vue.extend({
  components: { AddFeatureButton, AddFolderButton, ActionsBar, Breadcrumb, CreateFeatureDialog, CreatePathDialog, Grid3, PrimaryLinkButton, SecondaryLinkButton },
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
      pathCreatedSnackbarOpened: false,
      featureCreatedSnackbarOpened: false,
      pathCreationErrorSnackbarOpened: false,
      featureCreationErrorSnackbarOpened: false
    }
  },
  methods: {
    activateCreatePathDialog(): void {
      this.createPathDialog = true;
    },
    activateCreateFeatureDialog(): void {
      this.createFeatureDialog = true;
    },
    deActivateCreatePathDialog(): void {
      this.createPathDialog = false;
    },
    deActivateCreateFeatureDialog(): void {
      this.createFeatureDialog = false;
    },
    async loadPath(): Promise<void> {
      this.path = await this.$api.getPath(this.$route.params.slug, this.$axios);
    },
    onPathCreated(): void {
      this.deActivateCreatePathDialog();
      this.pathCreatedSnackbarOpened = true;
      this.loadPath();
    },
    onFeatureCreated(): void {
      this.deActivateCreateFeatureDialog();
      this.featureCreatedSnackbarOpened = true;
      this.loadPath();
    },
    onPathErrored(): void {
      this.deActivateCreatePathDialog();
      this.pathCreationErrorSnackbarOpened = true;
    },
    onFeatureErrored(): void {
      this.deActivateCreateFeatureDialog();
      this.featureCreationErrorSnackbarOpened = true;
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
        path = path.parent;
      }
      out.push({ text: 'Entest', href: '/', disabled: false });

      return out.reverse();
    }
  }
});
</script>
