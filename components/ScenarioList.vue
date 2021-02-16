<template>
  <div class="scenarios">
    <scenario-content
      v-for="(scenario, i) in scenarios"
      :can-write="canWrite"
      :scenario="scenario"
      :backgroundable="i === 0"
      :feature-root-project="featureRootProject"
      :key="i"
      @input="e => onUpdated(i, e)"
      @deleted="() => onDeleted(i)"
    />
    <add-button v-if="canWrite" @click="onAdd" title="Add scenario" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import AddButton from '~/components/buttons/AddButton.vue';
import ScenarioContent from '~/components/ScenarioContent.vue';
import { Project, Scenario, ScenarioStep, ScenarioType } from '~/types';

export default Vue.extend({
  components: {
    AddButton,
    ScenarioContent
  },
  model: {
    prop: 'scenarios'
  },
  props: {
    canWrite: {
      type: Boolean,
      required: true
    },
    scenarios: {
      type: Array,
      required: true
    } as PropOptions<Array<Scenario>>,
    featureRootProject: {
      type: Object,
      required: true
    } as PropOptions<Project>
  },
  methods: {
    onAdd(): void {
      this.$emit('input', [
        ...this.scenarios,
        {
          type: ScenarioType.Regular,
          title: 'Scenario title',
          steps: [] as Array<ScenarioStep>
        }
      ]);
    },
    onDeleted(i: number) {
      const scenarios = [...this.scenarios];

      scenarios.splice(i, 1);
      this.$emit('input', scenarios);
    },
    onUpdated(i: number, scenario: Scenario) {
      const scenarios = [...this.scenarios];

      scenarios[i] = scenario;
      this.$emit('input', scenarios);
    }
  }
});
</script>

<style scoped>
.scenarios {
  margin: 1rem 0;
}
</style>
