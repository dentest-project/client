<template>
  <v-app-bar class="app-bar" :color="$colors.primary" dark app>
    <Logo />
    <v-toolbar-title>
      <nuxt-link to="/">
        Entest
      </nuxt-link>
    </v-toolbar-title>
    <v-spacer />
    <div v-if="$auth.loggedIn">
      <span>{{ $auth.user.username }}</span>
      <a class="menu-logout" href="#" @click.prevent="logout">Log out</a>
    </div>
    <nuxt-link v-else to="/login">Log in</nuxt-link>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import Logo from '~/components/Logo.vue';

export default Vue.extend({
  components: { Logo },
  methods: {
    async logout() {
      await this.$auth.logout();
    },
  }
});
</script>

<style scoped>
.app-bar a {
  text-decoration: none;
  color: #ffffff;
}

.menu-logout {
  font-weight: bold;
}
</style>
