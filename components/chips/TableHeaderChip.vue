<template>
  <v-chip
    class="table-header-chip"
    title="Make / unmake header"
    x-small
    dark
    @click="(e) => $emit('click', e)"
  >
    <v-icon x-small>mdi-format-title</v-icon>
  </v-chip>
</template>

<style scoped>
.table-header-chip:hover {
  cursor: pointer;
}
</style>
