<template>
  <el-button>
    <el-icon><DataBoard /></el-icon>
    <span class="label">Create a project</span>
  </el-button>
</template>

<script setup lang="ts">
import { DataBoard } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
