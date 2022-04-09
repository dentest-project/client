<template>
  <v-main>
    <h1>An error occurred</h1>
    <p>Something we didn't anticipate occurred. Sorry for that :(</p>
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
      title: `An error occurred | Dentest`
    };
  },
})
</script>
