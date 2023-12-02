<template>
  <NuxtLink class="el-button" :to="to">
    <el-icon><UserFilled /></el-icon>
    <span class="label">Administrate users</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue'

defineProps<{
  to: string
}>()
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}

a {
  text-decoration: none;
}
</style>
