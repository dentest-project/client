<template>
  <el-button>
    <el-icon><Rank /></el-icon>
    <span class="label">Move</span>
  </el-button>
</template>

<script setup lang="ts">
import { Rank } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
