<template>
  <div>
    <h1>An error occurred</h1>
    <a :href="$routes.home()">Go back to home page</a>
  </div>
</template>

<script lang="ts">
import Menu from '~/components/Menu.vue';

export default {
  components: {
    Menu
  }
}
</script>

<style scoped>
div {
  margin-top: 5rem;
}
</style>
