<template>
  <el-tag
    :color="tag.color + (outline ? '55' : '')"
    :class="['TagChip', (hoverable && 'TagChip--hoverable')]"
    :style="{ color: `${textColor}${outline ? '55': ''}` }"
    disable-transitions
  >
    {{ tag.name }}
  </el-tag>
</template>

<script setup lang="ts">
import { blackOrWhite } from '~/helpers/blackOrWhite'
import type { Tag } from '~/types'

const props = defineProps<{
  tag: Tag,
  outline?: boolean,
  hoverable?: boolean
}>()

const textColor = computed(() => blackOrWhite(props.tag.color))
</script>

<style>
.TagChip--hoverable:hover {
  cursor: pointer;
}
</style>
