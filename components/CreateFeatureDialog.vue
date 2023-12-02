<template>
  <client-only>
    <el-dialog :model-value="modelValue" @update:modelValue="onDialogStatusChanged" title="Create a feature">
      <form @submit.prevent="onSubmit">
        <el-input v-model="title" placeholder="Feature title" autofocus required clearable />
        <el-input type="submit" value="Create feature" />
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

const title = ref('')

const onSubmit = async () => {
  if (title.value.trim() === '') {
    return
  }

  try {
    await $api.createFeature({
      path: {
        id: props.path.id,
      },
      title: title.value,
    })

    ElNotification({
      title: 'Feature created',
      message: 'The feature has been successfully created',
      type: 'success',
    })

    emit('created')
    emit('update:modelValue', false)

    title.value = ''
  } catch (error) {
    if (error.statusCode === 409) {
      ElNotification({
        title: 'Already taken',
        message: 'The feature name already exists',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while creating the feature',
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
