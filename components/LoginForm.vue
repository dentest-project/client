<template>
  <form @submit.prevent="onSubmit">
    <el-input v-model="username" placeholder="Username" required />
    <el-input v-model="password" placeholder="Password" type="password" show-password required />
    <el-input type="submit" value="Login" />
  </form>
</template>

<script setup lang="ts">
const username = ref('')
const password = ref('')

const emit = defineEmits(['submit'])

const onSubmit = () => {
  emit('submit', {
    username: username.value,
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
