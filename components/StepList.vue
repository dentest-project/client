<template>
  <div>
    <step-content
      v-for="(step, i) in steps" :key="i"
      :class="{ 'step-list--dragged': i === draggedElementId}"
      :step="step"
      :mode="mode"
      @dragstarted="s => onDragStepStart(i, s)"
      @dragended="onDragStepEnd"
      @wentahead="() => onWentAhead(i)"
      @wentbelow="() => onWentBelow(i)"
      @input="(e) => onUpdated(i, e)"
      @deleted="() => onDeleted(i)"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import AddButton from '~/components/buttons/AddButton.vue'
import StepContent from '~/components/StepContent.vue'
import { Mode, ScenarioStep } from '~/types'

export default Vue.extend({
  components: {
    AddButton,
    StepContent,
  },
  model: {
    prop: 'steps',
  },
  props: {
    mode: {
      type: Number,
      required: true,
    } as PropOptions<Mode>,
    steps: {
      type: Array,
      required: true,
    } as PropOptions<Array<ScenarioStep>>,
  },
  data() {
    return {
      draggedElementId: null as null | number,
      draggedElement: null as null | ScenarioStep
    }
  },
  methods: {
    fixPriorities(steps: Array<ScenarioStep>): Array<ScenarioStep> {
      return steps.map((step, i) => ({ ...step, priority: i }))
    },
    onDeleted(i: number) {
      const steps = [...this.steps]

      steps.splice(i, 1)
      this.$emit('input', this.fixPriorities(steps))
    },
    onDragStepEnd() {
      this.draggedElement = null
      this.draggedElementId = null
    },
    onDragStepStart(i: number, step: ScenarioStep) {
      this.draggedElement = step
      this.draggedElementId = i
    },
    onDrop(i: number) {
      const steps = [...this.steps]

      if (
        i !== this.draggedElementId &&
        this.draggedElementId !== null &&
        this.draggedElement !== null
      ) {
        steps.splice(this.draggedElementId, 1)
        steps.splice(
          this.draggedElementId < i ? i - 1 : i,
          0,
          this.draggedElement
        )
      }

      this.$emit('input', this.fixPriorities(steps))
    },
    onUpdated(i: number, step: ScenarioStep) {
      const steps = [...this.steps]

      steps[i] = step
      this.$emit('input', this.fixPriorities(steps))
    },
    onWentAhead(i: number) {
      if (i === this.draggedElementId) {
        return
      }

      const steps = [...this.steps]

      steps.splice(this.draggedElementId ?? 0, 1)
      steps.splice(i, 0, this.steps[this.draggedElementId ?? 0])
      this.draggedElementId = i

      this.$emit('input', this.fixPriorities(steps))
    },
    onWentBelow(i: number) {
      if (i === this.draggedElementId) {
        return
      }

      console.log(i, this.draggedElementId)

      const steps = [...this.steps]

      steps.splice(this.draggedElementId ?? 0, 1)
      steps.splice(i, 0, this.steps[this.draggedElementId ?? 0])
      this.draggedElementId = i

      this.$emit('input', this.fixPriorities(steps))
    }
  }
})
</script>

<style scoped>
.step {
  margin-top: 1rem;
}
.step-list--dragged {
  background-color: #a4b0be;
}
</style>
