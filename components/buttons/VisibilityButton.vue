<template>
  <v-btn :color="color" @click="e => $emit('click', e)" :title="label" fab dark x-small>
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { ProjectVisibility } from '~/types';

export default Vue.extend({
  props: {
    visibility: {
      type: String,
      required: true
    } as PropOptions<ProjectVisibility>
  },
  methods: {

  },
  computed: {
    color: function (): string {
      const colors = (this as any).$colors;

      switch ((this as any).visibility) {
        case ProjectVisibility.Public:
          return colors.success;
        case ProjectVisibility.Internal:
          return colors.warning;
        default:
          return colors.error;
      }
    },
    icon: function (): string {
      switch ((this as any).visibility) {
        case ProjectVisibility.Public:
          return 'mdi-lock-open-variant';
        case ProjectVisibility.Internal:
          return 'mdi-lock-open';
        default:
          return 'mdi-lock';
      }
    },
    label: function (): string {
      switch ((this as any).visibility) {
        case ProjectVisibility.Public:
          return 'Public';
        case ProjectVisibility.Internal:
          return 'Internal';
        default:
          return 'Private';
      }
    }
  }
});
</script>
