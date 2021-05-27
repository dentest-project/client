<template>
  <v-app-bar class="app-bar" :color="transparent ? 'transparent' : $colors.primary" :flat="transparent" dark app>
    <logo v-if="transparent" />
    <bar-logo v-else />
    <v-toolbar-title>
      <nuxt-link :to="$routes.home()">
        Dentest
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
.app-bar a {
  text-decoration: none;
  color: #ffffff;
}

.menu-logout {
  font-weight: bold;
}
</style>
