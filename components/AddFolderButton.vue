<template>
  <el-button>
    <el-icon><FolderAdd /></el-icon>
    <span class="label">Create a folder</span>
  </el-button>
</template>

<script setup lang="ts">
import { FolderAdd } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
