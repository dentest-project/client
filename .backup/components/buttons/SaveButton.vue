<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.secondary"
    elevation="0"
    fab
    x-small
    :disabled="!enabled"
  >
    <v-icon>mdi-content-save</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    enabled: {
      type: Boolean,
      required: true,
    },
  },
})
</script>
