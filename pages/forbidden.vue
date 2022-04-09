<template>
  <v-main>
    <h1>Forbidden</h1>
    <p>You don't have access to this page.</p>
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
      title: `You do not have access to this page | Dentest`
    };
  },
})
</script>
