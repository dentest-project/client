<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.secondary" fab dark x-small>
    <v-icon>mdi-circle-off-outline</v-icon>
  </v-btn>
</template>
