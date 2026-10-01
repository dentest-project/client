<template>
  <client-only>
    <el-dialog
      :model-value="modelValue"
      @update:model-value="onDialogStatusChanged"
      title="Create an organization"
    >
      <form @submit.prevent="onSubmit">
        <el-input
          v-model="organizationName"
          placeholder="Organization name"
          maxlength="255"
          autofocus
          required
          clearable
        />
        <el-input type="submit" value="Create organization" />
      </form>
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { CreateOrganizationErrorCode, isKetalJsonRpcError } from '~/api/ketal'

withDefaults(
  defineProps<{
    modelValue?: boolean
  }>(),
  {
    modelValue: false,
  },
)
const { $ketal } = useNuxtApp()

const emit = defineEmits(['created', 'update:modelValue'])

const organizationName = ref('')

const onSubmit = async () => {
  if (organizationName.value.trim() === '') {
    return
  }

  try {
    await $ketal.createOrganization({ name: organizationName.value.trim() })

    ElNotification({
      title: 'Organization created',
      message: 'The organization has been successfully created',
      type: 'success',
    })

    emit('created')
    emit('update:modelValue', false)

    organizationName.value = ''
  } catch (error) {
    if (
      isKetalJsonRpcError(error) &&
      error.code === CreateOrganizationErrorCode.OrganizationAlreadyExists
    ) {
      ElNotification({
        title: 'Already taken',
        message: 'The organization name already exists on Dentest',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while creating the organization',
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
