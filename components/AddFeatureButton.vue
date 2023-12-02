<template>
  <el-button type="primary">
    <el-icon><DocumentAdd /></el-icon>
    <span class="label">Create a feature</span>
  </el-button>
</template>

<script setup lang="ts">
import { DocumentAdd } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
