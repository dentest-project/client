<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.secondary" title="With multiline param" fab dark x-small>
    <v-icon>mdi-text-box</v-icon>
  </v-btn>
</template>
