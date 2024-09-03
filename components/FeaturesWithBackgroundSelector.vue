<template>
  <client-only>
    <el-select-v2
      class="FeaturesWithBackgroundSelector"
      label="Copy background from another feature"
      placeholder="Copy background from another feature"
      size="large"
      :model-value="selectValue"
      :options="features.map(feature => ({ value: feature.id, label: feature.title, selected: selectValue === feature.id }))"
      filterable
      @update:model-value="onUpdate"
    />
  </client-only>
</template>

<script setup lang="ts">
import type { Feature, Project } from '~/types'

const props = defineProps<{
  modelValue?: Pick<Feature, 'id' | 'title'>,
  project: Project
}>()

const { $api } = useNuxtApp()

const features = ref<Pick<Feature, 'id' | 'title'>[]>([])

const emit = defineEmits(['update:modelValue'])

const onUpdate = (newValue: string) => {
  emit('update:modelValue', features.value.find((feature) => feature.id === newValue))
}

onMounted(async () => {
  features.value = await $api.getProjectFeaturesWithBackground(props.project.id)
})

const selectValue = computed(() => props.modelValue?.id)
</script>
