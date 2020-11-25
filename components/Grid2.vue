<template>
  <div>
    <slot />
  </div>
</template>

<style scoped>
div {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
}
</style>

