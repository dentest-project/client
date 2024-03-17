<template>
  <el-main>
    <Breadcrumb :items="breadcrumb" />
    <h1>Organization "{{ organization.name }}" issue trackers</h1>

    <el-row>
      <el-col v-for="configuration in configurations" :span="6" :md="6" :sm="12" :xs="24">
        <IssueTrackerConfigurationForm
          :issue-tracker-configuration="configuration"
          :organization="organization"
          @deleted="load"
          @saved="load"
        />
      </el-col>
    </el-row>

    <div class="new-trackers" v-if="availableNewTrackers.length > 0">
      <IssueTrackerButton v-for="issueTracker in availableNewTrackers" :issue-tracker="issueTracker" @click="() => addNewConfiguration(issueTracker)" />
    </div>
  </el-main>
</template>

<script setup async lang="ts">
import { IssueTracker } from '~/types'
import type { BreadcrumbItems, OrganizationIssueTrackerConfigurationDetailed } from '~/types'

const { $api, $routes } = useNuxtApp()
const { params } = useRoute()

const organization = ref(await $api.getOrganization(params.organizationSlug))
const configurations = ref<OrganizationIssueTrackerConfigurationDetailed[]>([])

const load = async () => {
  configurations.value = await $api.getOrganizationIssueTrackerConfigurations(params.organizationSlug)
}

const addNewConfiguration = (issueTracker: IssueTracker) => {
  configurations.value.push({
    issueTracker,
    userIdentifier: '',
    accessToken: '',
    apiUrl: '',
    organization: {
      id: organization.value.id
    },
    id: ''
  })
}

await load()

const breadcrumb = computed((): BreadcrumbItems => [
  {
    text: organization.value.name,
    href: $routes.organization(organization.value.slug),
    disabled: false,
  },
  {
    text: 'Issue trackers',
    href: '',
    disabled: true,
  }
])

const availableNewTrackers = computed(() => (Object.values(IssueTracker) as IssueTracker[])
  .filter((issueTracker) => !configurations.value.map(c => c.issueTracker).includes(issueTracker)))

useHead({
  title: `Issue trackers - ${organization.value.name} | Dentest`
})
</script>
