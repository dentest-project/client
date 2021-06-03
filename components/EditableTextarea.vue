<template>
  <v-textarea
    v-if="mode === $modes.edit"
    :value="value"
    :label="label"
    autofocus
    auto-grow
    filled
    @change="onChanged"
    @blur="onSubmit"
  />
  <p v-else @click="switchToEdit">{{ value }}</p>
</template>

<script lang="ts">
import Vue from 'vue'
import { Mode } from '~/types'

interface Data {
  mode: Mode
}

export default Vue.extend({
  model: {
    prop: 'value',
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data: function (): Data {
    return {
      mode: Mode.View,
    }
  },
  methods: {
    switchToEdit(): void {
      this.mode = Mode.Edit
    },
    onSubmit(): void {
      this.mode = Mode.View
    },
    onChanged(e: string): void {
      this.$emit('input', e)
    },
  },
})
</script>

<style scoped>
p {
  padding: 1rem;
  white-space: pre;
}
p:hover {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
</style>
