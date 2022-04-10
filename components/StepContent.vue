<template>
  <div
    ref="el"
    class="step"
    :draggable="mode === $modes.edit"
    @dragstart="$emit('dragstarted', step)"
    @dragend="$emit('dragended')"
    @dragleave="onDragLeave"
  >
    <deletable-row v-if="mode === $modes.edit" @delete="onDeleteClick">
      <step-form
        :step="step"
        :available-adverbs="availableAdverbs"
        @input="onUpdated"
      />
    </deletable-row>
    <step-display v-else :step="step" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import DeletableRow from '~/components/DeletableRow.vue'
import StepDisplay from '~/components/StepDisplay.vue'
import StepForm from '~/components/StepForm.vue'
import getCorrespondingAdverb from '~/helpers/getCorrespondingAdverb'
import { Mode, ScenarioStep, StepAdverb } from '~/types'

export default Vue.extend({
  components: {
    DeletableRow,
    StepDisplay,
    StepForm,
  },
  model: {
    prop: 'step',
  },
  props: {
    mode: {
      type: Number,
      required: true,
    } as PropOptions<Mode>,
    step: {
      type: Object,
      required: true,
    } as PropOptions<ScenarioStep>,
  },
  methods: {
    onDeleteClick(): void {
      this.$emit('deleted')
    },
    onDragLeave(e: DragEvent): void {
      const { top, bottom } = (this.$refs.el as Element).getBoundingClientRect()

      if (e.y < top) {
        this.$emit('wentahead')
      } else if (e.y > bottom) {
        this.$emit('wentbelow')
      }
    },
    onUpdated(e: ScenarioStep): void {
      this.$emit('input', e)
    },
  },
  computed: {
    availableAdverbs(): Array<StepAdverb> {
      return [
        getCorrespondingAdverb((this as any).step.step.type),
        StepAdverb.And,
        StepAdverb.But,
      ]
    },
  },
})
</script>

<style scoped>
.step * {
  pointer-events: none;
}
</style>
