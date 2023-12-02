<template>
  <form @submit.prevent="onSubmit">
    <el-input
      v-model="email"
      type="email"
      placeholder="Email"
      required
    />
    <el-input type="submit" value="Send me an email to reset my password" />
  </form>
</template>

<script setup lang="ts">
const email = ref('')
const emit = defineEmits(['submit'])

const onSubmit = () => {
  emit('submit', {
    email: email.value,
  })
}
</script>

<style scoped>
form .el-input {
  margin: 0.5rem;
}
</style>
