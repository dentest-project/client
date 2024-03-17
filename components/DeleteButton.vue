<template>
  <el-popconfirm
    title="Are you sure?"
    :icon="WarningFilled"
    icon-color="#f56c6c"
    :width="300"
    @confirm="$emit('deleted')"
  >
    <template #reference>
      <el-button type="danger" plain :size="size ?? 'default'" :disabled="disabled ?? false">
        <el-icon><DeleteFilled /></el-icon>
        <span class="label">{{ label }}</span>
      </el-button>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
import { DeleteFilled, WarningFilled } from '@element-plus/icons-vue'

defineProps<{
  label: string,
  size?: 'small' | 'large'
  disabled?: boolean
}>()

defineEmits(['deleted'])
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
