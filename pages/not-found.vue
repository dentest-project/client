<template>
  <v-main>
    <h1>Not found</h1>
    <p>This page does not exist.</p>
    <p>
      <a :href="$routes.home()">Go to home page</a>
    </p>
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head: function () {
    return {
      title: `This page does not exist | Dentest`
    };
  },
})
</script>
