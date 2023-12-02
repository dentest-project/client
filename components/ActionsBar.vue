<template>
  <el-row class="actions-bar">
    <slot />
  </el-row>
</template>

<style scoped>
.actions-bar {
  margin: 1rem 0 2rem;
}

.actions-bar > * {
  margin: 0.2rem;
}
</style>
