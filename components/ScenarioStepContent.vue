<template>
  <ScenarioStepDisplay v-if="mode === Mode.View" :step="modelValue" />
  <div
    v-if="mode === Mode.Edit"
    ref="$form"
    :draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragleave="onDragLeave"
  >
    <ScenarioStepForm
      :model-value="modelValue"
      @update:model-value="onUpdate"
      @delete="emit('deleted')"
    />
  </div>
</template>

<script setup lang="ts">
import { Mode, type ScenarioStep } from '~/types'

const props = defineProps<{
  modelValue: ScenarioStep,
  mode: Mode
}>()

const emit = defineEmits([
  'update:modelValue',
  'dragstarted',
  'dragended',
  'wentahead',
  'wentbelow',
  'deleted'
])

const $form = ref<HTMLElement | null>(null)

const onUpdate = (step: ScenarioStep) => {
  emit('update:modelValue', step)
}

const onDragStart = () => {
  emit('dragstarted', props.modelValue)
}

const onDragEnd = () => {
  emit('dragended')
}

const onDragLeave = (e: DragEvent) => {
  const element: HTMLElement | null = $form.value

  if (!element) {
    return
  }

  const { top, bottom } = element.getBoundingClientRect()

  if (e.y < top) {
    emit('wentahead')
  } else if (e.y > bottom) {
    emit('wentbelow')
  }
}
</script>
