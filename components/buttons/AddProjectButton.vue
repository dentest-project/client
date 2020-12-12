<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.primary" fab dark x-small title="Add a project">
    <v-icon>mdi-plus-box</v-icon>
  </v-btn>
</template>
