<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.quaternary"
    elevation="0"
    fab
        x-small
    title="Add a folder"
  >
    <v-icon>mdi-folder-plus</v-icon>
  </v-btn>
</template>
