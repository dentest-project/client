<template>
  <form v-if="mode === $modes.edit" @submit.prevent="onSubmit">
    <input type="text" :value="value" :placeholder="label" autofocus @input="onChanged" @blur="onSubmit" />
  </form>
  <p v-else @click="switchToEdit">{{ value }}</p>
</template>

<script lang="ts">
import Vue from 'vue';
import { Mode } from '~/types';

interface Data {
  mode: Mode
}

export default Vue.extend({
  model: {
    prop: 'value'
  },
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  data: function (): Data {
    return {
      mode: Mode.View
    }
  },
  methods: {
    switchToEdit (): void {
      this.mode = Mode.Edit;
    },
    onSubmit (): void {
      this.mode = Mode.View
    },
    onChanged(e: InputEvent): void {
      this.$emit('input', (e.target as HTMLTextAreaElement).value);
    }
  }
});
</script>

<style scoped>
h2:hover {
  background-color: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
input[type=text] {
  padding: 0.5rem;
  border: 1px solid #aaaaaa;
  width: 100%;
}
</style>
