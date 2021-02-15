<template>
  <feature-page :feature="feature" :feature-root-project="featureRootProject" @saved="onSaved" />
</template>

<script lang="ts">
import Vue from 'vue'
import FeaturePage from '~/components/pages/FeaturePage.vue';
import { Feature, FeatureRootProject, Scenario } from '~/types';

interface InitialData {
  feature: Feature,
  featureRootProject: FeatureRootProject
}

export default Vue.extend({
  auth: false,
  components: { FeaturePage },
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
  data: function () {
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
      } as FeatureRootProject
    };
  },
  methods: {
    onSaved: function (feature: Feature) {
      this.feature = feature;
    }
  }
});
</script>
