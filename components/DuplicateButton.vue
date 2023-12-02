<template>
  <el-button size="small">
    <el-icon><CopyDocument /></el-icon>
    <span class="label">Duplicate</span>
  </el-button>
</template>

<script setup lang="ts">
import { CopyDocument } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
