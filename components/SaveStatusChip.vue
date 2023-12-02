<template>
  <el-tag :type="statusColor" size="large" class="SaveStatusChip" :title="statusText">
    <div class="SaveStatusChip-container">
      <el-icon :class="status === SaveStatus.Saving ? 'is-loading' : ''">
        <Icon />
      </el-icon>
      <span class="SaveStatusChip-label">
        {{ statusText }}
      </span>
    </div>
  </el-tag>
</template>

<script setup lang="ts">
import { Checked, Failed, Loading } from '@element-plus/icons-vue'
import { SaveStatus } from '~/types'

const props = defineProps<{
  status: SaveStatus
}>()

const statusColor = computed(() => {
  if (props.status === SaveStatus.NotSaved) {
    return 'info'
  }

  return props.status === SaveStatus.Saving ? 'warning' : 'success'
})

const statusText = computed(() => {
  const out = props.status.replace(/_/g, ' ')

  return out[0].toUpperCase() + out.slice(1).toLowerCase()
})

const Icon = computed(() => {
  if (props.status === SaveStatus.NotSaved) {
    return Failed
  }

  return props.status === SaveStatus.Saving ? Loading : Checked
})
</script>

<style>
button + .SaveStatusChip {
  margin: 0 12px;
}

.SaveStatusChip-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.SaveStatusChip-label {
  padding-left: 0.3rem;
}
</style>
