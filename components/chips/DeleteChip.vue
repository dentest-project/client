<template>
  <v-chip
    class="delete-chip"
    :color="$colors.error"
    x-small
    dark
    @click="e => $emit('click', e)"
  >
    <v-icon x-small>mdi-delete</v-icon>
  </v-chip>
</template>

<style scoped>
.delete-chip:hover {
  cursor: pointer;
}
</style>
