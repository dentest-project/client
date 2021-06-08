<template>
  <v-btn
    :color="$colors.error"
    @click="(e) => $emit('click', e)"
    :title="label"
    elevation="0"
    fab
    dark
    x-small
  >
    <v-icon>mdi-location-exit</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    label: {
      type: String,
      required: true,
    },
  },
})
</script>
