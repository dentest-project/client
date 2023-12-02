<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.primary"
    elevation="0"
    class="steps-button"
        fab
    large
  >
    Show<br />steps
  </v-btn>
</template>

<style scoped>
.steps-button {
  font-weight: bold;
  font-size: 0.8rem;
  z-index: 999;
}
</style>
