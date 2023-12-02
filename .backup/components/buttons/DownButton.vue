<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.quaternary"
    elevation="0"
    fab
        x-small
    title="Move down"
  >
    <v-icon>mdi-arrow-down</v-icon>
  </v-btn>
</template>
