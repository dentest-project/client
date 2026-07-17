<template>
  <form @submit.prevent="onSubmit">
    <el-input
      v-model="subject"
      placeholder="Username or email"
      required
    />
    <el-input
      v-model="password"
      placeholder="Password"
      type="password"
      maxlength="64"
      show-password
      required
    />
    <el-input type="submit" value="Login" />
  </form>
</template>

<script setup lang="ts">
import type { LoginParams } from '~/api/ketal'

const subject = ref('')
const password = ref('')

const emit = defineEmits<{
  submit: [value: LoginParams]
}>()

const onSubmit = () => {
  emit('submit', {
    subject: subject.value,
    password: password.value,
  })
}
</script>

<style scoped>
form .el-input {
  margin: 0.5rem;
  display: block;
}
</style>
