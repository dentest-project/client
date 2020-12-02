<template>
  <div class="step">
    <deletable-row v-if="mode === $modes.edit" @delete="onDeleteClick">
      <step-form v-if="step.step" :step="step" :available-adverbs="availableAdverbs" @input="onUpdated" />
      <step-search v-else :feature-root-project="featureRootProject" @selected="onStepSelected" />
    </deletable-row>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import DeletableRow from '~/components/DeletableRow.vue';
import StepForm from '~/components/StepForm.vue';
import StepSearch from '~/components/StepSearch.vue';
import {
  FeatureRootProject,
  InlineStepParam,
  Mode, MultilineStepParam,
  ScenarioStep,
  Step,
  StepAdverb,
  StepParam,
  StepParamType,
  StepPartType,
  StepType, TableStepParam
} from '~/types';

export default Vue.extend({
  components: {
    DeletableRow,
    StepForm,
    StepSearch
  },
  model: {
    prop: 'step'
  },
  props: {
    mode: {
      type: Number,
      required: true
    } as PropOptions<Mode>,
    step: {
      type: Object,
      required: true
    } as PropOptions<ScenarioStep>,
    featureRootProject: {
      type: Object,
      required: true
    } as PropOptions<FeatureRootProject>
  },
  data() {
    return {
    }
  },
  methods: {
    generateParams(step: Step): Array<StepParam> {
      const params: Array<InlineStepParam | MultilineStepParam | TableStepParam> = step
        .parts
        .filter(p => p.type === StepPartType.Param)
        .map(stepPart => ({
          type: StepParamType.Inline,
          content: stepPart.content ,
          stepPart
        } as InlineStepParam));

      if (step.extraParamType === StepParamType.None) {
        return params;
      }
      if (step.extraParamType === StepParamType.Multiline) {
        params.push({
          type: step.extraParamType,
          content: ''
        });
      } else {
        params.push({
          type: step.extraParamType,
          content: [] as Array<Array<string>>
        });
      }

      return params;
    },
    getCorrespondingAdverb(type: StepType): StepAdverb {
      switch (type) {
        case StepType.Given:
          return StepAdverb.Given;
        case StepType.When:
          return StepAdverb.When;
        case StepType.Then:
          return StepAdverb.Then;
      }
    },
    onDeleteClick(): void {
      this.$emit('deleted');
    },
    onUpdated(e: ScenarioStep): void {
      this.$emit('input', e);
    },
    onStepSelected(step: Step): void {
      this.$emit('input', {
        ...this.step,
        adverb: this.getCorrespondingAdverb(step.type),
        step,
        params: this.generateParams(step)
      });
    }
  },
  computed: {
    availableAdverbs(): Array<StepAdverb> {
      return [
        (this as any).getCorrespondingAdverb((this as any).step.step.type),
        StepAdverb.And,
        StepAdverb.But
      ];
    }
  }
});
</script>

<style scoped>
.step {
  margin-bottom: 2rem;
}
.step-type-select {
  flex-grow: 0;
}
</style>
