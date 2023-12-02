<template>
  <el-button>
    <el-icon><CopyDocument /></el-icon>
    <span class="label">Copy</span>
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
