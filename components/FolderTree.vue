<template>
  <el-tree
    :data="tree"
    node-key="id"
    :expand-on-click-node="false"
    default-expand-all
    highlight-current
    check-on-click-node
    @check="onChange"
  >
    <template #default="{ node, data }">
        <span :class="{ disabled: node.disabled }">{{ node.label }}</span>
    </template>
  </el-tree>
</template>

<script setup lang="ts">
import type { Path } from '~/types'
import type { TreeElement } from '~/types/component-types'

const props = defineProps<{
  tree: TreeElement[],
  default: Path
}>()

const active = ref<string[]>([])

const emit = defineEmits(['update:modelValue'])

onMounted(() => {
  active.value = [props.default.id]
})

const onChange = (value: Path) => {
  if (value.id === props.default.id) {
    return
  }

  emit('update:modelValue', value)
}
</script>

<style scoped>
.disabled {
  color: #777;
}
</style>
