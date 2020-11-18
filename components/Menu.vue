<template>
  <v-app-bar :color="$colors.primary" dark>
    <Logo />
    <v-toolbar-title>
      <nuxt-link to="/">
        Entest
      </nuxt-link>
    </v-toolbar-title>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import Logo from '~/components/Logo.vue';

export default Vue.extend({
  components: { Logo }
});
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
