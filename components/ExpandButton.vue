<template>
  <el-button type="default" plain size="small">
    <el-icon><FullScreen /></el-icon>
    <span class="label">
      Expand
    </span>
  </el-button>
</template>

<script setup lang="ts">
import { FullScreen } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
