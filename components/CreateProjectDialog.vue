<template>
  <client-only>
    <el-dialog :model-value="modelValue" @update:modelValue="onDialogStatusChanged" title="Create a project">
      <form @submit.prevent="onSubmit">
        <el-input v-model="projectName" placeholder="Project name" autofocus required clearable />
        <el-select v-model="projectVisibility">
          <el-option v-for="visibility of visibilities" :label="visibility.label" :value="visibility.value" />
        </el-select>
        <el-input type="submit" value="Create project" />
      </form>
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { type CreateProject, type Organization, ProjectVisibility } from '~/types'

const props = defineProps<{
  modelValue: boolean
  organization?: Organization
}>()
const { $api } = useNuxtApp()

const emit = defineEmits(['created', 'update:modelValue'])

const projectName = ref('')
const projectVisibility = ref(ProjectVisibility.Public)

const onSubmit = async () => {
  if (projectName.value.trim() === '') {
    return
  }

  const newProject = {
    title: projectName.value,
    visibility: projectVisibility.value,
    rootPath: {
      path: '/'
    }
  } as CreateProject

  if (props.organization && props.organization.id) {
    newProject.organization = { id: props.organization.id }
  }

  try {
    await $api.createProject(newProject)

    ElNotification({
      title: 'Project created',
      message: 'The project has been successfully created',
      type: 'success',
    })

    emit('created')
    emit('update:modelValue', false)

    projectName.value = ''
    projectVisibility.value = ProjectVisibility.Public
  } catch (error) {
    if (error.statusCode === 409) {
      ElNotification({
        title: 'Already taken',
        message: 'The project name already exists',
        type: 'error',
      })
    } else {
      ElNotification({
        title: 'An error occurred',
        message: 'An error occurred while creating the project',
        type: 'error',
      })
    }
  }
}

const onDialogStatusChanged = (e: boolean) => {
  emit('update:modelValue', e)
}

const visibilities = computed(() => props.organization ? [
  {
    label: 'Public',
    value: ProjectVisibility.Public
  },
  {
    label: 'Internal',
    value: ProjectVisibility.Internal
  },
  {
    label: 'Private',
    value: ProjectVisibility.Private
  },
] : [
  {
    label: 'Public',
    value: ProjectVisibility.Public
  },
  {
    label: 'Private',
    value: ProjectVisibility.Private
  },
])
</script>

<style scoped>
.el-input, .el-select {
  margin: 0.5rem;
}
</style>
