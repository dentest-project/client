<template>
  <div>
    <v-app>
      <Menu :transparent="isHomeAndLoggedOut" />
      <v-container v-if="!isHomeAndLoggedOut">
        <Nuxt />
      </v-container>
      <Nuxt v-else />
    </v-app>
  </div>
</template>

<script lang="ts">
import Menu from '~/components/Menu.vue';

export default {
  middleware: 'auth',
  components: {
    Menu
  },
  computed: {
    isHomeAndLoggedOut(): boolean {
      return (this as any).$route.name === 'index' && !(this as any).$auth.loggedIn
    }
  }
}
</script>

<style>
@font-face {
  font-family: 'Nunito';
  src: url("/Nunito-SemiBold.ttf") format("truetype");
}

html {
  font-family:
    'Nunito',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

h1 {
  padding: 1rem 0;
}

h2 {
  padding: 0.5rem 0;
}

.v-textarea.v-text-field--enclosed textarea {
  line-height: initial;
  margin-top: 48px;
}

.v-text-field.v-text-field--enclosed .v-input__slot {
  margin-bottom: 0;
}

.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0;
  height: 0;
  min-height: 0;
}

.theme--light.v-input input {
  color: inherit;
}

.v-application {
  font-family: 'Nunito', sans-serif;
}

.v-application a {
  color: #4834d4;
}

.vjs-value__string {
  color: #2814b4 !important;
  font-weight: bold;
}
.vjs-value__boolean, .vjs-value__number {
  font-weight: bold;
}
.vjs-value__null {
  font-weight: bold;
}
.vjs-comment {
  color: #ffffff !important;
  background-color: #000000;
  font-weight: bold;
  padding: 2px;
}
</style>
