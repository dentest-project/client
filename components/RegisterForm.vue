<template>
  <form @submit.prevent="onSubmit">
    <el-input
      v-model="username"
      placeholder="Username"
      required
    />
    <el-input
      v-model="email"
      type="email"
      placeholder="Email"
      required
    />
    <el-input
      v-model="password"
      type="text"
      minlength="8"
      show-word-limit
      show-password
      placeholder="Password"
      required
    />
    <el-input type="submit" value="Register" />
  </form>
</template>

<script setup lang="ts">
const username = ref('')
const email = ref('')
const password = ref('')

const emit = defineEmits(['submit'])

const onSubmit = () => {
  emit('submit', {
    username: username.value,
    email: email.value,
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
