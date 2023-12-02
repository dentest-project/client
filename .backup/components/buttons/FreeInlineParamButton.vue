<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.primary"
    title="Free text param"
    elevation="0"
    fab
        x-small
  >
    <v-icon>mdi-message</v-icon>
  </v-btn>
</template>
