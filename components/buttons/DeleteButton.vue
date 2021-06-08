<template>
  <v-btn
    :color="$colors.error"
    @click="(e) => $emit('click', e)"
    elevation="0"
    fab
    dark
    x-small
  >
    <v-icon>mdi-delete</v-icon>
  </v-btn>
</template>
