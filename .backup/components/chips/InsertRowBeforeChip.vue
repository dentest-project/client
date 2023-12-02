<template>
  <v-chip
    class="insert-row-before-chip"
    :color="$colors.primary"
    x-small
        @click="(e) => $emit('click', e)"
  >
    <v-icon x-small>mdi-table-row-plus-before</v-icon>
  </v-chip>
</template>

<style scoped>
.insert-row-before-chip:hover {
  cursor: pointer;
}
</style>
