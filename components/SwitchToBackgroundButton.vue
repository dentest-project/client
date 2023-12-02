<template>
  <el-button size="small">
    <el-icon><Icon /></el-icon>
    <span class="label">{{ label }}</span>
  </el-button>
</template>

<script setup lang="ts">
import { Upload, VideoPlay } from '@element-plus/icons-vue'
import { ScenarioType } from '~/types'

const props = defineProps<{
  currentType: ScenarioType
}>()

const label = computed(() => props.currentType === ScenarioType.Background ? 'Turn into scenario' : 'Turn into background')
const Icon = computed(() => props.currentType === ScenarioType.Background ? VideoPlay : Upload)
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
