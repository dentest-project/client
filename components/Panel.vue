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

.panel--bold {
  font-weight: bold;
}
</style>
