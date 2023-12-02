<template>
  <el-input v-if="modelValue.stepPart.strategy === StepPartStrategy.Free" size="small" :model-value="modelValue.content" @update:model-value="onUpdate" />
  <el-select v-else size="small" :model-value="modelValue.content" @update:model-value="onUpdate" @focus="onFocus" @blur="onBlur">
    <el-option v-for="choice in modelValue.stepPart.choices" :value="choice" :label="choice" />
  </el-select>
</template>

<script setup lang="ts">
import { useScenarioContentFocusManagementStore } from '~/store/scenario-content-focus-management'
import { type InlineStepParam, StepPartStrategy } from '~/types'

const { holdFocus, releaseFocus } = useScenarioContentFocusManagementStore()

const props = defineProps<{
  modelValue: InlineStepParam
}>()

const emit = defineEmits(['update:modelValue'])

const onUpdate = (content: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    content,
  })
  releaseFocus()
}

const onFocus = () => {
  holdFocus()
}

const onBlur = () => {
  releaseFocus()
}
</script>
