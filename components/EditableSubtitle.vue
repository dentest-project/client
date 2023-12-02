<template>
  <h2 v-if="mode === Mode.View" class="editableSubtitle" @click="mode = Mode.Edit">{{ modelValue.trim().length > 0 ? modelValue : emptyLabel }}</h2>
  <form v-else @submit.prevent="onSubmit">
    <el-input
      class="editableSubtitle-input"
      :model-value="modelValue"
      :placeholder="label"
      autofocus
      @update:modelValue="v => { $emit('update:modelValue', v) }"
      @blur="onSubmit"
    />
  </form>
</template>

<script setup lang="ts">
import { Mode } from '~/types'

const props = defineProps<{
  modelValue: string,
  label: string,
  emptyLabel?: string
}>()

const emit = defineEmits(['cancel', 'submit', 'update:modelValue'])

const mode = ref(Mode.View)
let initialValue: string

onMounted(() => {
  initialValue = props.modelValue
})

const onSubmit = () => {
  mode.value = Mode.View

  if (props.modelValue === initialValue) {
    emit('cancel')

    return
  }

  initialValue = props.modelValue
  emit('submit')
}
</script>

<style>
h2.editableSubtitle:hover {
  cursor: pointer;
  background-color: var(--el-color-primary-light-9);
}

.el-input.editableSubtitle-input {
  font-size: 24px;
  width: 100%;
}

.el-input.editableSubtitle-input input {
  padding: 1rem;
  height: auto;
  font-weight: bold;
  width: 100%;
}
</style>
