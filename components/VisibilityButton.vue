<template>
  <el-button :type="visibilityColor" title="Change visibility" plain>
    {{ visibilityText }}
  </el-button>
</template>

<script setup lang="ts">
import { ProjectVisibility } from '~/types'

const props = defineProps<{
  visibility: ProjectVisibility
}>()

const visibilityColor = computed(() => {
  if (props.visibility === ProjectVisibility.Public) {
    return 'success'
  }

  return props.visibility === ProjectVisibility.Internal ? 'warning' : 'info'
})

const visibilityText = computed(() => props.visibility.toLocaleUpperCase())
</script>
