<template>
  <div class="FeatureIssueCollection">
    <el-button-group v-if="mode === Mode.Edit" v-for="(issue, i) in modelValue" type="primary" class="FeatureIssueCollection-syncButtonGroup">
      <el-button class="FeatureIssueCollection-syncButton" plain :disabled="syncing" @click="() => onSync(issue)">
        <el-icon class="FeatureIssueCollection-syncButtonIcon" :class="syncing ? 'is-loading' : ''">
          <IssueTrackerIcon v-if="!syncing" :issue-tracker="issue.issueTracker" />
          <Loading v-else />
        </el-icon>
        Sync to {{ issueLabel(issue) }}
      </el-button>
      <el-button plain @click="() => onCloseIssue(i)"><el-icon><Close /></el-icon></el-button>
    </el-button-group>
    <a v-if="mode === Mode.View" v-for="issue in modelValue" type="primary" class="el-button el-button--primary is-plain" :href="issue.link" target="_blank">
      <el-icon class="FeatureIssueCollection-syncButtonIcon">
        <IssueTrackerIcon :issue-tracker="issue.issueTracker" />
      </el-icon>
      {{ issueLabel(issue) }}
    </a>
    <form v-if="mode === Mode.Edit" v-for="tracker in issueTrackers" @submit.prevent="() => onNewIssue(tracker)">
      <el-input
        v-model="newIssues[tracker]"
        :label="`Link ${tracker.toUpperCase()} issue`"
        :placeholder="`Link ${tracker.toUpperCase()} issue`"
        :pattern="newIssuePattern(tracker)"
      >
        <template #prefix>
          <el-icon><IssueTrackerIcon :issue-tracker="tracker" /></el-icon>
        </template>
      </el-input>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import IssueTrackerIcon from '~/components/IssueTrackerIcon.vue'
import type { Issue } from '~/types'
import { IssueTracker, Mode } from '~/types'
import { Close, Loading } from '@element-plus/icons-vue'

const props = defineProps<{
  issueTrackers: IssueTracker[]
  modelValue: Issue[],
  mode: Mode
}>()

const { $api } = useNuxtApp()

const newIssues = ref({
  [IssueTracker.Jira]: ''
})

const syncing = ref(false)

const newIssuePattern = (issueTracker: IssueTracker) => {
  if (issueTracker === IssueTracker.Jira) {
    return '^https://.+/browse/[A-Z0-9\\-]+-\\d+$'
  }

  return ''
}

const onNewIssue = (issueTracker: IssueTracker) => {
  if (props.modelValue.find((issue: Issue) => issue.issueTracker === issueTracker && issue.link === newIssues.value[issueTracker])) {
    return
  }

  emit('update:modelValue', [
    ...props.modelValue,
    {
      issueTracker,
      link: newIssues.value[issueTracker]
    }
  ])

  newIssues.value[issueTracker] = ''
}

const issueLabel = (issue: Issue) => {
  if (issue.issueTracker === IssueTracker.Jira) {
    const regex = /^https:\/\/.+\/browse\/([A-Z0-9-]+-\d+)$/

    const matches = regex.exec(issue.link)

    return matches[1] ?? ''
  }

  return ''
}

const onSync = async (issue: Issue) => {
  if (syncing.value || !issue.id) {
    return
  }

  syncing.value = true

  try {
    await $api.syncIssue(issue)

    ElNotification({
      title: 'Feature synced',
      message: 'The feature has been successfully synced to the selected issue',
      type: 'success',
    })
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while syncing the feature to the selected issue',
      type: 'error',
    })
  }

  syncing.value = false
}

const onCloseIssue = (identifier: number) => {
  const newValue = [...props.modelValue]

  newValue.splice(identifier, 1)

  emit('update:modelValue', newValue)
}

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.FeatureIssueCollection {
  margin-bottom: 2rem;
}

.FeatureIssueCollection-syncButtonGroup {
  margin-right: 0.5rem;
}

.FeatureIssueCollection-syncButtonIcon {
  margin-right: 0.5rem;
}

form {
  display: inline-block;
}

a {
  text-decoration: none;
}
</style>
