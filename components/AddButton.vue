<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.add" fab dark x-small>
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>
