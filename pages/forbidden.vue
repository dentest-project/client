<template>
  <el-main>
    <h1>Forbidden</h1>
    <p>You don't have access to this page.</p>
    <p>
      <a :href="$routes.home()">Go to home page</a>
    </p>
  </el-main>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'You do not have access to this page | Dentest'
})
</script>
