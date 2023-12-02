<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.secondary"
    elevation="0"
    fab
        x-small
    title="Add a feature"
  >
    <v-icon>mdi-text-box-plus</v-icon>
  </v-btn>
</template>
