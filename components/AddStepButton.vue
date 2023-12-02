<template>
  <el-button type="primary">
    <el-icon><EditPen /></el-icon>
    <span class="label">Create a step</span>
  </el-button>
</template>

<script setup lang="ts">
import { EditPen } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
