<template>
  <v-card elevation="3" :color="$colors.secondary" dark>
    <v-card-title>{{ feature.title }}</v-card-title>
    <v-card-actions>
      <v-spacer />
      <secondary-card-link-button :to="$routes.feature(feature.id)">See feature</secondary-card-link-button>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import SecondaryCardLinkButton from '~/components/buttons/SecondaryCardLinkButton.vue';
import { Feature } from '~/types';

export default Vue.extend({
  components: {
    SecondaryCardLinkButton
  },
  props: {
    feature: {
      type: Object,
      required: true
    } as PropOptions<Feature>,
  }
});
</script>
