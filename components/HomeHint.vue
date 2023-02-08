<template>
  <div class="home-hint">
    <img :src="image" :alt="alt" />
    <span>{{ content }}</span>
  </div>
</template>

<script type="ts">
export default {
  props: {
    image: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    }
  },
}
</script>

<style scoped>
.home-hint {
  display: flex;
  flex-direction: column;
  text-align: center;
  max-width: 150px;
  padding: 1rem;
  font-style: italic;
  font-size: 0.9rem;
}

.home-hint img {
  max-width: 200px;
}
</style>
