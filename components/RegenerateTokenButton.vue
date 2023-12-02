<template>
  <el-button>
    <el-icon><RefreshLeft /></el-icon>
    <span class="label">Regenerate</span>
  </el-button>
</template>

<script setup lang="ts">
import { RefreshLeft } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
