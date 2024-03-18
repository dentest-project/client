<template>
  <el-main>
    <Breadcrumb :items="breadcrumb" />
    <EditableTitle
      v-if="isLoggedIn && (canAdministrate || (!isProject && canWrite))"
      v-model="title"
      label="Title"
      @submit="onTitleSubmitted"
    />
    <h1 v-else>{{ title }}</h1>
    <ActionsBar>
      <AddFeatureButton v-if="canWrite" @click="createFeatureDialog = true" />
      <AddFolderButton v-if="canWrite" @click="createFolderDialog = true" />
      <GetPullTokenButton v-if="canPull" @click="getPullTokenDialog = true" />
      <UsersLink v-if="canAdministrate" :to="usersLink" />
      <VisibilityButton v-if="canAdministrate && path.rootProject" :visibility="path.rootProject.visibility" @click="onVisibilityUpdated" />
      <LeaveButton v-if="isProjectUser" label="Leave project" @left="onProjectLeft" />
      <DeleteButton v-if="canDelete" :label="deleteButtonLabel" @deleted="onDeleted" />
    </ActionsBar>
    <el-row :gutter="20">
      <el-col v-for="child in path.children" :span="6" :md="6" :sm="12" :xs="24">
        <FolderCard :path="child" :parent="path" :can-write="canWrite" @moved="reload" />
      </el-col>
      <el-col v-for="feature in path.features" :span="6" :md="6" :sm="12" :xs="24">
        <FeatureCard :feature="feature" :path="path" :can-write="canWrite" @moved="reload" />
      </el-col>
    </el-row>
    <Panel v-if="path.children.length === 0 && path.features.length === 0 && canWrite" type="warning">
      <el-text size="default">
        Currently, there's nothing here. You can either create features, or folders to organize them, by clicking
        on the dedicated buttons above.
      </el-text>
    </Panel>
  </el-main>
  <CreateFolderDialog v-if="canWrite" v-model="createFolderDialog" :path="path" @created="reload" />
  <CreateFeatureDialog v-if="canWrite" v-model="createFeatureDialog" :path="path" @created="reload" />
  <GetPullTokenDialog v-if="canPull" v-model="getPullTokenDialog" :project="path.rootProject" />
</template>

<script setup async lang="ts">
import { ElNotification } from 'element-plus'
import { isAuthenticated, loggedInUser } from '~/helpers/auth'
import {
  type BreadcrumbItems,
  OrganizationPermission,
  type Path,
  ProjectPermission,
  ProjectVisibility
} from '~/types'

definePageMeta({
  auth: false,
  alias: '/project/:projectSlug/path/:pathSlug/:pathId'
})

const { $api, $router, $routes } = useNuxtApp()
const { params } = useRoute()
const { status } = useAuth()

const path = ref<Path>(await $api.getPath(params.pathId))
const title = ref(path.value.project ? path.value.project.title : path.value.path)
const createFolderDialog = ref(false)
const createFeatureDialog = ref(false)
const getPullTokenDialog = ref(false)

useHead({
  title: (path.value.rootProject?.organization
    ? `${path.value.path} - ${path.value.rootProject?.title} - ${path.value.rootProject?.organization.name}`
    : `${path.value.path} - ${path.value.rootProject?.title}`) + ' | Dentest'
})

const { data } = useAuth()

const reload = async () => {
  path.value = await $api.getPath(params.pathId)
  title.value = path.value.project ? path.value.project.title : path.value.path
}

const onTitleSubmitted = async () => {
  if (isProject.value) {
    try {
      const project = {
        ...path.value.project,
        title: title.value
      }

      const updatedProject = await $api.updateProject(project)

      ElNotification({
        title: 'Project title updated',
        message: 'The project title has been successfully updated',
        type: 'success',
      })

      if (updatedProject.slug !== params.projectSlug) {
        await $router.push($routes.project(updatedProject))
      }
    } catch (error) {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while updating the project title',
        type: 'error',
      })
    }
  } else {
    try {
      if (path.value.path === title.value) {
        return
      }

      const updatedPath = await $api.updatePath({
        id: path.value.id,
        path: title.value,
      })

      ElNotification({
        title: 'Folder title updated',
        message: 'The folder title has been successfully updated',
        type: 'success',
      })

      if (updatedPath.slug !== params.pathSlug) {
        await $router.push($routes.path(updatedPath))
      }
    } catch (error) {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while updating the folder title',
        type: 'error',
      })
    }
  }

  await reload()
}

