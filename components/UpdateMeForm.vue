<template>
  <form @submit.prevent="onSubmit">
    <v-text-field
      v-model="username"
      label="Username"
      :rules="[rules.required]"
    />
    <v-text-field
      v-model="email"
      label="Email"
      :rules="[rules.email, rules.required]"
    />
    <v-text-field
      v-model="password"
      label="Password"
      :rules="[rules.length]"
      type="password"
    />
    <v-btn type="submit" :color="$colors.primary" dark>Update profile</v-btn>
    <v-btn :color="$colors.error" dark @click="onDeleteButtonClicked">Delete account</v-btn>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      username: this.$auth.user.username,
      email: this.$auth.user.email,
      password: '',
      rules: {
        email(value: string): boolean | string {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

          return pattern.test(value) || 'Invalid e-mail.'
        },
        required(value: string): boolean | string {
          if (value) {
            return true
          }

          return 'This field is required'
        },
        length(value: string): boolean | string {
          if (value.length === 0 || value.length >= 8) {
            return true
          }

          return 'This field should be at least 8 characters long'
        }
      },
    }
  },
  methods: {
    onDeleteButtonClicked(): void {
      this.$emit('delete')
    },
    onSubmit(): void {
      this.$emit('submit', {
        username: this.username,
        email: this.email,
        password: this.password,
      })
    },
  },
})
</script>
