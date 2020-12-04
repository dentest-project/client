<template>
  <v-chip
    class="insert-column-after-chip"
    :color="$colors.primary"
    x-small
    dark
    @click="e => $emit('click', e)"
  >
    <v-icon x-small>mdi-table-column-plus-after</v-icon>
  </v-chip>
</template>

<style scoped>
.insert-column-after-chip:hover {
  cursor: pointer;
}
</style>
