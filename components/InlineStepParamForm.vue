<template>
  <el-input v-if="modelValue.stepPart.strategy !== ContentStrategy.Choices" size="small" :model-value="modelValue.content" @update:model-value="(v) => onUpdate(v, Delay.Delayed)" />
  <el-select v-else size="small" :model-value="modelValue.content" @update:model-value="(v) => onUpdate(v, Delay.Delayed)">
    <el-option v-for="choice in modelValue.stepPart.choices" :value="choice" :label="choice" />
  </el-select>
</template>

<script setup lang="ts">
import { type InlineStepParam, ContentStrategy, Delay } from '~/types'

const props = defineProps<{
  modelValue: InlineStepParam
}>()

const emit = defineEmits(['update:modelValue'])

const onUpdate = (content: string, delay: Delay) => {
  emit('update:modelValue', {
    ...props.modelValue,
    content,
  }, delay)
}
</script>
