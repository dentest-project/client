<template>
  <el-main>
    <Breadcrumb :items="breadcrumb" />
    <h1>Domain model</h1>
    <ActionsBar>
      <AddDomainEntityButton v-if="canWrite" :to="$routes.projectDomainEntityCreate(project)" />
    </ActionsBar>
    <Panel v-if="domainModel.length === 0" type="info">
      {{ canWrite ? 'This project has no entities yet. Create the first one to start shaping the model.' : 'This project has no entities yet.' }}
    </Panel>
    <el-row v-else :gutter="20">
      <el-col v-for="entity in domainModel" :key="entity.id" :xs="24" :sm="12" :lg="8">
        <DomainEntityCard :entity="entity" :to="$routes.projectDomainEntity(project, entity.id as string)" />
      </el-col>
    </el-row>
  </el-main>
</template>

<script setup async lang="ts">
import {
  type BreadcrumbItems,
  type DomainEntityList,
  OrganizationPermission,
  type Project,
  ProjectPermission
} from '~/types'

definePageMeta({
  auth: false,
  alias: '/project/:projectSlug/domain-model'
})

const { $api, $routes } = useNuxtApp()
const { params } = useRoute()

const project = ref<Project>(await $api.getProject(params.projectSlug, params.organizationSlug))
const domainModel = ref<DomainEntityList>(await $api.getProjectDomainModel(project.value.id))

useHead({
  title: `${project.value.title} domain model${project.value.organization ? ` - ${project.value.organization.name}` : ''} | Dentest`
})

const canWrite = computed(() => project.value.permissions.some(
  permission => [ProjectPermission.Admin, ProjectPermission.Write].includes(permission)
) || (
  !!project.value.organization &&
  project.value.organization.permissions.some(permission =>
    [OrganizationPermission.Admin, OrganizationPermission.ProjectWrite].includes(permission)
  )
))

const breadcrumb = computed((): BreadcrumbItems => {
  const items = [] as BreadcrumbItems

  if (project.value.organization) {
    items.push({
      text: project.value.organization.name,
      href: $routes.organization(project.value.organization.slug),
      disabled: false,
    })
  }

  items.push({
    text: project.value.title,
    href: $routes.project(project.value),
    disabled: false,
  })

  items.push({
    text: 'Domain model',
    href: $routes.projectDomainModel(project.value),
    disabled: true,
  })

  return items
})
</script>
