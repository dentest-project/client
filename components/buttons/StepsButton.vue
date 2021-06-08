<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.quaternary"
    elevation="0"
    tile
    dark
    x-small
  >
    Show available steps
  </v-btn>
</template>
