<template>
  <v-main>
    <h1 v-if="isRequest">Password forgotten</h1>
    <h1 v-else>Reset password</h1>

    <reset-password-request-form v-if="isRequest" @submit="onRequestSubmit" />
    <reset-password-form v-else @submit="onSubmit" />

    <v-snackbar v-model="requestedSnackbarOpened" :color="$colors.success">
      If the address exists on Dentest, an email has been sent to it with a link
      for password reset
    </v-snackbar>
    <v-snackbar v-model="resetSnackbarOpened" :color="$colors.success">
      Your password has been successfully reset!
    </v-snackbar>
    <v-snackbar v-model="resetErrorSnackbarOpened" :color="$colors.error"
      >We couldn't reset your password</v-snackbar
    >
    <v-snackbar v-model="errorSnackbarOpened" :color="$colors.error"
      >An error occurred</v-snackbar
    >
  </v-main>
</template>

<script lang="ts">
import Vue from 'vue'
import ResetPasswordForm from '~/components/ResetPasswordForm.vue'
import ResetPasswordRequestForm from '~/components/ResetPasswordRequestForm.vue'
import { ResetPasswordRequest } from '~/types'

interface ResetPasswordFormOutput {
  password: string
}

export default Vue.extend({
  auth: 'guest',
  components: { ResetPasswordForm, ResetPasswordRequestForm },
  data: function () {
    return {
      requestedSnackbarOpened: false,
      resetSnackbarOpened: false,
      resetErrorSnackbarOpened: false,
      errorSnackbarOpened: false,
    }
  },
  methods: {
    async onRequestSubmit(data: ResetPasswordRequest): Promise<void> {
      try {
        await this.$api.resetPasswordRequest(data, this.$axios)
        this.requestedSnackbarOpened = true
      } catch (error) {
        this.errorSnackbarOpened = true
      }
    },
    async onSubmit(data: ResetPasswordFormOutput): Promise<void> {
      try {
        await this.$api.resetPassword(
          {
            code: this.code,
            newPassword: data.password,
          },
          this.$axios
        )
        this.resetSnackbarOpened = true
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      } catch (error) {
        if (error.response.status === 404) {
          this.resetErrorSnackbarOpened = true
        } else {
          this.errorSnackbarOpened = true
        }
      }
    },
  },
  computed: {
    code(): string {
      const code = this.$route.query.code;

      return typeof code === 'string' ? code : ''
    },
    isRequest(): boolean {
      return !(this as any).$route.query.code
    },
  },
})
</script>
