<template>
  <div class="step">
    <deletable-row v-if="mode === $modes.edit" @delete="onDeleteClick">
      <v-select v-if="step.step" class="step-type-select" :items="adverbsSelectItems" :value="step.adverb" solo />
      <step-search v-else />
    </deletable-row>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import DeletableRow from '~/components/DeletableRow.vue';
import StepSearch from '~/components/StepSearch.vue';
import { Mode, ScenarioStep, SelectItem, StepAdverb } from '~/types';

export default Vue.extend({
  components: {
    DeletableRow,
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
    availableAdverbs: {
      type: Array,
      required: true
    } as PropOptions<Array<StepAdverb>>
  },
  data() {
    return {
    }
  },
  methods: {
    onDeleteClick(): void {
      this.$emit('deleted');
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
