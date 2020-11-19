<template>
  <main>
    <h1>{{ title }}</h1>
    <breadcrumb :items="breadcrumbItems" />
    <actions-bar>
      <add-folder-button @click.stop="activateCreatePathDialog" />
      <add-feature-button />
    </actions-bar>
    <grid3>
      <primary-link-button v-for="path in path.children" :key="path.id" :to="`/project/${path.id}`" :content="path.path" />
    </grid3>
    <create-path-dialog
      v-model="createPathDialog"
      @close="deActivateCreatePathDialog"
      @created="onPathCreated"
      @errored="onPathErrored"
      :path="path"
    />
    <v-snackbar v-model="pathCreatedSnackbarOpened" :color="$colors.success">Path created</v-snackbar>
    <v-snackbar v-model="pathCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the path</v-snackbar>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionsBar from '~/components/ActionsBar.vue';
import AddFeatureButton from '~/components/buttons/AddFeatureButton.vue';
import AddFolderButton from '~/components/buttons/AddFolderButton.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import CreatePathDialog from '~/components/dialogs/CreatePathDialog.vue';
import Grid3 from '~/components/Grid3.vue';
import PrimaryLinkButton from '~/components/buttons/PrimaryLinkButton.vue';
import { Breadcrumb as BreadcrumbType, Path, PathFeature, PathList } from '~/types';

interface InitialData {
  path: Path
}

interface Data extends InitialData {
  createPathDialog: boolean,
  pathCreatedSnackbarOpened: boolean,
  pathCreationErrorSnackbarOpened: boolean
}

export default Vue.extend({
  components: { AddFeatureButton, AddFolderButton, ActionsBar, Breadcrumb, CreatePathDialog, Grid3, PrimaryLinkButton },
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
      pathCreatedSnackbarOpened: false,
      pathCreationErrorSnackbarOpened: false
    }
  },
  methods: {
    activateCreatePathDialog(): void {
      this.createPathDialog = true;
    },
    deActivateCreatePathDialog(): void {
      this.createPathDialog = false;
    },
    async loadPath(): Promise<void> {
      this.path = await this.$api.getPath(this.$route.params.slug, this.$axios);
    },
    onPathCreated(): void {
      this.deActivateCreatePathDialog();
      this.pathCreatedSnackbarOpened = true;
      this.loadPath();
    },
    onPathErrored(): void {
      this.deActivateCreatePathDialog();
      this.pathCreationErrorSnackbarOpened = true;
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
