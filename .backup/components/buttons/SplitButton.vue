<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.primary"
    elevation="0"
    title="Make param from selection"
    fab
        x-small
  >
    <v-icon>mdi-scissors-cutting</v-icon>
  </v-btn>
</template>
