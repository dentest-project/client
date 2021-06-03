<template>
  <v-btn
    @click="(e) => $emit('click', e)"
    :color="$colors.tertiary"
    fab
    dark
    x-small
    title="Add an organization"
  >
    <v-icon>mdi-domain-plus</v-icon>
  </v-btn>
</template>
