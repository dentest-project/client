<template>
  <el-card shadow="always">
    <template #header>
      <div class="card-header">
        <el-icon><OfficeBuilding /></el-icon>
        <span class="title">{{ organization.name }}</span>
      </div>
    </template>
    <NuxtLink :to="$routes.organization(organization.slug)" class="el-button">See organization</NuxtLink>
  </el-card>
</template>

<script setup lang="ts">
import { OfficeBuilding } from '@element-plus/icons-vue'
import type { Organization } from '~/types'

defineProps<{
  organization: Organization
}>()
</script>

<style scoped>
a {
  text-decoration: none;
}

.title {
  display: inline-block;
  margin-left: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
}
</style>
