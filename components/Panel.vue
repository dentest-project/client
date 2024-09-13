<template>
  <div :class="['panel', `panel--${type}`, bold && ['panel--bold']]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'info' | 'warning'
  bold?: boolean
}>()
</script>

<style>
.panel {
  padding: 1rem;
  border-radius: 4px;
  margin: 20px 0;
}

.panel.panel--warning {
  background-color: var(--el-color-warning-light-9);
  border-left: 5px solid var(--el-color-warning);
}

.panel.panel--info {
  background-color: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary);
  border-left: 5px solid var(--el-color-primary);
}

.panel--bold {
  font-weight: bold;
}
</style>
