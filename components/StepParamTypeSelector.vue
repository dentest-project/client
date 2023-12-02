<template>
  <el-select-v2
    placeholder="Type of the extra parameter"
    :model-value="modelValue"
    :options="options"
    style="width: 100%;"
    @update:model-value="v => emit('update:modelValue', v)"
  >
    <template #default="{ item }">
      <div style="display: flex; align-items: center">
        <StepParamIcon :step-param-type="item.value" />
        <span style="margin-left: 0.5rem; display: inline-block;">
        {{ item.label }}
      </span>
      </div>
    </template>
  </el-select-v2>
</template>

<script setup lang="ts">
import { StepParamType } from '~/types'

defineProps<{
  modelValue: StepParamType
}>()

const emit = defineEmits(['update:modelValue'])

const options = [
  {
    label: 'The step requires no extra parameter',
    value: StepParamType.None
  },
  {
    label: 'The step requires a paragraph after the sentence',
    value: StepParamType.Multiline
  },
  {
    label: 'The step requires a data table after the sentence',
    value: StepParamType.Table
  }
]
</script>
