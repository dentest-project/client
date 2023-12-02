<template>
  <client-only>
    <el-select-v2
      :model-value="modelValue"
      :options="options"
      size="small"
      placeholder="Choices"
      label="Choices"
      style="width: 100%"
      allow-create
      filterable
      multiple
      @update:modelValue="onUpdate"
    />
  </client-only>
</template>

<script setup lang="ts">
export interface Props {
  modelValue: string[]
}

const props = defineProps<Props>()

const emit = defineEmits(['update:modelValue'])

const options = ref<{ label: string, value: string }[]>(props.modelValue.map((v) => ({ label: v, value: v })))

const onUpdate = (newValue: string[]) => {
  emit('update:modelValue', newValue)
}
</script>
