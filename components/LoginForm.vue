<template>
  <form @submit.prevent="onSubmit">
    <v-text-field
      v-model="username"
      label="Username"
      :rules="[rules.required]"
    />
    <v-text-field
      v-model="password"
      label="Password"
      :rules="[rules.required]"
      type="password"
    />
    <v-btn type="submit" :color="$colors.primary" dark>Login</v-btn>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      username: '',
      password: '',
      rules: {
        required(value: string): boolean | string {
          if (value) {
            return true
          }

          return 'This field is required'
        },
      },
    }
  },
  methods: {
    onSubmit(): void {
      this.$emit('submit', {
        username: this.username,
        password: this.password,
      })
    },
  },
})
</script>
