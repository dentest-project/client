<template>
  <SlickList
    v-if="mode === Mode.Edit"
    :list="modelValue"
    useDragHandle
    @update:list="(list) => emit('update:modelValue', list)"
  >
    <SlickItem v-for="(step, i) in modelValue" :key="step.id" :index="i">
      <ScenarioStepForm
        :model-value="step"
        @update:model-value="(newVal) => onUpdate(i, newVal)"
        @delete="() => onDelete(i)"
      />
    </SlickItem>
  </SlickList>
  <ScenarioStepDisplay
    v-else
    v-for="(step) in modelValue"
    :step="step"
  />
</template>

<script setup lang="ts">
import { Mode, type ScenarioStep } from '~/types'

const props = defineProps<{
  modelValue: ScenarioStep[],
  mode: Mode
}>()

const emit = defineEmits(['update:modelValue'])

const onUpdate = (i: number, step: ScenarioStep) => {
  const updatedList = [...props.modelValue]

  updatedList.splice(i, 1, step)

  emit('update:modelValue', updatedList)
}

const onDelete = (i: number) => {
  const updatedList = [...props.modelValue]

  updatedList.splice(i, 1)

  emit('update:modelValue', updatedList)
}
</script>
