<template>
  <NuxtLink class="el-button" :to="to">
    <el-icon><List /></el-icon>
    <span class="label">Administrate issue trackers</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { List } from '@element-plus/icons-vue'
import type { Organization } from '~/types'

const { $routes } = useNuxtApp()

const props = defineProps<{
  organization: Organization
}>()

const to = computed(() => $routes.organizationIssueTrackers(props.organization))
</script>

<style scoped>
.label {
  display: inline-block;
  margin-left: 1rem;
}

a {
  text-decoration: none;
}
</style>
