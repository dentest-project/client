<template>
  <v-menu
    v-model="select"
    bottom
    right
    transition="scale-transition"
    origin="top left"
  >
    <template v-slot:activator="{ on }">
      <v-chip v-on="on" :color="color" class="feature-status-chip">{{ displayedStatus }}</v-chip>
    </template>
    <v-card width="300" v-if="canSelect">
      <v-list>
        <v-list-item v-for="status in availableStatuses" :key="status" @click="onSelected(status)">
          <v-list-item-content>
            <v-list-item-title>{{ translateStatus(status) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Feature, FeatureStatus } from '~/types';

export default Vue.extend({
  props: {
    canSelect: {
      type: Boolean,
      required: true
    },
    feature: {
      type: Object,
      required: true
    } as PropOptions<Feature>
  },
  data() {
    return {
      select: false
    };
  },
  methods: {
    onSelected(status: FeatureStatus): void {
      this.$emit('selected', status);
    },
    translateStatus(status: FeatureStatus): string {
      switch (status) {
        case FeatureStatus.Draft:
          return 'Draft';
        case FeatureStatus.ReadyToDev:
          return 'Ready to dev';
        case FeatureStatus.Live:
          return 'Live';
      }
    }
  },
  computed: {
    color() {
      switch ((this as any).feature.status) {
        case FeatureStatus.Draft:
          return (this as any).$colors.draft;
        case FeatureStatus.ReadyToDev:
          return (this as any).$colors.ready;
        case FeatureStatus.Live:
          return (this as any).$colors.live;
      }
    },
    displayedStatus() {
      return (this as any).translateStatus((this as any).feature.status);
    },
    availableStatuses(): Array<FeatureStatus> {
      return [FeatureStatus.Draft, FeatureStatus.ReadyToDev, FeatureStatus.Live].filter(s => s !== (this as any).feature.status);
    }
  }
});
</script>

<style scoped>
.feature-status-chip.v-chip {
  color: #FFFFFF;
  margin: 0.2rem;
}
</style>
