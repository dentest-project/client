<template>
  <NuxtLink class="el-button" :to="to">
    <el-icon><Connection /></el-icon>
    <span class="label">Open domain model</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Connection } from '@element-plus/icons-vue'

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
