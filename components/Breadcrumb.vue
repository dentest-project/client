<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="item in items"
      :key="`${item.text}-${item.href ?? 'no-href'}-${item.disabled ? 'disabled' : 'enabled'}`"
    >
      <NuxtLink
        v-if="item.href && !item.disabled"
        :key="`link-${item.text}-${item.href}`"
        :to="item.href"
      >
        {{ item.text }}
      </NuxtLink>
      <span v-else :key="`label-${item.text}`">{{ item.text }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import type { BreadcrumbItems } from '~/types'
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps<{
  items: BreadcrumbItems
}>()
</script>
