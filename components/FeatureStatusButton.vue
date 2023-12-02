<template>
  <el-button :type="statusColor" title="Change feature status" plain>
    {{ statusText }}
  </el-button>
</template>

<script setup lang="ts">
import { FeatureStatus } from '~/types'

const props = defineProps<{
  status: FeatureStatus
}>()

const statusColor = computed(() => {
  if (props.status === FeatureStatus.Draft) {
    return 'info'
  }

  return props.status === FeatureStatus.ReadyToDev ? 'warning' : 'success'
})

const statusText = computed(() => props.status.toLocaleUpperCase().replace(/_/g, ' '))
</script>
