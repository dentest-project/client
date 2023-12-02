<template>
  <el-button size="small">
    <el-icon><Scissor /></el-icon>
    <span class="label">Turn selection into parameter</span>
  </el-button>
</template>

<script setup lang="ts">
import { Scissor } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
}
</style>
