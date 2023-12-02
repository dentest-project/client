<template>
  <client-only>
    <el-dialog :model-value="modelValue" @update:modelValue="onDialogStatusChanged" title="Get pull token">
      <div class="GetPullTokenDialog-description">
        As a developer, use this token to pull features alongside your code, as Gherkin files. You can use it with the Dentest CLI,
        or with the IDE plugin.
      </div>
      <el-text size="small" class="GetPullTokenDialog-token" type="primary">{{ token }}</el-text>
      <CopyButton @click="onCopy" /> <RegenerateTokenButton @click="onRefresh" />
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { loggedInUser } from '~/helpers/auth'
import type { Project } from '~/types'

const props = defineProps<{
  modelValue: boolean,
  project: Project
}>()
const { $api } = useNuxtApp()
const { data } = useAuth()

const emit = defineEmits(['update:modelValue'])

const token = ref((await $api.getProjectUserToken(props.project.id, loggedInUser(data.value).id)).token)

const onDialogStatusChanged = (e: boolean) => {
  emit('update:modelValue', e)
}

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(token.value)

    ElNotification({
      title: 'Token copied',
      message: 'The pull token has been successfully copied to your clipboard',
      type: 'success',
    })
  } catch (err) {
    ElNotification({
      title: 'Failed to copy',
      message: 'An error occurred while copying the token to the clipboard',
      type: 'error',
    })
  }
}

const onRefresh = async () => {
  token.value = (await $api.createProjectUserToken(props.project.id, loggedInUser(data.value).id)).token
}
</script>

<style scoped>
.GetPullTokenDialog-description {
  font-size: 0.8rem;
  margin: 0 0 1rem 0;
  font-style: italic;
}

.GetPullTokenDialog-token {
  padding: 8px 15px;
  border: var(--el-border);
  border-color: var(--el-button-border-color);
}
</style>
