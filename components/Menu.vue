<template>
  <v-app-bar class="app-bar" :color="transparent ? 'transparent' : $colors.primary" :flat="transparent" dark app>
    <logo />
    <v-toolbar-title v-if="!transparent">
      <nuxt-link :to="$routes.home()">
        Entest
      </nuxt-link>
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
import Logo from '~/components/Logo.vue';

export default Vue.extend({
  components: { Logo },
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
.app-bar a {
  text-decoration: none;
  color: #ffffff;
}

.menu-logout {
  font-weight: bold;
}
</style>
