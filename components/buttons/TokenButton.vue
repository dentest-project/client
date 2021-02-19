<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.quaternary" fab dark x-small title="Get pull token">
    <v-icon>mdi-key-variant</v-icon>
  </v-btn>
</template>
