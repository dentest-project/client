<template>
  <feature-page :feature="feature" @saved="onSaved" />
</template>

<script lang="ts">
import Vue from 'vue'
import FeaturePage from '~/components/pages/FeaturePage.vue';
import { Feature, Scenario } from '~/types';

interface InitialData {
  feature: Feature
}

export default Vue.extend({
  auth: false,
  components: { FeaturePage },
  async asyncData({ $api, params }): Promise<InitialData> {
    const feature: Feature = await $api.getFeature(params.path_id, params.feature_slug);

    return {
      feature
    };
  },
  data: function () {
    return {
      feature: {
        id: '',
        path: {},
        title: '',
        description: '',
        scenarios: [] as Array<Scenario>,
        rootProject: {}
      } as Feature
    };
  },
  methods: {
    onSaved: function (feature: Feature) {
      this.feature = feature;
    }
  }
});
</script>
