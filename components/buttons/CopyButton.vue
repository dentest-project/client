<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.quaternary" fab dark x-small title="Move up">
    <v-icon>mdi-content-copy</v-icon>
  </v-btn>
</template>
