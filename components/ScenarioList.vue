<template>
  <div class="scenarios">
    <scenario-content
      v-for="(scenario, i) in scenarios"
      :can-move-up="i > 0 && !(i === 1 && isBackground(scenarios[0]))"
      :can-move-down="i < scenarios.length - 1 && !(i === 0 && isBackground(scenario))"
      :can-write="canWrite"
      :scenario="scenario"
      :backgroundable="i === 0"
      :feature-root-project="featureRootProject"
      :key="i"
      @input="e => onUpdated(i, e)"
      @deleted="() => onDeleted(i)"
      @up="() => onUp(i)"
      @down="() => onDown(i)"
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
    isBackground(scenario: Scenario): boolean {
      return scenario.type === ScenarioType.Background;
    },
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
    },
    onUp(i: number) {
      if (i === 0 || (i === 1 && this.scenarios[0].type === ScenarioType.Background)) {
        return;
      }

      const scenarios = [...this.scenarios];
      const previousScenario = scenarios[i - 1];

      scenarios[i - 1] = scenarios[i];
      scenarios[i] = previousScenario;

      this.$emit('input', scenarios);
    },
    onDown(i: number) {
      if (i === this.scenarios.length - 1 || (i === 0 && this.scenarios[i].type === ScenarioType.Background)) {
        return;
      }

      const scenarios = [...this.scenarios];
      const nextScenario = scenarios[i + 1];

      scenarios[i + 1] = scenarios[i];
      scenarios[i] = nextScenario;

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
