<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.primary"
    title="Defined choices"
    elevation="0"
    fab
    dark
    x-small
  >
    <v-icon>mdi-format-list-bulleted</v-icon>
  </v-btn>
</template>
