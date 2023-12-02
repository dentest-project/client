<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.secondary"
    elevation="0"
    fab
        x-small
  >
    <v-icon>mdi-eye</v-icon>
  </v-btn>
</template>
