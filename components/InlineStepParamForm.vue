<template>
  <v-text-field :value="param.content" @input="onUpdated" solo />
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
        content,
      })
    },
  },
})
</script>
