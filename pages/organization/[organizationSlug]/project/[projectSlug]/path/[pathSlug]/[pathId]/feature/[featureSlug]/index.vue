<template>
  <el-container>
    <el-main class="Feature-main">
      <div style="width: 100%; box-sizing: border-box;">
        <Breadcrumb :items="breadcrumb" />
        <EditableTitle
          v-if="isLoggedIn && canWrite && feature.status === FeatureStatus.Draft"
          v-model="feature.title"
          label="Title"
          @update:modelValue="markUnsaved"
          @cancel="markSaved"
          @submit="save"
        />
        <h1 v-else>{{ feature.title }}</h1>
        <ActionsBar>
          <FeatureStatusButton v-if="canWrite" :status="feature.status" @click="updateFeatureStatus" />
          <FeatureStatusChip v-else :status="feature.status" />
          <SaveStatusChip v-if="canWrite && feature.status === FeatureStatus.Draft" :status="saveStatus" />
          <DeleteButton v-if="canWrite && feature.status === FeatureStatus.Draft" label="Delete feature" @deleted="onDeleted" />
        </ActionsBar>
        <div>
          <FeatureIssuesCollection
            v-model="feature.issues"
            :mode="isLoggedIn && canWrite && feature.status === FeatureStatus.Draft ? Mode.Edit : Mode.View"
            :issue-trackers="issueTrackerConfigurations.map(c => c.issueTracker)"
            @update:model-value="prepareSave"
          />
        </div>
        <TagsSelector
          v-if="canWrite && feature.status === FeatureStatus.Draft"
          :project="feature.rootProject as Project"
          :model-value="feature.tags"
          @update:model-value="onTagsSelected"
        />
        <TagsList v-else :tags="feature.tags" />
        <Panel type="info" bold>
          <EditableParagraph
            placeholder="Feature description"
            :editable="canWrite && feature.status === FeatureStatus.Draft"
            v-model="feature.description"
            @update:modelValue="markUnsaved"
            @cancel="markSaved"
            @submit="save"
          />
        </Panel>
        <ScenarioList
          v-model="feature.scenarios"
          :project="feature.rootProject as Project"
          :can-write="canWrite && feature.status === FeatureStatus.Draft"
          @update:modelValue="prepareSave"
          @scenario-added="saveScenariosInstantly"
        />
      </div>
    </el-main>
    <el-aside v-if="isLoggedIn && canWrite && feature.status === FeatureStatus.Draft" class="Feature-side">
      <StepsBank :project="feature.rootProject as Project" />
    </el-aside>
  </el-container>
</template>

<script setup async lang="ts">
import { ElNotification } from 'element-plus'
import { isAuthenticated } from '~/helpers/auth'
import {
  type BreadcrumbItems,
  type Feature,
  FeatureStatus,
  Mode,
  OrganizationPermission,
  type Path,
  type Project,
  ProjectPermission,
  SaveStatus, type Scenario, type Tag
} from '~/types'

definePageMeta({
  auth: false,
  alias: '/project/:projectSlug/path/:pathSlug/:pathId/feature/:featureSlug'
})

const { $api, $router, $routes } = useNuxtApp()
const { params } = useRoute()
const { status } = useAuth()

const feature = ref<Feature>(await $api.getFeature(params.pathId, params.featureSlug));
const issueTrackerConfigurations = ref(await $api.getFeatureIssueTrackerConfigurations(params.pathId, params.featureSlug))
const saveStatus = ref(SaveStatus.Saved)

let saveTimeout;

useHead({
  title: (feature.value.rootProject?.organization
    ? `${feature.value.title} - ${feature.value.rootProject?.title} - ${feature.value.rootProject?.organization.name}`
    : `${feature.value.title} - ${feature.value.rootProject?.title}`) + ' | Dentest'
})

