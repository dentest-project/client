<template>
  <component v-if="mode === Mode.View" :is="headingTag ?? 'h2'" class="editableSubtitle" @click="mode = Mode.Edit">
    {{ displayValue }}
  </component>
  <form v-else @submit.prevent="onSubmit">
    <el-input
      class="editableSubtitle-input"
      :model-value="modelValue"
      :placeholder="label"
      autofocus
      @update:model-value="v => { $emit('update:modelValue', v) }"
      @blur="onSubmit"
    />
  </form>
</template>

<script setup lang="ts">
import { Mode } from '~/types'

const props = defineProps<{
  modelValue: string,
  label: string,
  emptyLabel?: string,
  headingTag?: 'h2' | 'h3'
}>()

const emit = defineEmits(['cancel', 'submit', 'update:modelValue'])

const mode = ref(Mode.View)
let initialValue: string

const displayValue = computed(() => props.modelValue.trim().length > 0 ? props.modelValue : props.emptyLabel)

onMounted(() => {
  initialValue = props.modelValue
})

watch(() => props.modelValue, (newValue) => {
  if (mode.value === Mode.View) {
    initialValue = newValue
  }
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
.editableSubtitle:hover {
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
