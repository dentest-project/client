<template>
  <form v-if="mode === $modes.edit" @submit.prevent="onSubmit">
    <input
      type="text"
      :value="value"
      :placeholder="label"
      autofocus
      @input="onChanged"
      @blur="onSubmit"
    />
  </form>
  <h1 v-else @click="switchToEdit">{{ value }}</h1>
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
    onSubmit(e: InputEvent): void {
      const value = (e.currentTarget as HTMLInputElement).value

      if (typeof value === 'undefined' || value.trim() === '') {
        return
      }

      this.mode = Mode.View
      this.$emit('submit', value)
    },
    onChanged(e: InputEvent): void {
      this.$emit('input', (e.currentTarget as HTMLInputElement).value)
    },
  },
})
</script>

<style scoped>
h1:hover {
  background-color: #eeeeee;
  cursor: pointer;
}
input[type='text'] {
  padding: 1rem;
  font-size: 2em;
  font-weight: bold;
  border: 1px solid #aaaaaa;
  width: 100%;
}
</style>
