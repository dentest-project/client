<template>
  <div>
    <slot />
  </div>
</template>

<style scoped>
div {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}

@media screen and (max-width: 640px) {
  div {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media screen and (min-width: 641px) and (max-width: 768px) {
  div {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
