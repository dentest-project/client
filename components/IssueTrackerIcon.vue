<template>
  <component :is="icon" />
</template>

<script setup lang="ts">
import { JiraIcon } from '#components'
import type { IssueTracker } from '~/types'

defineProps<{
  issueTracker: IssueTracker
}>()

const icon = computed(() => {
  return JiraIcon
})
</script>