const onVisibilityUpdated = async () => {
  try {
    if (!path.value.rootProject?.id) {
      return
    }

    await $api.updateProject(
      {
        id: path.value.rootProject.id,
        visibility: nextVisibility.value,
      }
    )
    await reload()

    ElNotification({
      title: 'Project visibility updated',
      message: 'The project visibility has been successfully updated',
      type: 'success',
    })
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while updating the project visibility',
      type: 'error',
    })
  }
}

const onProjectLeft = async () => {
  if (!path.value.rootProject) {
    return
  }

  try {
    await $api.deleteProjectUser(path.value.rootProject.id, loggedInUser(data.value).id)

    ElNotification({
      title: 'Project left',
      message: 'The project has been successfully left',
      type: 'success',
    })

    $router.push($routes.home())
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while leaving the project',
      type: 'error',
    })
  }
}

const onDeleted = async () => {
  if (path.value.project) {
    try {
      await $api.deleteProject(path.value.project.id)

      ElNotification({
        title: 'Project deleted',
        message: 'The project has been successfully deleted',
        type: 'success',
      })

      $router.push($routes.home())
    } catch (error) {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while deleting the project',
        type: 'error',
      })
    }
  } else {
    try {
      await $api.deletePath(path.value.id)

      ElNotification({
        title: 'Folder deleted',
        message: 'The folder has been successfully deleted',
        type: 'success',
      })

      $router.push($routes.project(path.value.rootProject))
    } catch (error) {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while deleting the folder',
        type: 'error',
      })
    }
  }
}

const canAdministrate = computed(() => path.value.rootProject && path.value.rootProject.permissions.includes(ProjectPermission.Admin))

const canWrite = computed(() => !!path.value.rootProject &&
  (
    path.value.rootProject.permissions.some(p => ([ProjectPermission.Admin, ProjectPermission.Write] as ProjectPermission[]).includes(p)) ||
    (
      !!path.value.rootProject.organization &&
      path.value.rootProject.organization.permissions.some(p => ([OrganizationPermission.Admin, OrganizationPermission.ProjectWrite] as OrganizationPermission[]).includes(p))
    )
  )
)

const canDelete = computed(() => path.value.project ? canAdministrate.value : canWrite.value)

const canPull = computed(() => path.value.rootProject && path.value.rootProject.permissions.includes(ProjectPermission.Pull))

const isProject = computed(() => !!path.value.project)

const isProjectUser = computed(() => path.value.rootProject &&
  (
    path.value.rootProject.permissions.some(p => [ProjectPermission.Admin, ProjectPermission.Write, ProjectPermission.Read, ProjectPermission.Pull].includes(p)) ||
    (
      path.value.rootProject.organization &&
      path.value.rootProject.organization.permissions.some(p => ([OrganizationPermission.Admin, OrganizationPermission.ProjectWrite] as OrganizationPermission[]).includes(p))
    )
  )
)

const deleteButtonLabel = computed(() => path.value.project ? 'Delete project' : 'Delete folder')

const nextVisibility = computed(() => {
  if (path.value.rootProject?.visibility === ProjectVisibility.Public) {
    return path.value.rootProject.organization ? ProjectVisibility.Internal : ProjectVisibility.Private
  }

  return path.value.rootProject.visibility === ProjectVisibility.Internal ? ProjectVisibility.Private : ProjectVisibility.Public
})

const usersLink = computed(() => path.value.rootProject ? $routes.projectUsers(path.value.rootProject) : '')

const breadcrumb = computed((): BreadcrumbItems => {
  const items = [] as BreadcrumbItems
  let currentPath: Path | undefined = path.value

  while (currentPath !== undefined) {
    items.push({
      text: currentPath.project ? currentPath.project.title : currentPath.path,
      href: currentPath.id,
      disabled: currentPath.id === path.value.id,
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
