<template>
  <el-main class="DomainFixturesPage">
    <Breadcrumb :items="breadcrumb" />
    <h1 class="DomainFixturesPage-title">Fixtures</h1>
    <div class="DomainFixturesPage-stack">
      <ActionsBar>
        <AddFixtureButton
          v-if="canWrite && domainModel.length > 0"
          :to="$routes.projectFixtureCreate(project)"
        />
      </ActionsBar>
      <Panel v-if="domainModel.length === 0" type="info">
        {{ canWrite ? 'Create entities in the domain model before adding fixtures.' : 'This project has no entities in its domain model yet.' }}
      </Panel>
      <template v-else>
        <DomainFixtureTableOfContents
          v-if="showTableOfContents"
          :items="tableOfContentsItems"
        />
        <el-row :gutter="24">
          <el-col
            v-for="entity in domainModel"
            :key="entity.id"
            :xs="24"
            :md="12"
            :xl="8"
            class="DomainFixturesPage-column"
          >
            <DomainFixtureGroup
              :anchor-id="getEntityAnchorId(entity.id as string)"
              :can-write="canWrite"
              :create-link="$routes.projectFixtureCreate(project, entity.id as string)"
              :entity="entity"
              :entity-link="$routes.projectDomainEntity(project, entity.id as string)"
              :fixture-link="(fixtureId) => $routes.projectFixture(project, fixtureId)"
              :fixtures="fixturesByEntityId[entity.id as string] ?? []"
            />
          </el-col>
        </el-row>
      </template>
    </div>
  </el-main>
</template>

<script setup async lang="ts">
import {
  type BreadcrumbItems,
  type DomainEntityList,
  type DomainFixtureList,
  OrganizationPermission,
  type Project,
  ProjectPermission
} from '~/types'

definePageMeta({
  auth: false,
  alias: '/project/:projectSlug/domain-model/fixtures'
})

const { $api, $routes } = useNuxtApp()
const { params } = useRoute()

const project = ref<Project>(await $api.getProject(params.projectSlug, params.organizationSlug))
const domainModel = ref<DomainEntityList>(await $api.getProjectDomainModel(project.value.id))
const projectFixtures = ref<DomainFixtureList>(await $api.getProjectFixtures(project.value.id))

useHead({
  title: `Fixtures - ${project.value.title}${project.value.organization ? ` - ${project.value.organization.name}` : ''} | Dentest`
})

const canWrite = computed(() => project.value.permissions.some(
  permission => [ProjectPermission.Admin, ProjectPermission.Write].includes(permission)
) || (
  !!project.value.organization &&
  project.value.organization.permissions.some(permission =>
    [OrganizationPermission.Admin, OrganizationPermission.ProjectWrite].includes(permission)
  )
))

const fixturesByEntityId = computed<Record<string, DomainFixtureList>>(() =>
  projectFixtures.value.reduce((groups, fixture) => {
    if (!groups[fixture.entity.id]) {
      groups[fixture.entity.id] = []
    }

    groups[fixture.entity.id].push(fixture)

    return groups
  }, {} as Record<string, DomainFixtureList>)
)

const getEntityAnchorId = (entityId: string): string => `fixture-entity-${entityId}`

const tableOfContentsItems = computed(() => domainModel.value.map(entity => ({
  anchorId: getEntityAnchorId(entity.id as string),
  label: entity.name
})))

const showTableOfContents = computed(() => domainModel.value.length > 3)

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
    disabled: true,
  })

  return items
})
</script>

<style scoped>
.DomainFixturesPage-stack {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.DomainFixturesPage-title {
  margin: 0;
}

.DomainFixturesPage-column {
  margin-bottom: 2rem;
}

.DomainFixturesPage :deep(.actions-bar) {
  margin: 0;
}

.DomainFixturesPage :deep(.DomainFixtureTableOfContents-card) {
  margin-bottom: 0;
}
</style>
