<template>
  <el-button>
    <el-icon><Download /></el-icon>
    <span class="label">Pull feature</span>
  </el-button>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
