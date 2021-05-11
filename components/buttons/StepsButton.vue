<template>
  <v-btn @click="e => $emit('click', e)" :color="$colors.quaternary" dark x-small>
    Show available steps
  </v-btn>
</template>
