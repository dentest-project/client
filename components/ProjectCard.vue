<template>
  <el-card shadow="always">
    <template #header>
      <div class="card-header">
        <el-icon><DataBoard /></el-icon>
        <span class="title">{{ project.title }}</span>
        <el-tag :type="visibilityColor">{{ visibilityText }}</el-tag>
      </div>
    </template>
    <NuxtLink :to="$routes.project(project)" class="el-button">See project</NuxtLink>
  </el-card>
</template>

<script setup lang="ts">
import { DataBoard } from '@element-plus/icons-vue'
import { type Project, ProjectVisibility } from '~/types'

const props = defineProps<{
  project: Project
}>()

const visibilityColor = computed(() => {
  if (props.project.visibility === ProjectVisibility.Public) {
    return 'success'
  }

  return props.project.visibility === ProjectVisibility.Internal ? 'warning' : 'info'
})

const visibilityText = computed(() => props.project.visibility.toLocaleUpperCase())
</script>

<style scoped>
a {
  text-decoration: none;
}

.title {
  display: inline-block;
  margin: 0 1rem;
}

.card-header {
  display: flex;
  align-items: center;
}
</style>
