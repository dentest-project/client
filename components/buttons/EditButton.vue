<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.primary"
    elevation="0"
    fab
    dark
    x-small
  >
    <v-icon>mdi-pencil</v-icon>
  </v-btn>
</template>
