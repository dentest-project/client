<template>
  <el-button size="small" :disabled="disabled ?? false">
    <el-icon><ArrowDown /></el-icon>
    <span class="label">Move down</span>
  </el-button>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'

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
