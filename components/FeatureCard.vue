<template>
  <el-card shadow="always" type="primary">
    <template #header>
      <div class="card-header">
        <el-icon><Document /></el-icon>
        <span class="title">{{ feature.title }}</span>
      </div>
    </template>
    <NuxtLink :to="$routes.feature(path, feature)" class="el-button el-button--primary">Open feature</NuxtLink>
    <MoveButton v-if="canWrite" @click="moveDialog = true" />
  </el-card>
  <MoveFeatureDialog v-if="canWrite" v-model="moveDialog" :feature="feature" :path="path" @moved="$emit('moved')" />
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
import type { Path, PathFeature } from '~/types'

const props = defineProps<{
  path: Path,
  feature: PathFeature,
  canWrite: boolean
}>()

const moveDialog = ref(false)

defineEmits(['moved'])
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
