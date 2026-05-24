<template>
  <el-main>
    <Breadcrumb :items="breadcrumb" />
    <DomainFixtureEditor
      :can-write="canWrite"
      :entity-selectable="false"
      :entity-link="(entityId) => $routes.projectDomainEntity(project, entityId)"
      :initial-value="domainFixture"
      :project-domain-model="projectDomainModel"
      :project-fixtures="projectFixtures"
      save-label="Save fixture"
      @submit="onSubmitted"
    >
      <template v-if="canWrite" #header-actions>
        <DeleteButton label="Delete fixture" @deleted="onDeleted" />
      </template>
    </DomainFixtureEditor>
  </el-main>
</template>

<script setup async lang="ts">
import { ElNotification } from 'element-plus'
import {
  createDomainFixtureDraft,
  toUpdateDomainFixtureRequest
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
  alias: '/project/:projectSlug/domain-model/fixtures/:fixtureId'
})

const route = useRoute()
const { $api, $router, $routes } = useNuxtApp()

const project = ref<Project>(await $api.getProject(route.params.projectSlug, route.params.organizationSlug))
const projectDomainModel = ref<DomainEntityList>(await $api.getProjectDomainModel(project.value.id))
const projectFixtures = ref<DomainFixtureList>(await $api.getProjectFixtures(project.value.id))
const fixture = await $api.getDomainFixtureById(route.params.fixtureId as string)
const domainFixture = ref<DomainFixtureDraft>(
  createDomainFixtureDraft(fixture, project.value.id, projectDomainModel.value, projectFixtures.value)
)

useHead({
  title: `${domainFixture.value.name} - ${project.value.title}${project.value.organization ? ` - ${project.value.organization.name}` : ''} | Dentest`
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
    const updatedFixture = await $api.updateDomainFixture(
      project.value.id,
      toUpdateDomainFixtureRequest(submittedFixture, projectDomainModel.value)
    )

    projectFixtures.value = await $api.getProjectFixtures(project.value.id)
    domainFixture.value = createDomainFixtureDraft(updatedFixture, project.value.id, projectDomainModel.value, projectFixtures.value)

    ElNotification({
      title: 'Fixture updated',
      message: 'The fixture has been successfully updated',
      type: 'success',
    })
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: formatApiErrorMessage(error, 'An error occurred while updating the fixture'),
      type: 'error',
    })
  }
}

const onDeleted = async () => {
  try {
    await $api.deleteDomainFixture(route.params.fixtureId as string)

    ElNotification({
      title: 'Fixture deleted',
      message: 'The fixture has been successfully deleted',
      type: 'success',
    })

    await $router.push($routes.projectFixtures(project.value))
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: formatApiErrorMessage(error, 'An error occurred while deleting the fixture'),
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
    text: domainFixture.value.name,
    href: $routes.projectFixture(project.value, route.params.fixtureId as string),
    disabled: true,
  })

  return items
})
</script>
