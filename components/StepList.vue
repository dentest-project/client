<template>
  <div>
    <div v-for="(step, i) in steps" :key="i">
      <div
        v-if="mode === $modes.edit && draggedElement && draggedElementId !== i && draggedElementId !== i - 1"
        class="step-list-drop-target"
        :class="{ 'step-list-drop-target--over': i === hoveredTargetId }"
        @dragover.prevent="onDragOver(i)"
        @dragleave.prevent="onDragLeave"
        @drop="onDrop(i)"
      />
      <step-content
        :step="step"
        :mode="mode"
        @dragstart="e => onDragStepStart(i, e)"
        @dragend="onDragStepEnd"
        @input="e => onUpdated(i, e)"
        @deleted="() => onDeleted(i)"
      />
      <div
        v-if="i === steps.length - 1 && mode === $modes.edit && draggedElement && draggedElementId !== i"
        class="step-list-drop-target"
        :class="{ 'step-list-drop-target--over': i + 1 === hoveredTargetId }"
        @dragover.prevent="onDragOver(i + 1)"
        @drop="onDrop(i + 1)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import AddButton from '~/components/buttons/AddButton.vue';
import StepContent from '~/components/StepContent.vue';
import {
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
    } as PropOptions<Array<ScenarioStep>>
  },
  data() {
    return {
      draggedElementId: null as null | number,
      draggedElement: null as null | ScenarioStep,
      hoveredTargetId: null as null | number
    };
  },
  methods: {
    fixPriorities(steps: Array<ScenarioStep>): Array<ScenarioStep> {
      return steps.map((step, i) => ({ ...step, priority: i }));
    },
    onDeleted(i: number) {
      const steps = [...this.steps];

      steps.splice(i, 1);
      this.$emit('input', this.fixPriorities(steps));
    },
    onDragLeave() {
      this.hoveredTargetId = null;
    },
    onDragOver(i: number) {
      if (this.draggedElementId === null) {
        return;
      }
      if (i !== this.draggedElementId && i !== this.draggedElementId + 1) {
        this.hoveredTargetId = i;
      }
    },
    onDragStepEnd() {
      this.draggedElement = null;
      this.draggedElementId = null;
      this.hoveredTargetId = null;
    },
    onDragStepStart(i: number, step: ScenarioStep) {
      this.draggedElement = step;
      this.draggedElementId = i;
    },
    onDrop(i:number) {
      const steps = [...this.steps];

      if (i !== this.draggedElementId && this.draggedElementId !== null && this.draggedElement !== null) {
        steps.splice(this.draggedElementId, 1);
        steps.splice(this.draggedElementId < i ? i - 1 : i, 0, this.draggedElement);
      }

      this.$emit('input', this.fixPriorities(steps));
    },
    onUpdated(i: number, step: ScenarioStep) {
      const steps = [...this.steps];

      steps[i] = step;
      this.$emit('input', this.fixPriorities(steps));
    }
  }
});
</script>

<style scoped>
.step-list-drop-target {
  width: 100%;
  height: 3rem;
  border: 2px dashed rgba(150, 150, 150, 0.1);
  background-color: rgba(150, 150, 150, 0.3);
  margin: 1rem 0;
  box-sizing: border-box;
}
.step-list-drop-target.step-list-drop-target--over {
  border: 3px dashed rgba(150, 150, 150, 0.1);
  background-color: rgba(0, 150, 0, 0.3);
}
.step {
  margin-top: 1rem;
}
</style>
