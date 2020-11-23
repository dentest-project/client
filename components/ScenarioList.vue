<template>
  <div class="scenarios">
    <scenario-content
      v-for="(scenario, i) in scenarios"
      :scenario="scenario"
      :backgroundable="i === 0"
      :key="i"
      @input="e => onUpdated(i, e)"
      @deleted="() => onDeleted(i)"
    />
    <add-button @click="onAdd" title="Add scenario" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import AddButton from '~/components/buttons/AddButton.vue';
import ScenarioContent from '~/components/ScenarioContent.vue';
import { Scenario, ScenarioStep, ScenarioType } from '~/types';

export default Vue.extend({
  components: {
    AddButton,
    ScenarioContent
  },
  model: {
    prop: 'scenarios'
  },
  props: {
    scenarios: {
      type: Array,
      required: true
    } as PropOptions<Array<Scenario>>
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
