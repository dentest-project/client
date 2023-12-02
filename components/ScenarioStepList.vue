<template>
  <ScenarioStepContent
    v-for="(step, i) in modelValue"
    :key="`${i}${step.step?.id}`"
    :model-value="step"
    :mode="mode"
    @update:model-value="(newVal) => { onUpdate(i, newVal) }"
    @dragstarted="() => onDragStepStart(i, step)"
    @dragended="onDragStepEnd"
    @wentahead="() => onWentAhead(i)"
    @wentbelow="() => onWentBelow(i)"
    @deleted="() => onDelete(i)"
  />
</template>

<script setup lang="ts">
import { Mode, type ScenarioStep } from '~/types'

const props = defineProps<{
  modelValue: ScenarioStep[],
  mode: Mode
}>()

const emit = defineEmits(['update:modelValue'])

const draggedStep = ref<ScenarioStep | null>(null)
const draggedStepId = ref<number | null>(null)


const onUpdate = (i: number, step: ScenarioStep) => {
  const updatedList = [...props.modelValue]

  updatedList.splice(i, 1, step)

  emit('update:modelValue', updatedList)
}

const onDragStepStart = (i: number, step: ScenarioStep) => {
  draggedStep.value = step
  draggedStepId.value = i
}

const onDragStepEnd = () => {
  draggedStepId.value = null
  draggedStep.value = null
}

const onWentAhead = (i: number) => {
  if (i === draggedStepId.value) {
    return
  }

  const steps = [...props.modelValue]

  steps.splice(draggedStepId.value ?? 0, 1)
  steps.splice(i, 0, props.modelValue[draggedStepId.value ?? 0])
  draggedStepId.value = i

  emit('update:modelValue', steps.map((s, i) => ({ ...s, priority: i })))
}

const onWentBelow = (i: number) => {
  if (i === draggedStepId.value) {
    return
  }

  const steps = [...props.modelValue]

  steps.splice(draggedStepId.value ?? 0, 1)
  steps.splice(i, 0, props.modelValue[draggedStepId.value ?? 0])
  draggedStepId.value = i

  emit('update:modelValue', steps.map((s, i) => ({ ...s, priority: i })))
}

const onDelete = (i: number) => {
  const updatedList = [...props.modelValue]

  updatedList.splice(i, 1)

  emit('update:modelValue', updatedList)
}
</script>
