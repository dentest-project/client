<template>
  <v-chip :color="outlined ? '#333333' : tag.color" :text-color="textColor" :outlined="outlined" @click="$emit('click', tag)">
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
    outlined: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    textColor(): string {
      return (this as any).outlined ? '#777777' : blackOrWhite((this as any).tag.color);
    },
  },
})
</script>
