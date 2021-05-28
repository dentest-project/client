<template>
  <v-app-bar class="app-bar" :color="transparent ? 'transparent' : $colors.primary" :flat="transparent" dark app>
    <logo v-if="transparent" />
    <bar-logo v-else />
    <v-toolbar-title>
      <nuxt-link v-if="$route.path !== '/'" :to="$routes.home()">Dentest</nuxt-link>
      <h1 v-else>Dentest</h1>
    </v-toolbar-title>
    <v-spacer />
    <div v-if="$auth.loggedIn">
      <span>{{ $auth.user.username }}</span>
      <a class="menu-logout" href="#" @click.prevent="logout">Log out</a>
    </div>
    <nuxt-link v-else :to="$routes.login()">Log in</nuxt-link>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import BarLogo from '~/components/logos/BarLogo.vue';
import Logo from '~/components/logos/Logo.vue';

export default Vue.extend({
  components: { BarLogo, Logo },
  props: {
    transparent: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout();
    },
  }
});
</script>

<style scoped>
.app-bar a, .app-bar h1 {
  text-decoration: none;
  color: #ffffff;
  font-size: 1.25rem;
  padding: 0;
}

.menu-logout {
  font-weight: bold;
}
</style>
