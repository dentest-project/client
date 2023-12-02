<template>
  <client-only>
    <el-dialog :model-value="modelValue" @update:modelValue="onDialogStatusChanged" :title="`Move folder '${path.path}'`">
      <FolderTree
        v-if="tree.length > 0"
        :default="parent"
        :tree="tree"
        @update:modelValue="onDestinationSelected"
      />
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import buildTree from '../helpers/buildTree'
import type { Path } from '~/types'

const props = defineProps<{
  modelValue: boolean,
  path: Path,
  parent: Path
}>()
const { $api } = useNuxtApp()

const emit = defineEmits(['moved', 'update:modelValue'])

const rootPath = ref<Path | null>(null)

const onDestinationSelected = async (newParent: Path) => {
  try {
    await $api.updatePathParent({
      id: props.path.id,
      newParentId: newParent.id
    })

    emit('moved')
    ElNotification({
      title: 'Project moved',
      message: 'The folder has been successfully moved',
      type: 'success',
    })
  } catch {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while moving the folder',
      type: 'success',
    })
  }
}

const onDialogStatusChanged = (e: boolean) => {
  emit('update:modelValue', e)
}

const tree = computed(() => {
  const treeRootPath = rootPath.value

  if (!treeRootPath) {
    return []
  }

  const root = buildTree(treeRootPath, false, props.path.id)

  return [ root ]
})

watch(props, async (v) => {
  if (v && !rootPath.value) {
    rootPath.value = await $api.getPathRoot(props.path.id)
  }
})
</script>
