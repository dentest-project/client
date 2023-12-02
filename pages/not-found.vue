<template>
  <el-main>
    <h1>Not found</h1>
    <p>This page does not exist.</p>
    <p>
      <a :href="$routes.home()">Go to home page</a>
    </p>
  </el-main>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'This page does not exist | Dentest'
})
</script>
