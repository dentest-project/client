<template>
  <div v-if="mode === Mode.View" class="EditableParagraph" :class="editable ? 'EditableParagraph--editable' : ''" @click="onParagraphClicked">
    <div v-for="(line, index) in lines" :key="index">
      {{ line }}
    </div>
  </div>
  <el-input
    v-else
    class="EditableParagraph-textarea"
    :autosize="{ minRows: 3 }"
    type="textarea"
    :placeholder="placeholder"
    :model-value="modelValue"
    autofocus
    @update:model-value="onChanged"
    @blur="onInputBlur"
  />
</template>

<script setup lang="ts">
enum Mode {
  View,
  Edit
}

const props = defineProps<{
  modelValue: string,
  placeholder: string,
  editable: boolean,
  emptyLabel?: string
}>()

const mode = ref(Mode.View)

let initialValue: string

onMounted(() => {
  initialValue = props.modelValue
})

const emit = defineEmits(['cancel', 'update:modelValue', 'submit'])

const onChanged = (newValue: string) => {
  emit('update:modelValue', newValue)
}

const onInputBlur = () => {
  mode.value = Mode.View

  if (props.modelValue === initialValue) {
    emit('cancel')

    return
  }

  initialValue = props.modelValue
  emit('submit')
}

const onParagraphClicked = () => {
  if (props.editable) {
    mode.value = Mode.Edit
  }
}

const lines = computed(() => {
  if (props.modelValue.trim().length === 0) {
    return props.emptyLabel ? [props.emptyLabel] : ['']
  }

  return props.modelValue.split('\n')
})

watch(() => props.editable, (editable) => {
  if (!editable) {
    mode.value = Mode.View
  }
})

watch(() => props.modelValue, (newValue) => {
  if (mode.value === Mode.View) {
    initialValue = newValue
  }
})
</script>

<style scoped>
.EditableParagraph,
.EditableParagraph-textarea :deep(textarea) {
  padding: 1rem;
}

.EditableParagraph--editable:hover,
.EditableParagraph-textarea :deep(textarea) {
  background-color: var(--el-color-primary-light-9);
  color: inherit;
}

.EditableParagraph--editable:hover {
  cursor: pointer;
}
</style>
