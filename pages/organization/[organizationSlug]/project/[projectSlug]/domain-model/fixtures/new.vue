<template>
  <el-main>
    <Breadcrumb :items="breadcrumb" />
    <DomainFixtureEditor
      :can-write="canWrite"
      :entity-selectable="true"
      :entity-link="(entityId) => $routes.projectDomainEntity(project, entityId)"
      :initial-value="domainFixture"
      :project-domain-model="projectDomainModel"
      :project-fixtures="projectFixtures"
      save-label="Create fixture"
      @submit="onSubmitted"
    />
  </el-main>
</template>

<script setup async lang="ts">
import { ElNotification } from 'element-plus'
import {
  createEmptyDomainFixtureDraft,
  toCreateDomainFixtureRequest
} from '~/helpers/domainFixtures'
import { formatApiErrorMessage } from '~/helpers/domainModel'
import {
  type BreadcrumbItems,
  type DomainEntityList,
  type DomainFixtureDraft,
  type DomainFixtureList,
  OrganizationPermission,
  type Project,
  ProjectPermission
} from '~/types'

definePageMeta({
  auth: false,
  alias: [
    '/project/:projectSlug/domain-model/fixture/new',
    '/project/:projectSlug/domain-model/fixtures/new',
    '/organization/:organizationSlug/project/:projectSlug/domain-model/fixture/new'
  ]
})

const route = useRoute()
const { $api, $router, $routes } = useNuxtApp()
const entityId = Array.isArray(route.query.entityId) ? route.query.entityId[0] : route.query.entityId

const project = ref<Project>(await $api.getProject(route.params.projectSlug, route.params.organizationSlug))
const projectDomainModel = ref<DomainEntityList>(await $api.getProjectDomainModel(project.value.id))
const projectFixtures = ref<DomainFixtureList>(await $api.getProjectFixtures(project.value.id))
const domainFixture = ref<DomainFixtureDraft>(
  createEmptyDomainFixtureDraft(project.value.id, projectDomainModel.value, projectFixtures.value, entityId?.toString())
)

useHead({
  title: `New fixture - ${project.value.title}${project.value.organization ? ` - ${project.value.organization.name}` : ''} | Dentest`
})

const canWrite = computed(() => project.value.permissions.some(
  permission => [ProjectPermission.Admin, ProjectPermission.Write].includes(permission)
) || (
  !!project.value.organization &&
  project.value.organization.permissions.some(permission =>
    [OrganizationPermission.Admin, OrganizationPermission.ProjectWrite].includes(permission)
  )
))

const onSubmitted = async (submittedFixture: DomainFixtureDraft) => {
  try {
    const createdFixture = await $api.createDomainFixture(
      project.value.id,
      toCreateDomainFixtureRequest(submittedFixture, projectDomainModel.value)
    )

    ElNotification({
      title: 'Fixture created',
      message: 'The fixture has been successfully created',
      type: 'success',
    })

    await $router.push($routes.projectFixture(project.value, createdFixture.id as string))
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: formatApiErrorMessage(error, 'An error occurred while creating the fixture'),
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
    text: 'Fixtures',
    href: $routes.projectFixtures(project.value),
    disabled: false,
  })

  items.push({
    text: 'New fixture',
    href: $routes.projectFixtureCreate(project.value),
    disabled: true,
  })

  return items
})
</script>
