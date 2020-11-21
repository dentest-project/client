<template>
  <form v-if="mode === modes.edit" @submit.prevent="onSubmit">
      <input type="text" :value="value" :placeholder="label" autofocus @input="onChanged" @blur="onSubmit" />
  </form>
  <h1 v-else @click="switchToEdit">{{ value }}</h1>
</template>

<script lang="ts">
import Vue from 'vue';

enum Mode {
  View,
  Edit
}

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
    onChanged(e: boolean): void {
      this.$emit('input', e.target.value);
    }
  },
  computed: {
    modes: () => ({
      view: Mode.View,
      edit: Mode.Edit
    })
  }
});
</script>

<style scoped>
h1:hover {
  background-color: #eeeeee;
  cursor: pointer;
}
input[type=text] {
  padding: 1rem;
  font-size: 2em;
  font-weight: bold;
  border: 1px solid #aaaaaa;
  width: 100%;
}
</style>
