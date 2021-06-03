<template>
  <v-btn dark :color="$colors.secondary" :to="to">{{ content }}</v-btn>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    to: String,
    content: String,
  },
})
</script>
