<template>
  <div>
    <v-text-field v-if="param.stepPart.strategy === 'free'" :value="param.content" @input="onUpdated" solo dense />
    <v-select v-else :items="param.stepPart.choices" :value="param.content" @input="onUpdated" solo dense />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { InlineStepParam } from '~/types'

export default Vue.extend({
  model: {
    prop: 'param',
  },
  props: {
    param: {
      type: Object,
      required: true,
    } as PropOptions<InlineStepParam>,
  },
  methods: {
    onUpdated(content: string): void {
      this.$emit('input', {
        ...this.param,
        content: content,
      })
    },
  }
})
</script>
