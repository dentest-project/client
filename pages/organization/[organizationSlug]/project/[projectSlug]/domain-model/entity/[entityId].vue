<template>
  <el-main>
    <Breadcrumb :items="breadcrumb" />
    <DomainEntityEditor
      :can-write="canWrite"
      :entity-link="(entityId) => $routes.projectDomainEntity(project, entityId)"
      :initial-value="domainEntity"
      :project-domain-model="projectDomainModel"
      save-label="Save entity"
      @submit="onSubmitted"
    />
  </el-main>
</template>

<script setup async lang="ts">
import { ElNotification } from 'element-plus'
import {
  createDomainEntityDraft,
  formatApiErrorMessage,
  toUpdateDomainEntityRequest
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
    '/project/:projectSlug/domain-model/entity/:entityId',
    '/project/:projectSlug/domain-model/entities/:entityId',
    '/organization/:organizationSlug/project/:projectSlug/domain-model/entities/:entityId'
  ]
})

const { $api, $routes } = useNuxtApp()
const { params } = useRoute()

const project = ref<Project>(await $api.getProject(params.projectSlug, params.organizationSlug))
const projectDomainModel = ref<DomainEntityList>(await $api.getProjectDomainModel(project.value.id))
const matchedEntity = projectDomainModel.value.find(entity => entity.id === params.entityId)

if (!matchedEntity) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Entity not found'
  })
}

const domainEntity = ref<DomainEntityDraft>(createDomainEntityDraft(matchedEntity, project.value.id))

useHead({
  title: `${domainEntity.value.name} - ${project.value.title}${project.value.organization ? ` - ${project.value.organization.name}` : ''} | Dentest`
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
    const updatedEntity = await $api.updateDomainEntity(toUpdateDomainEntityRequest(submittedEntity))

    domainEntity.value = createDomainEntityDraft(updatedEntity, project.value.id)
    projectDomainModel.value = await $api.getProjectDomainModel(project.value.id)

    ElNotification({
      title: 'Entity updated',
      message: 'The entity has been successfully updated',
      type: 'success',
    })
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: formatApiErrorMessage(error, 'An error occurred while updating the entity'),
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
    text: domainEntity.value.name,
    href: $routes.projectDomainEntity(project.value, params.entityId),
    disabled: true,
  })

  return items
})
</script>
