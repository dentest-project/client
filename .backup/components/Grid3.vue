<template>
  <div class="grid3">
    <slot />
  </div>
</template>

<style scoped>
.grid3 {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}

@media screen and (max-width: 640px) {
  .grid3 {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media screen and (min-width: 641px) and (max-width: 768px) {
  .grid3 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
