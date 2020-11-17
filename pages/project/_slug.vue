<template>
  <main>
    <h1>{{ title }}</h1>
    <grid3>
      <primary-link-button v-for="path in path.children" :key="path.id" :to="`/project/${path.id}`" :content="path.path" />
    </grid3>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Grid3 from '~/components/Grid3.vue';
import PrimaryLinkButton from '~/components/PrimaryLinkButton.vue';
import { Path, PathFeature, PathList } from '~/types';

interface InitialData {
  path: Path
}

interface Data extends InitialData {}

export default Vue.extend({
  components: { Grid3, PrimaryLinkButton },
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
    title() {
      return (this as any).path.project ? (this as any).path.project.title : (this as any).path.path;
    }
  }
});
</script>
