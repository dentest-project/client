<template>
  <el-select :model-value="modelValue" @update:model-value="onUpdate" placeholder="Strategy" size="small">
    <el-option label="Free text" :value="ContentStrategy.Free" />
    <el-option label="Predefined choices" :value="ContentStrategy.Choices" />
    <el-option label="Fake data" :value="ContentStrategy.FakeData" />
    <el-option v-if="withRowId" label="Row index" :value="ContentStrategy.RowIndex" />
  </el-select>
</template>

<script setup lang="ts">
import { ContentStrategy } from '~/types'

defineProps<{
  withRowId: boolean
  modelValue: ContentStrategy
}>()

const emit = defineEmits(['update:modelValue'])

const onUpdate = (newValue: ContentStrategy) => {
  emit('update:modelValue', newValue)
}
</script>
