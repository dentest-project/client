<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.quaternary" fab dark x-small title="Copy">
    <v-icon>mdi-content-copy</v-icon>
  </v-btn>
</template>
