<template>
  <el-select :model-value="modelValue" @update:model-value="onUpdate" placeholder="Strategy" size="small">
    <el-option label="Free text" :value="ContentStrategy.Free" />
    <el-option label="Predefined choices" :value="ContentStrategy.Choices" />
  </el-select>
</template>

<script setup lang="ts">
import { ContentStrategy } from '~/types'

defineProps<{
  modelValue: ContentStrategy
}>()

const emit = defineEmits(['update:modelValue'])

const onUpdate = (newValue: ContentStrategy) => {
  emit('update:modelValue', newValue)
}
</script>
