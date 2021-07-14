<template>
  <form @submit.prevent="onSubmit">
    <v-text-field
      v-model="email"
      label="Email"
      :rules="[rules.email, rules.required]"
    />
    <v-btn type="submit" :color="$colors.primary" dark>Send me an email to reset my password</v-btn>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      email: '',
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
      },
    }
  },
  methods: {
    onSubmit(): void {
      this.$emit('submit', {
        email: this.email
      })
    },
  },
})
</script>
