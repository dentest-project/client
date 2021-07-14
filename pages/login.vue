<template>
  <v-main>
    <h1>Log in</h1>
    <login-form @submit="onSubmit" />
    <div class="login-switch-to-reset-password">
      <nuxt-link :to="$routes.resetPassword()">Forgot your password?</nuxt-link>
    </div>
    <div class="login-switch-to-register">
      <nuxt-link :to="$routes.register()"
        >Don't have an account yet? Register instead ;)</nuxt-link
      >
    </div>
    <v-snackbar v-model="loginErrorSnackbarOpened" :color="$colors.error"
      >An error occurred</v-snackbar
    >
    <v-snackbar
      v-model="invalidCredentialsErrorSnackbarOpened"
      :color="$colors.error"
      >Invalid credentials</v-snackbar
    >
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import LoginForm from '~/components/LoginForm.vue'
import { Login } from '~/types'

export default Vue.extend({
  components: { LoginForm },
  data: function () {
    return {
      loginErrorSnackbarOpened: false,
      invalidCredentialsErrorSnackbarOpened: false,
    }
  },
  methods: {
    async onSubmit(data: Login): Promise<void> {
      try {
        await this.$auth.loginWith('local', { data })
      } catch (error) {
        if (error.response.status === 401) {
          this.invalidCredentialsErrorSnackbarOpened = true
        } else {
          this.loginErrorSnackbarOpened = true
        }
      }
    },
  },
})
</script>

<style scoped>
.login-switch-to-reset-password {
  margin-top: 2rem;
  text-align: center;
  width: 100%;
}
.login-switch-to-register {
  margin-top: 2rem;
  text-align: center;
  width: 100%;
}
</style>
