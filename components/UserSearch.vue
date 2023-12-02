<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearchAsync"
    placeholder="Search users to add..."
    value-key="username"
    class="user-search"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import type { BaseUser } from '~/types'

const { $api } = useNuxtApp()
const { params } = useRoute()

const props = defineProps<{
  searchWithinOrganization: boolean
}>()

const emit = defineEmits(['selected'])

const state = ref('')

const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
  if (queryString.trim().length === 0) {
    cb([])
    return
  }

  const items = await $api.searchUsers(queryString, props.searchWithinOrganization ? params.organizationSlug : null)

  cb(items)
}

const handleSelect = (item: BaseUser) => {
  emit('selected', item)
}
</script>

<style>
.el-autocomplete.user-search,
.el-autocomplete.user-search .el-input,
.el-autocomplete.user-search input,
.el-autocomplete.user-search .el-input__wrapper {
  width: 100%;
}

.el-autocomplete.user-search {
  margin-bottom: 1rem;
}
</style>
