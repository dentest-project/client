<template>
  <div>
    <step-content
      v-for="(step, i) in steps"
      :step="step"
      :mode="mode"
      :available-adverbs="getAvailableAdverbsForStep(i)"
      :feature-root-project="featureRootProject"
      :key="i"
      @input="e => onUpdated(i, e)"
      @deleted="() => onDeleted(i)"
    />
    <add-button v-if="mode === $modes.edit" @click="onAdd" title="Add step" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import AddButton from '~/components/buttons/AddButton.vue';
import StepContent from '~/components/StepContent.vue';
import {
  FeatureRootProject,
  InlineStepParam,
  Mode,
  MultilineStepParam,
  ScenarioStep,
  StepAdverb,
  TableStepParam
} from '~/types';

export default Vue.extend({
  components: {
    AddButton,
    StepContent
  },
  model: {
    prop: 'steps'
  },
  props: {
    mode: {
      type: Number,
      required: true
    } as PropOptions<Mode>,
    steps: {
      type: Array,
      required: true
    } as PropOptions<Array<ScenarioStep>>,
    featureRootProject: {
      type: Object,
      required: true
    } as PropOptions<FeatureRootProject>
  },
  methods: {
    getAvailableAdverbsForStep(id: number): Array<StepAdverb> {
      if (id === 0) {
        return [StepAdverb.Given, StepAdverb.When];
      }

      return [StepAdverb.Given, StepAdverb.When, StepAdverb.Then, StepAdverb.And, StepAdverb.But];
    },
    onAdd(): void {
      this.$emit('input', [
        ...this.steps,
        {
          adverb: StepAdverb.Given,
          params: [] as Array<InlineStepParam | MultilineStepParam | TableStepParam>
        }
      ]);
    },
    onDeleted(i: number) {
      const steps = [...this.steps];

      steps.splice(i, 1);
      this.$emit('input', steps);
    },
    onUpdated(i: number, step: ScenarioStep) {
      const steps = [...this.steps];

      steps[i] = step;
      this.$emit('input', steps);
    }
  }
});
</script>
