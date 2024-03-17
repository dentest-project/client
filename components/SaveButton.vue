<template>
  <el-button type="primary" plain :size="size ?? 'default'" :disabled="disabled ?? false">
    <el-icon><Promotion /></el-icon>
    <span class="label">{{ label }}</span>
  </el-button>
</template>

<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'

defineProps<{
  label: string
  size?: 'small' | 'large'
  disabled?: boolean
}>()
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
