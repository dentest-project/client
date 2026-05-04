<template>
  <el-button size="small" :disabled="disabled ?? false">
    <el-icon><ArrowUp /></el-icon>
    <span class="label">Move up</span>
  </el-button>
</template>

<script setup lang="ts">
import { ArrowUp } from '@element-plus/icons-vue'

defineProps<{
  disabled?: boolean
}>()
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
