<template>
  <el-card shadow="always" class="DomainEntityCard-card">
    <template #header>
      <div class="DomainEntityCard-header">
        <el-icon><Grid /></el-icon>
        <span class="DomainEntityCard-title">{{ title }}</span>
      </div>
    </template>
    <p class="DomainEntityCard-description">{{ description }}</p>
    <NuxtLink :to="to" class="el-button">Open entity</NuxtLink>
  </el-card>
</template>

<script setup lang="ts">
import { Grid } from '@element-plus/icons-vue'
import type { DomainEntity } from '~/types'

const props = defineProps<{
  entity: DomainEntity,
  to: string
}>()

const title = computed(() => props.entity.name.trim().length > 0 ? props.entity.name : 'Untitled entity')
const description = computed(() => props.entity.description.trim().length > 0 ? props.entity.description : 'No description yet.')
</script>

<style scoped>
.DomainEntityCard-card {
  height: 100%;
  margin-bottom: 1rem;
}

.DomainEntityCard-header {
  align-items: center;
  display: flex;
}

.DomainEntityCard-description {
  line-height: 1.5;
  margin: 0;
  min-height: 4.5rem;
  padding-bottom: 1rem;
  white-space: pre-line;
}

.DomainEntityCard-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-left: 1rem;
}

a {
  text-decoration: none;
}
</style>
