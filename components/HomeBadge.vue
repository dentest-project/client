<template>
  <div class="home-badge">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup type="ts">
const { title, description } = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
})
</script>

<style scoped>
.home-badge {
  text-align: center;
}
</style>
