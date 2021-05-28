<template>
  <main>
    <home-hero />
    <home-timeline />
  </main>
</template>

<script type="ts">
import HomeHero from '~/components/HomeHero.vue';
import HomeTimeline from '~/components/HomeTimeline.vue';

export default {
  components: { HomeHero, HomeTimeline }
};
</script>
