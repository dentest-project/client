<template>
  <el-button type="default" plain size="small">
    <el-icon><Minus /></el-icon>
    <span class="label">Minimize</span>
  </el-button>
</template>

<script setup lang="ts">
import { Minus } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
