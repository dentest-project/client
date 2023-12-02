<template>
  <form @submit.prevent="onSubmit">
    <el-input
      v-model="password"
      placeholder="New password"
      type="password"
      minlength="8"
      show-password
      show-word-limit
      required
      hint="Please use a minimum of 8 chars"
    />
    <el-input type="submit" value="Reset my password" />
  </form>
</template>

<script setup lang="ts">
const password = ref('')
const emit = defineEmits(['submit'])

const onSubmit = () => {
  emit('submit', {
    password: password.value,
  })
}
</script>

<style scoped>
form .el-input {
  margin: 0.5rem;
}
</style>
