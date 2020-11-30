<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.secondary" fab dark x-small>
    <v-icon>mdi-text-box</v-icon>
  </v-btn>
</template>
