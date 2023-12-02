<template>
  <el-switch
    :model-value="modelValue === 'light'"
    inline-prompt
    :active-icon="Sunny"
    :inactive-icon="Moon"
    @update:modelValue="v => $emit('update:modelValue', v ? 'light' : 'dark')"
  />
</template>

<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: 'light' | 'dark'
}>()
</script>
