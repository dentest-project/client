<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.quaternary"
    elevation="0"
    fab
        x-small
    title="Copy"
  >
    <v-icon>mdi-content-copy</v-icon>
  </v-btn>
</template>
