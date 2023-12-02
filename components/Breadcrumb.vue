<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="item in items">
      <NuxtLink v-if="item.href && !item.disabled" :to="item.href">{{ item.text }}</NuxtLink>
      <span v-else>{{ item.text }}</span>
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
