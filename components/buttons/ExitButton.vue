<template>
  <v-btn :color="$colors.error" @click="e => $emit('click', e)" fab dark x-small>
    <v-icon>mdi-location-exit</v-icon>
  </v-btn>
</template>
