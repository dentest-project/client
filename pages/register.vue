<template>
  <main>
    <h1>Register</h1>
    <register-form @submit="onSubmit" />
    <div class="register-switch-to-login">
      <nuxt-link to="/login">Already have an account? Log in instead ;)</nuxt-link>
    </div>
    <v-snackbar v-model="registeredSnackbarOpened" :color="$colors.success">Welcome ;)</v-snackbar>
    <v-snackbar v-model="registrationConflictErrorSnackbarOpened" :color="$colors.error">This email or username is already existing. Try to login instead.</v-snackbar>
    <v-snackbar v-model="registrationErrorSnackbarOpened" :color="$colors.error">An error occurred while registering</v-snackbar>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import RegisterForm from '~/components/RegisterForm.vue';
import { Register } from '~/types';

export default Vue.extend({
  auth: 'guest',
  components: { RegisterForm },
  data: function () {
    return {
      registeredSnackbarOpened: false,
      registrationErrorSnackbarOpened: false,
      registrationConflictErrorSnackbarOpened: false
    }
  },
  methods: {
    async onSubmit(data: Register): Promise<void> {
      try {
        await this.$api.register(data, this.$axios);
        this.registeredSnackbarOpened = true;
        await this.$auth.loginWith('local', { data: { username: data.username, password: data.password } });
        setTimeout(() => { this.$router.push('/'); }, 2000);
      } catch (error) {
        if (error.response.status === 409) {
          this.registrationConflictErrorSnackbarOpened = true;
        } else {
          this.registrationErrorSnackbarOpened = true;
        }
      }
    }
  }
});
</script>

<style scoped>
.register-switch-to-login {
  margin-top: 2rem;
  text-align: center;
  width: 100%;
}
</style>
