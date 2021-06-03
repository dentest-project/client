<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.secondary"
    title="With no param"
    fab
    dark
    x-small
  >
    <v-icon>mdi-circle-off-outline</v-icon>
  </v-btn>
</template>
