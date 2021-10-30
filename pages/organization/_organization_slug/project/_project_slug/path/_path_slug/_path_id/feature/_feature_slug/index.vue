<template>
  <feature-page
    :feature="feature"
    @saved="onSaved"
    @needUpdate="onNeedUpdate"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import FeaturePage from '~/components/pages/FeaturePage.vue'
import { Feature, Scenario } from '~/types'

interface InitialData {
  feature: Feature
}

export default Vue.extend({
  auth: false,
  components: { FeaturePage },
  head() {
    return {
      title: (this as any).getPageTitle()
    }
  },
  async asyncData({ $api, params }): Promise<InitialData> {
    const feature: Feature = await $api.getFeature(
      params.path_id,
      params.feature_slug
    )

    return {
      feature,
    }
  },
  data: function () {
    return {
      feature: {
        id: '',
        path: {},
        title: '',
        description: '',
        scenarios: [] as Array<Scenario>,
        rootProject: {},
      } as Feature,
    }
  },
  methods: {
    getPageTitle(): string {
      if ((this as any).$data.feature.rootProject.organization) {
        return `${(this as any).$data.feature.title} - ${(this as any).$data.feature.rootProject.title} - ${(this as any).$data.feature.rootProject.organization.name} | Dentest`;
      }

      return `${(this as any).$data.feature.title} - ${(this as any).$data.feature.rootProject.title} | Dentest`;
    },
    onNeedUpdate: function (feature: Feature) {
      this.feature = feature
    },
    onSaved: function (feature: Feature) {
      this.feature = feature
    },
  },
})
</script>
