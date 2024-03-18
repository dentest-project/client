<template>
  <el-card>
    <template #header>
      <h3>
        <IssueTrackerIcon class="IssueTrackerConfigurationForm-icon" :issue-tracker="issueTrackerConfiguration.issueTracker" />
        {{ props.issueTrackerConfiguration.issueTracker.toUpperCase() }}
      </h3>
    </template>
    <el-form class="IssueTrackerConfigurationForm-inputs" @submit.prevent="onSave">
      <el-input label="Tracker URL" placeholder="Tracker URL" v-model="apiUrl" />
      <el-input label="User identifier" placeholder="User identifier" v-model="userIdentifier" />
      <el-input label="Access token" placeholder="Access token" type="password" v-model="accessToken" />
    </el-form>
    <div class="IssueTrackerConfigurationForm-actions">
      <DeleteButton label="Delete configuration" size="small" :disabled="loading" @deleted="onDelete" />
      <SaveButton label="Save configuration" size="small" :disabled="loading" @click.stop="onSave" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import type { Organization, OrganizationIssueTrackerConfigurationDetailed } from '~/types'

const props = defineProps<{
  issueTrackerConfiguration: OrganizationIssueTrackerConfigurationDetailed
  organization: Organization
}>()

const { $api } = useNuxtApp()

const apiUrl = ref(props.issueTrackerConfiguration.apiUrl)
const userIdentifier = ref(props.issueTrackerConfiguration.userIdentifier)
const accessToken = ref(props.issueTrackerConfiguration.accessToken)
const loading = ref(false)

const emit = defineEmits(['saved', 'deleted'])

const onDelete = async () => {
  if (props.issueTrackerConfiguration.id) {
    try {
      loading.value = true

      await $api.deleteOrganizationIssueTrackerConfiguration(props.issueTrackerConfiguration.id)

      ElNotification({
        title: 'Configuration deleted',
        message: 'The issue tracker configuration has been successfully deleted',
        type: 'success',
      })

      emit('deleted')
    } catch (error) {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while deleting the issue tracker configuration',
        type: 'error',
      })
    } finally {
      loading.value = false
    }
  } else {
    emit('deleted')
  }
}

const onSave = async () => {
  try {
    loading.value = true

    await $api.saveOrganizationIssueTrackerConfiguration({
      ...props.issueTrackerConfiguration,
      apiUrl: apiUrl.value,
      accessToken: accessToken.value,
      userIdentifier: userIdentifier.value,
      organization: {
        id: props.organization.id as string
      }
    })

    emit('saved')

    ElNotification({
      title: 'Configuration saved',
      message: 'The issue tracker configuration has been successfully saved',
      type: 'success',
    })
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while saving the issue tracker configuration',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  apiUrl.value = props.issueTrackerConfiguration.apiUrl
  userIdentifier.value = props.issueTrackerConfiguration.userIdentifier
  accessToken.value = props.issueTrackerConfiguration.accessToken
})
</script>

<style lang="css">
.IssueTrackerConfigurationForm-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.IssueTrackerConfigurationForm-actions {
  padding: 1rem 0;
  text-align: right;
}

.IssueTrackerConfigurationForm-icon {
  width: 1rem;
}
</style>
