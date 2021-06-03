<template>
  <v-btn :to="to" small outlined dark>
    <slot />
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    to: {
      type: String,
      required: true,
    },
  },
})
</script>
