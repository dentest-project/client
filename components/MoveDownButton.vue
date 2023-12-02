<template>
  <el-button size="small">
    <el-icon><ArrowDown /></el-icon>
    <span class="label">Move down</span>
  </el-button>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
