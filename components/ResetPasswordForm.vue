<template>
  <form @submit.prevent="onSubmit">
    <v-text-field
      v-model="password"
      label="New password"
      :rules="[rules.required]"
      type="password"
    />
    <v-btn type="submit" :color="$colors.primary" dark>Reset my password</v-btn>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
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
        password: this.password,
      })
    },
  },
})
</script>
