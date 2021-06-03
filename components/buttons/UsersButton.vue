<template>
  <v-btn :to="to" :color="$colors.primary" fab dark x-small title="Users">
    <v-icon>mdi-account-group</v-icon>
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
