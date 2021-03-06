<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.quaternary" fab dark x-small title="Move down">
    <v-icon>mdi-arrow-down</v-icon>
  </v-btn>
</template>
