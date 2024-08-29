<template>
  <client-only>
    <el-dialog :model-value="modelValue" @update:model-value="onDialogStatusChanged" title="Create a folder">
      <form @submit.prevent="onSubmit">
        <el-input v-model="name" placeholder="Folder name" autofocus required clearable />
        <el-input type="submit" value="Create folder" />
      </form>
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import type { Path } from '~/types'

const props = defineProps<{
  modelValue: boolean,
  path: Path
}>()
const { $api } = useNuxtApp()

const emit = defineEmits(['created', 'update:modelValue'])

const name = ref('')

const onSubmit = async () => {
  if (name.value.trim() === '') {
    return
  }

  try {
    await $api.createPath({
      parent: {
        id: props.path.id,
      },
      path: name.value,
    })

    ElNotification({
      title: 'Folder created',
      message: 'The folder has been successfully created',
      type: 'success',
    })

    emit('created')
    emit('update:modelValue', false)

    name.value = ''
  } catch (error) {
    if (error.statusCode === 409) {
      ElNotification({
        title: 'Already taken',
        message: 'The folder name already exists',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while creating the folder',
        type: 'error',
      })
    }
  }
}

const onDialogStatusChanged = (e: boolean) => {
  emit('update:modelValue', e)
}
</script>

<style scoped>
.el-input {
  margin: 0.5rem;
}
</style>
