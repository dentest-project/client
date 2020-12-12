<template>
  <div>
    <v-app>
      <Menu />
      <v-container>
        <Nuxt />
      </v-container>
    </v-app>
  </div>
</template>

<script lang="ts">
import Menu from '~/components/Menu.vue';

export default {
  middleware: 'auth',
  components: {
    Menu
  }
}
</script>

<style>
@font-face {
  font-family: 'Raleway';
  src: url("/Raleway-Medium.ttf") format("truetype");
}

html {
  font-family:
    'Raleway',
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
  padding: 1rem;
}

h2 {
  padding: 0.5rem;
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
  font-family: "Raleway", sans-serif;
}

.v-application a {
  color: #4834d4;
}

</style>
