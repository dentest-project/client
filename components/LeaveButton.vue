<template>
  <el-popconfirm
    title="Are you sure?"
    :icon="WarningFilled"
    icon-color="#f56c6c"
    :width="300"
    @confirm="$emit('left')"
  >
    <template #reference>
      <el-button type="danger" plain>
        <el-icon><TakeawayBox /></el-icon>
        <span class="label">{{ label }}</span>
      </el-button>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
import { TakeawayBox, WarningFilled } from '@element-plus/icons-vue'

defineProps<{
  label: string
}>()

defineEmits(['left'])
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
