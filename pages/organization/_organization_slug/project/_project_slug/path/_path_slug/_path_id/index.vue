<template>
  <project-page :path="path" @needReload="onNeedReload" />
</template>

<script lang="ts">
import Vue from 'vue'
import ProjectPage from '~/components/pages/ProjectPage.vue';
import { Path } from '~/types';

interface InitialData {
  path: Path
}

export default Vue.extend({
  auth: false,
  components: { ProjectPage },
  async asyncData({ $api, params }): Promise<InitialData> {
    const path: Path = await $api.getPath(params.path_id);

    return {
      path
    };
  },
  data: function (): Data {
    return {
      path: {
        id: this.$route.params.path_id,
        parent: undefined,
        project: undefined,
        path: '',
        children: [] as PathList,
        features: [] as Array<PathFeature>
      } as Path
    };
  },
  methods: {
    async onNeedReload(): Promise<void> {
      this.path = await this.$api.getPath(this.$route.params.path_id, this.$axios);
    },
  }
});
</script>
