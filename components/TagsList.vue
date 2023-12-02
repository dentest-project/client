<template>
  <TagChip v-for="tag in tags" class="tagsList-tag" :tag="tag" />
</template>

<script setup lang="ts">
import type { Tag } from '~/types'

defineProps<{
  tags: Tag[]
}>()
</script>

<style scoped>
.tagsList-tag {
  margin: 1rem 0.5rem 1rem 0;
}
</style>
