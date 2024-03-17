<template>
  <el-button size="large">
    <el-icon><IssueTrackerIcon class="IssueTrackerConfigurationForm-icon" :issue-tracker="issueTracker" /></el-icon>
    <span class="label">Add {{ issueTracker.toUpperCase() }} configuration</span>
  </el-button>
</template>

<script setup lang="ts">
import type { IssueTracker } from '~/types'

defineProps<{
  issueTracker: IssueTracker
}>()
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}
</style>
