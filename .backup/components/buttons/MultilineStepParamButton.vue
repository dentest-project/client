<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.secondary"
    title="With multiline param"
    elevation="0"
    fab
        x-small
  >
    <v-icon>mdi-text-box</v-icon>
  </v-btn>
</template>
