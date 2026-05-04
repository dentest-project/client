<template>
  <el-main>
    <Breadcrumb :items="breadcrumb" />
    <DomainEntityEditor
      :can-write="canWrite"
      :entity-link="(entityId) => $routes.projectDomainEntity(project, entityId)"
      :initial-value="domainEntity"
      :project-domain-model="projectDomainModel"
      save-label="Create entity"
      @submit="onSubmitted"
    />
  </el-main>
</template>

<script setup async lang="ts">
import { ElNotification } from 'element-plus'
import {
  createEmptyDomainEntityDraft,
  formatApiErrorMessage,
  toCreateDomainEntityRequest
} from '~/helpers/domainModel'
import {
  type BreadcrumbItems,
  type DomainEntityDraft,
  type DomainEntityList,
  OrganizationPermission,
  type Project,
  ProjectPermission
} from '~/types'

definePageMeta({
  auth: false,
  alias: [
    '/project/:projectSlug/domain-model/entity/new',
    '/project/:projectSlug/domain-model/entities/new',
    '/organization/:organizationSlug/project/:projectSlug/domain-model/entities/new'
  ]
})

const { $api, $router, $routes } = useNuxtApp()
const { params } = useRoute()

const project = ref<Project>(await $api.getProject(params.projectSlug, params.organizationSlug))
const projectDomainModel = ref<DomainEntityList>(await $api.getProjectDomainModel(project.value.id))
const domainEntity = ref<DomainEntityDraft>(createEmptyDomainEntityDraft(project.value.id))

useHead({
  title: `New entity - ${project.value.title}${project.value.organization ? ` - ${project.value.organization.name}` : ''} | Dentest`
})

const canWrite = computed(() => project.value.permissions.some(
  permission => [ProjectPermission.Admin, ProjectPermission.Write].includes(permission)
) || (
  !!project.value.organization &&
  project.value.organization.permissions.some(permission =>
    [OrganizationPermission.Admin, OrganizationPermission.ProjectWrite].includes(permission)
  )
))

const onSubmitted = async (submittedEntity: DomainEntityDraft) => {
  try {
    const createdEntity = await $api.createDomainEntity(toCreateDomainEntityRequest(submittedEntity))

    ElNotification({
      title: 'Entity created',
      message: 'The entity has been successfully created',
      type: 'success',
    })

    await $router.push($routes.projectDomainEntity(project.value, createdEntity.id as string))
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: formatApiErrorMessage(error, 'An error occurred while creating the entity'),
      type: 'error',
    })
  }
}

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
    disabled: false,
  })

  items.push({
    text: 'New entity',
    href: $routes.projectDomainEntityCreate(project.value),
    disabled: true,
  })

  return items
})
</script>
