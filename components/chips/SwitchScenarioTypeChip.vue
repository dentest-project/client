<template>
  <v-chip
    :color="mode === $modes.view ? 'e0e0e0' : $colors.secondary"
    :class="{ 'switch-scenario-type--active': mode === $modes.edit }"
    x-small
    @click="switchType"
  >
    {{ type }}
  </v-chip>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Mode, ScenarioType } from '~/types'

export default Vue.extend({
  model: {
    prop: 'value',
  },
  props: {
    mode: {
      type: Number,
      required: true,
    } as PropOptions<Mode>,
    value: {
      type: String,
      required: true,
    } as PropOptions<ScenarioType>,
  },
  methods: {
    switchType(): void {
      if ((this as any).mode === Mode.Edit) {
        this.$emit(
          'input',
          (this as any).value === ScenarioType.Background
            ? ScenarioType.Regular
            : ScenarioType.Background
        )
      }
    },
  },
  computed: {
    type() {
      return (this as any).value === ScenarioType.Background
        ? 'Background'
        : 'Scenario'
    },
  },
})
</script>

<style scoped>
.switch-scenario-type--active:hover {
  cursor: pointer;
}
</style>
