<template>
  <form @submit.prevent="onSubmit">
    <el-input
      v-model="subject"
      maxlength="255"
      placeholder="Username or email"
      required
    />
    <el-input type="submit" value="Send me an email to reset my password" />
  </form>
</template>

<script setup lang="ts">
import type { RequestPasswordResetParams } from '~/api/ketal'

const subject = ref('')

const emit = defineEmits<{
  submit: [value: RequestPasswordResetParams]
}>()

const onSubmit = () => {
  const value: RequestPasswordResetParams = { subject: subject.value }

  emit('submit', value)
}
</script>

<style scoped>
form .el-input {
  margin: 0.5rem;
}
</style>
