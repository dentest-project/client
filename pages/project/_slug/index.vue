<template>
  <main>
    <h1>{{ title }}</h1>
    <breadcrumb :items="breadcrumbItems" />
    <actions-bar>
      <add-folder-button />
      <add-feature-button />
    </actions-bar>
    <grid3>
      <primary-link-button v-for="path in path.children" :key="path.id" :to="`/project/${path.id}`" :content="path.path" />
    </grid3>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionsBar from '~/components/ActionsBar.vue';
import AddFeatureButton from '~/components/AddFeatureButton.vue';
import AddFolderButton from '~/components/AddFolderButton.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import Grid3 from '~/components/Grid3.vue';
import PrimaryLinkButton from '~/components/PrimaryLinkButton.vue';
import { Breadcrumb as BreadcrumbType, Path, PathFeature, PathList } from '~/types';

interface InitialData {
  path: Path
}

interface Data extends InitialData {}

export default Vue.extend({
  components: { AddFeatureButton, AddFolderButton, ActionsBar, Breadcrumb, Grid3, PrimaryLinkButton },
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
      } as Path
    }
  },
  methods: {
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
