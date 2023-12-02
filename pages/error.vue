<template>
  <el-main>
    <h1>An error occurred</h1>
    <p>Something we didn't anticipate occurred. Sorry for that :(</p>
    <p>
      <a :href="$routes.home()">Go to home page</a>
    </p>
  </el-main>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'An error occurred | Dentest'
})
</script>
