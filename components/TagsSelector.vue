<template>
  <client-only>
    <el-select-v2
      class="TagsSelector"
      label="Select tags"
      placeholder="Select tags"
      :model-value="selectValue"
      :options="allTags.map(tag => ({ value: tag.id, label: tag.name, color: tag.color, selected: selectValue.some((v) => v === tag.id) }))"
      filterable
      multiple
      allow-create
      @update:model-value="onUpdate"
    >
      <template #default="{ item }">
        <TagChip :tag="{ id: item.value, name: item.label, color: item.color ?? '#CCCCCC' }" :outline="item.selected" :hoverable="false" />
      </template>
    </el-select-v2>
    <CreateTagDialog
      v-model="createTagDialog"
      :project="project"
      :initial-tag-name="newTagName"
      @created="onTagCreated"
    />
  </client-only>
</template>

<script setup lang="ts">
import type { Project, Tag } from '~/types'

const props = defineProps<{
  modelValue: Tag[],
  project: Project
}>()

const { $api } = useNuxtApp()

const createTagDialog = ref(false)
const newTagName = ref('')
const allTags = ref<Tag[]>([])

const emit = defineEmits(['update:modelValue'])

const onUpdate = (newValue: string[]) => {
  if (newValue.length > 0 && !allTags.value.find((tag) => tag.id === newValue[newValue.length - 1])) {
    newTagName.value = newValue[newValue.length - 1]
    createTagDialog.value = true

    return
  }

  emit('update:modelValue', allTags.value.filter((tag) => newValue.find((val) => val === tag.id)))
}

const onTagCreated = async (tag: Tag) => {
  createTagDialog.value = false
  newTagName.value = ''

  allTags.value = await $api.getTags(props.project.id)

  const newValue = await new Promise((resolve) => {
    resolve([...props.modelValue, tag])
  })

  emit('update:modelValue', newValue)
}

onMounted(async () => {
  allTags.value = await $api.getTags(props.project.id)
})

const selectValue = computed(() => props.modelValue.map((tag) => tag.id))
</script>

<style scoped>
.TagsSelector {
  width: 100%;
}

.TagSelector-tag {
  font-size: 12px;
  padding: 0.3rem;
  border-radius: 2px;
}
</style>
