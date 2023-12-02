<template>
  <el-button type="primary">
    <el-icon><VideoPlay /></el-icon>
    <span class="label">Create a new scenario</span>
  </el-button>
</template>

<script setup lang="ts">
import { VideoPlay } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
