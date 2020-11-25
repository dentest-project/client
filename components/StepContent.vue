<template>
  <div class="step">
    <deletable-row v-if="mode === $modes.edit" @delete="onDeleteClick">
      <v-select class="step-type-select" :items="adverbsSelectItems" :value="step.adverb" solo />
      <v-text-field solo />
    </deletable-row>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import DeletableRow from '~/components/DeletableRow.vue';
import { Mode, ScenarioStep, StepAdverb } from '~/types';

interface SelectItem {
  text: string,
  value: string,
  disabled: boolean
}

export default Vue.extend({
  components: {
    DeletableRow
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
    availableAdverbs: {
      type: Array,
      required: true
    } as PropOptions<Array<StepAdverb>>
  },
  methods: {
    onDeleteClick(): void {
      this.$emit('deleted');
    },
    onTypeChanged(type: string): void {
      this.$emit('input', {
        ...(this as any).step,
        type
      });
    }
  },
  computed: {
    adverbsSelectItems(): Array<SelectItem> {
      const labels = {
        [StepAdverb.Given]: 'Given',
        [StepAdverb.When]: 'When',
        [StepAdverb.Then]: 'Then',
        [StepAdverb.And]: 'And',
        [StepAdverb.But]: 'But'
      } as Record<StepAdverb, string>;

      return (this as any).availableAdverbs.map((a: StepAdverb): SelectItem => ({
        text: labels[a],
        value: a,
        disabled: false
      }));
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
