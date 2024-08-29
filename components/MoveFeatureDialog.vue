<template>
  <client-only>
    <el-dialog :model-value="modelValue" @update:model-value="onDialogStatusChanged" :title="`Move feature '${feature.title}'`">
      <FolderTree
        v-if="tree.length > 0"
        :default="path"
        :tree="tree"
        @update:model-value="onDestinationSelected"
      />
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import buildTree from '../helpers/buildTree'
import type { Path, PathFeature } from '~/types'

const props = defineProps<{
  modelValue: boolean,
  feature: PathFeature,
  path: Path
}>()
const { $api } = useNuxtApp()

const emit = defineEmits(['moved', 'update:modelValue'])

const rootPath = ref<Path | null>(null)

const onDestinationSelected = async (newParent: Path) => {
  try {
    await $api.updateFeaturePath({
      id: props.feature.id,
      newParentId: newParent.id
    })

    emit('moved')
    ElNotification({
      title: 'Feature moved',
      message: 'The feature has been successfully moved',
      type: 'success',
    })
  } catch {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while moving the feature',
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

  const root = buildTree(treeRootPath, false)

  return [ root ]
})

watch(props, async (v) => {
  if (v && !rootPath.value) {
    rootPath.value = await $api.getPathRoot(props.path.id)
  }
})
</script>
