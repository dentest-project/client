<template>
  <el-icon size="large">
    <component :is="icon" />
  </el-icon>
</template>

<script setup lang="ts">
import { CircleClose, Comment, Grid } from '@element-plus/icons-vue'
import { StepParamType } from '~/types'

const props = defineProps<{
  stepParamType: StepParamType
}>()

const icon = computed(() => {
  if (props.stepParamType === StepParamType.None) {
    return CircleClose
  }

  return props.stepParamType === StepParamType.Multiline ? Comment : Grid
})
</script>
