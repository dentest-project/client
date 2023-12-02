<template>
  <v-btn :color="$colors.error" text outlined @click="$emit('click')">
    <slot />
  </v-btn>
</template>
