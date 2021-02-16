<template>
  <form>
    <v-sheet elevation="2" class="description" :style="`background-color: ${$colors.lightPrimary}`">
      <editable-textarea v-if="canWrite" :value="feature.description" label="Feature description" @input="onDescriptionChanged" />
      <p v-else class="feature-content-description">{{ feature.description }}</p>
    </v-sheet>
    <scenario-list :scenarios="feature.scenarios" :feature-root-project="feature.rootProject" :can-write="canWrite" @input="onScenariosChanged" />
  </form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import EditableTextarea from '~/components/EditableTextarea.vue';
import ScenarioList from '~/components/ScenarioList.vue';
import { Feature, Scenario } from '~/types';

export default Vue.extend({
  components: {
    EditableTextarea,
    ScenarioList
  },
  model: {
    prop: 'feature'
  },
  props: {
    canWrite: {
      type: Boolean,
      required: true
    },
    feature: {
      type: Object,
      required: true
    } as PropOptions<Feature>
  },
  methods: {
    onDescriptionChanged(description: string): void {
      this.$emit('input', {
        ...this.feature,
        description
      });
    },
    onScenariosChanged(scenarios: Array<Scenario>): void {
      this.$emit('input', {
        ...this.feature,
        scenarios
      })
    }
  }
});
</script>

<style scoped>
.feature-content-description {
  padding: 1rem;
  white-space: pre;
}
</style>
