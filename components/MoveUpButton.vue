<template>
  <el-button size="small">
    <el-icon><ArrowUp /></el-icon>
    <span class="label">Move up</span>
  </el-button>
</template>

<script setup lang="ts">
import { ArrowUp } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
