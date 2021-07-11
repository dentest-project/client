<template>
  <v-chip :color="tag.color" :text-color="textColor">
    {{ tag.name }}
  </v-chip>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import blackOrWhite from '~/helpers/blackOrWhite'
import { Tag } from '~/types'

export default Vue.extend({
  props: {
    tag: {
      type: Object,
      required: true,
    } as PropOptions<Tag>,
  },
  computed: {
    textColor(): string {
      return blackOrWhite((this as any).tag.color)
    },
  },
})
</script>