const updateFeatureStatus = async () => {
  try {
    await $api.updateFeatureStatus({
      status: nextStatus.value,
      id: feature.value.id
    })
    feature.value.status = nextStatus.value

    ElNotification({
      title: 'Feature status updated',
      message: 'The feature status has been successfully updated',
      type: 'success',
    })
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while updating the feature status',
      type: 'error',
    })
  }
}

const onDeleted = async () => {
  try {
    await $api.deleteFeature(feature.value.id)

    ElNotification({
      title: 'Feature deleted',
      message: 'The feature has been successfully deleted',
      type: 'success',
    })

    $router.push($routes.path(feature.value.path))
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while deleting the feature',
      type: 'error',
    })
  }
}

const markUnsaved = () => {
  saveStatus.value = SaveStatus.NotSaved
}

const markSaved = () => {
  saveStatus.value = SaveStatus.Saved
}

const onTagsSelected = async (tags: Tag[]) => {
  feature.value.tags = await new Promise((resolve) => {
    resolve(tags)
  })

  prepareSave()
}

const prepareSave = () => {
  saveStatus.value = SaveStatus.NotSaved

  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  saveTimeout = setTimeout(() => {
    save()
  }, 2000)
}

const saveScenariosInstantly = (scenarios: Scenario[]) => {
  feature.value.scenarios = scenarios

  saveStatus.value = SaveStatus.NotSaved

  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  save()
}

const save = async () => {
  try {
    saveStatus.value = SaveStatus.Saving

    const savedFeature = await $api.saveFeature({
      id: feature.value.id,
      title: feature.value.title,
      description: feature.value.description,
      scenarios: feature.value.scenarios,
      tags: feature.value.tags,
      issues: feature.value.issues,
      path: {
        id: feature.value.path.id
      }
    })

    saveStatus.value = SaveStatus.Saved

    if (savedFeature.slug !== params.featureSlug) {
      $router.push($routes.feature(savedFeature.path, savedFeature))
    }

    feature.value = savedFeature
  } catch (error) {
    saveStatus.value = SaveStatus.NotSaved
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while saving the feature',
      type: 'error',
    })
  }
}

const nextStatus = computed(() => {
  if (feature.value.status === FeatureStatus.Draft) {
    return FeatureStatus.ReadyToDev
  }

  return feature.value.status === FeatureStatus.ReadyToDev ? FeatureStatus.Live : FeatureStatus.Draft
})

const canWrite = computed(() => !!feature.value.rootProject &&
  (
    feature.value.rootProject.permissions.some(p => ([ProjectPermission.Admin, ProjectPermission.Write] as ProjectPermission[]).includes(p)) ||
    (
      !!feature.value.rootProject.organization &&
      feature.value.rootProject.organization.permissions.some(p => ([OrganizationPermission.Admin, OrganizationPermission.ProjectWrite] as OrganizationPermission[]).includes(p))
    )
  )
)

const breadcrumb = computed((): BreadcrumbItems => {
  const items = [
    {
      text: feature.value.title,
      href: '',
      disabled: true
    }
  ] as BreadcrumbItems
  let currentPath: Path | undefined = feature.value.path

  while (currentPath !== undefined) {
    items.push({
      text: currentPath.project ? currentPath.project.title : currentPath.path,
      href: $routes.path(currentPath),
      disabled: false,
    })

    if (currentPath.project && currentPath.project.organization) {
      items.push({
        text: currentPath.project.organization.name,
        href: $routes.organization(
          currentPath.project?.organization.slug
        ),
        disabled: false,
      })
    }

    currentPath = currentPath.parent
  }

  return items.reverse()
})

const isLoggedIn = computed(() => isAuthenticated(status.value))
</script>

<style scoped>
.Feature-main, .Feature-side {
  overflow-y: auto;
  height: calc(100vh - 65px);
}

.Feature-side {
  padding: 1rem;
}

@media (max-width: 800px), (orientation: portrait) {
  .Feature-side {
    display: none;
  }
}

</style>
