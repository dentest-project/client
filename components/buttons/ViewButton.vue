<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.secondary" fab dark x-small>
    <v-icon>mdi-eye</v-icon>
  </v-btn>
</template>
