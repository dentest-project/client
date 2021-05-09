<template>
  <div class="step" :draggable="mode === $modes.edit" @dragstart.stop="$emit('dragstart', step)" @dragend.stop="$emit('dragend')">
    <deletable-row v-if="mode === $modes.edit" @delete="onDeleteClick">
      <step-form v-if="step.step" :step="step" :available-adverbs="availableAdverbs" @input="onUpdated" />
      <step-search v-else :feature-root-project="featureRootProject" @selected="onStepSelected" />
      <create-table-step-param-dialog v-model="createTableStepParamDialog" @selected="onTableStepParamDimensionsSelected" />
    </deletable-row>
    <step-display v-else :step="step" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import CreateTableStepParamDialog from '~/components/dialogs/CreateTableStepParamDialog.vue';
import DeletableRow from '~/components/DeletableRow.vue';
import StepDisplay from '~/components/StepDisplay.vue';
import StepForm from '~/components/StepForm.vue';
import StepSearch from '~/components/StepSearch.vue';
import createScenarioStepFromStep from '~/helpers/createScenarioStepFromStep';
import getCorrespondingAdverb from '~/helpers/getCorrespondingAdverb';
import {
  isInlineStepParam,
  Mode,
  Project,
  ScenarioStep,
  Step,
  StepAdverb
} from '~/types';

export default Vue.extend({
  components: {
    CreateTableStepParamDialog,
    DeletableRow,
    StepDisplay,
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
    } as PropOptions<Project>
  },
  data() {
    return {
      createTableStepParamDialog: false
    }
  },
  methods: {
    onDeleteClick(): void {
      this.$emit('deleted');
    },
    onUpdated(e: ScenarioStep): void {
      this.$emit('input', e);
    },
    onStepSelected(step: Step): void {
      const scenarioStep = createScenarioStepFromStep(this.step.priority, step);

      this.createTableStepParamDialog = scenarioStep.withTableParam;
      this.$emit('input', scenarioStep.scenarioStep);
    },
    onTableStepParamDimensionsSelected(width: number, height: number) {
      const params = [...this.step.params];

      params[params.findIndex(p => !isInlineStepParam(p))].content = new Array(height + 1).fill(null).map(() => new Array(width + 1).fill(''));

      this.createTableStepParamDialog = false;
      this.$emit('input', {
        ...this.step,
        params
      });
    }
  },
  computed: {
    availableAdverbs(): Array<StepAdverb> {
      return [
        getCorrespondingAdverb((this as any).step.step.type),
        StepAdverb.And,
        StepAdverb.But
      ];
    }
  }
});
</script>
