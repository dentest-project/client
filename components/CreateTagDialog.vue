<template>
  <client-only>
    <el-dialog :model-value="modelValue" @update:model-value="onDialogStatusChanged" title="Create a tag">
      <form @submit.prevent="onSubmit">
        <el-color-picker v-model="color" />
        <el-input class="CreateTagDialog-input" placeholder="Tag name" v-model="name" :style="{ backgroundColor: color, color: blackOrWhite(color) }" autofocus />
        <el-input type="submit" value="Create tag" />
      </form>
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { blackOrWhite } from '~/helpers/blackOrWhite'
import type { Project } from '~/types'

const props = defineProps<{
  modelValue: boolean,
  initialTagName: string,
  project: Project
}>()
const { $api } = useNuxtApp()

const color = ref('#AA00AA')
const name = ref(props.initialTagName)

const emit = defineEmits(['update:modelValue', 'created'])

const onSubmit = async () => {
  try {
    const createdTag = await $api.createTag(
      props.project.id,
      {
        name: name.value,
        color: color.value,
      }
    )

    emit('created', createdTag)
    reset()

    ElNotification({
      title: 'Tag created',
      message: 'The tag has been successfully created',
      type: 'success',
    })
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while creating the tag',
      type: 'error',
    })
  }
}

const reset = () => {
  color.value = '#AA00AA'
  name.value = ''
}

const onDialogStatusChanged = (e: boolean) => {
  if (e) {
    reset()
  }

  emit('update:modelValue', e)
}

watch(props, () => {
  if (props.modelValue) {
    name.value = props.initialTagName
  }
})
</script>

<style>
.CreateTagDialog-input input, .CreateTagDialog-input .el-input__wrapper {
  color: inherit;
  background-color: inherit;
}
</style>
