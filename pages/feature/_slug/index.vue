<template>
  <main>
    <h1>{{ feature.title }}</h1>
    <breadcrumb :items="breadcrumbItems" />
    <actions-bar>
      <v-spacer />
      <delete-button @click.stop="onDeleteButtonClicked" />
    </actions-bar>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionsBar from '~/components/ActionsBar.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import DeleteButton from '~/components/buttons/DeleteButton.vue';
import { Breadcrumb as BreadcrumbType, Feature, Scenario } from '~/types';

interface InitialData {
  feature: Feature
}

interface Data extends InitialData {
}

export default Vue.extend({
  components: {
    ActionsBar,
    Breadcrumb,
    DeleteButton,
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
        path: undefined,
        title: '',
        description: '',
        scenarios: [] as Array<Scenario>
      } as Feature
    }
  },
  methods: {
    onDeleteButtonClicked(): void {
      alert('click');
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
          href: path.id,
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
