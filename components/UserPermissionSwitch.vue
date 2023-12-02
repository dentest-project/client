<template>
  <el-popover
    placement="top-start"
    title="Role definition"
    :width="200"
    trigger="hover"
    :content="message"
  >
    <template #reference>
      <el-button size="small" :type="value ? 'primary' : 'default'" :disabled="disabled" @click="onClick">{{ label }}</el-button>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { OrganizationPermission, ProjectPermission } from '~/types'

const props = defineProps<{
  label: string,
  message: string,
  value: boolean,
  permission: OrganizationPermission | ProjectPermission,
  disabled: boolean
}>()

const emit = defineEmits(['update:value'])

const onClick = () => {
  if (props.disabled) {
    return
  }

  emit('update:value', {
    value: !props.value,
    permission: props.permission
  })
}
</script>
