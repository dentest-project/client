<template>
  <TagChip
    v-for="tag in tags"
    :tag="tag"
    :outline="!displayTagAsSelected(tag)"
    :hoverable="true"
    @click="() => onTagClicked(tag)"
  />
</template>

<script setup lang="ts">
import type { Project, Tag } from '~/types'

const props = defineProps<{
  modelValue: Tag[],
  project: Project
}>()

const { $api } = useNuxtApp()

const tags = ref<Tag[]>([])

const emit = defineEmits(['update:modelValue'])

const displayTagAsSelected = (tag: Tag) => {
  return props.modelValue.length === 0 || props.modelValue.map(t => t.id).includes(tag.id)
}

const onTagClicked = (tag: Tag) => {
  const selectedIndex = props.modelValue.findIndex(t => t.id === tag.id)

  if (selectedIndex === -1) {
    emit('update:modelValue', [...props.modelValue, tag])
  } else {
    const out = [...props.modelValue]

    out.splice(selectedIndex, 1)
    emit('update:modelValue', out)
  }
}

tags.value = await $api.getTags(props.project.id)
</script>
