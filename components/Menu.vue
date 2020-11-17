<template>
  <v-app-bar :color="$colors.primary" dark>
    <Logo />
    <v-toolbar-title>Entest</v-toolbar-title>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import Logo from '~/components/Logo.vue';

export default Vue.extend({
  components: { Logo }
});
</script>
