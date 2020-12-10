<template>
  <div class="grid2">
    <slot />
  </div>
</template>

<style scoped>
.grid2 {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
}
</style>
