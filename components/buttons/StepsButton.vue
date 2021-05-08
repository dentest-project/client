<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.primary" fab dark x-small>
    <v-icon>mdi-format-list-bulleted-type</v-icon>
  </v-btn>
</template>
