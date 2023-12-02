<template>
  <v-chip
    class="insert-column-before-chip"
    :color="$colors.primary"
    x-small
        @click="(e) => $emit('click', e)"
  >
    <v-icon x-small>mdi-table-column-plus-before</v-icon>
  </v-chip>
</template>

<style scoped>
.insert-column-before-chip:hover {
  cursor: pointer;
}
</style>
