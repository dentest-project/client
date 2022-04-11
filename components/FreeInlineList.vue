<template>
  <v-combobox
    :value="value"
    placeholder="Param choices"
    :multiple="true"
    hint="Press Enter to create an entry"
    small-chips
    @keydown.enter.prevent.stop="onEnterPressed"
    @input="e => $emit('input', e)"
  />
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  model: {
    prop: 'value',
  },
  props: {
    value: {
      type: Array,
      required: true,
    } as PropOptions<Array<String>>,
  },
  data() {
    return {
      activated: false,
    }
  },
  methods: {
    onEnterPressed(e: InputEvent) {
      this.$emit('input', [...this.value, (e.target as HTMLInputElement).value])
    }
  },
})
</script>
