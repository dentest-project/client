<template>
  <v-chip
    class="insert-row-after-chip"
    :color="$colors.primary"
    x-small
        @click="(e) => $emit('click', e)"
  >
    <v-icon x-small>mdi-table-row-plus-after</v-icon>
  </v-chip>
</template>

<style scoped>
.insert-row-after-chip:hover {
  cursor: pointer;
}
</style>
