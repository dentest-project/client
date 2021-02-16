<template>
  <v-card elevation="3" :color="$colors.quaternary" dark>
    <v-card-title>{{ path.path }}</v-card-title>
    <v-card-actions>
      <v-spacer />
      <primary-card-link-button :to="$routes.path(path)">Enter</primary-card-link-button>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import PrimaryCardLinkButton from '~/components/buttons/PrimaryCardLinkButton.vue';
import { Path } from '~/types';

export default Vue.extend({
  components: {
    PrimaryCardLinkButton
  },
  props: {
    path: {
      type: Object,
      required: true
    } as PropOptions<Path>,
  }
});
</script>
