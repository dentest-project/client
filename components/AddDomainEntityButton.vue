<template>
  <NuxtLink class="el-button el-button--primary" :to="to">
    <el-icon><Plus /></el-icon>
    <span class="label">Create entity</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

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
