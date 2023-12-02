<template>
  <div class="panel" :class="`panel--${type}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'info' | 'warning'
}>()
</script>

<style>
.panel {
  padding: 2rem;
  border-radius: 4px;
  margin: 20px 0;
}

.panel.panel--warning {
  background-color: var(--el-color-warning-light-5);
  border-left: 5px solid var(--el-color-warning);
}

.panel.panel--info {
  background-color: var(--el-color-primary-light-3);
  border-left: 5px solid var(--el-color-primary);
  color: #EEEEEE;
}
</style>
