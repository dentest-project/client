<template>
  <el-input v-if="modelValue.stepPart.strategy === ContentStrategy.Free" size="small" :model-value="modelValue.content" @update:model-value="onUpdate" />
  <el-select v-else size="small" :model-value="modelValue.content" @update:model-value="onUpdate">
    <el-option v-for="choice in modelValue.stepPart.choices" :value="choice" :label="choice" />
  </el-select>
</template>

<script setup lang="ts">
import { type InlineStepParam, ContentStrategy } from '~/types'

const props = defineProps<{
  modelValue: InlineStepParam
}>()

const emit = defineEmits(['update:modelValue'])

const onUpdate = (content: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    content,
  })
}
</script>
