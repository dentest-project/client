<template>
  <el-select :model-value="modelValue" @update:modelValue="onUpdate" placeholder="Strategy" size="small">
    <el-option label="Free text" :value="StepPartStrategy.Free" />
    <el-option label="Predefined choices" :value="StepPartStrategy.Choices" />
  </el-select>
</template>

<script setup lang="ts">
import { StepPartStrategy } from '~/types'

defineProps<{
  modelValue: StepPartStrategy
}>()

const emit = defineEmits(['update:modelValue'])

const onUpdate = (newValue: StepPartStrategy) => {
  emit('update:modelValue', newValue)
}
</script>
