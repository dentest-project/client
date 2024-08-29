<template>
  <div v-if="mode === Mode.View" class="EditableParagraph" :class="editable ? 'EditableParagraph--editable' : ''" @click="onParagraphClicked">
    <div v-for="line in lines">
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
  editable: boolean
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

  emit('submit')
}

const onParagraphClicked = () => {
  if (props.editable) {
    mode.value = Mode.Edit
  }
}

const lines = computed(() => props.modelValue.split('\n'))

watch(() => props.editable, (editable) => {
  if (!editable) {
    mode.value = Mode.View
  }
})
</script>

<style>
.EditableParagraph, .EditableParagraph-textarea textarea {
  padding: 1rem;
}

.EditableParagraph--editable:hover, .EditableParagraph-textarea textarea {
  background-color: rgba(0, 0, 0, 0.2);
  color: inherit;
}

.EditableParagraph--editable:hover {
  cursor: pointer;
}
</style>
