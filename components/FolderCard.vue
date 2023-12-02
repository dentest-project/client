<template>
  <el-card shadow="always">
    <template #header>
      <div class="card-header">
        <el-icon><Folder /></el-icon>
        <span class="title">{{ path.path }}</span>
      </div>
    </template>
    <NuxtLink :to="$routes.path(path)" class="el-button el-button--info">Open folder</NuxtLink>
    <MoveButton v-if="canWrite" @click="moveDialog = true" />
  </el-card>
  <MoveFolderDialog v-if="canWrite" v-model="moveDialog" :path="path" :parent="parent" @moved="$emit('moved')" />
</template>

<script setup lang="ts">
import { Folder } from '@element-plus/icons-vue'
import type { Path } from '~/types'

const props = defineProps<{
  path: Path,
  parent: Path,
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
