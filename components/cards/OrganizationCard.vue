<template>
  <v-card elevation="3" :color="$colors.tertiary" dark>
    <v-card-title>{{ organization.name }}</v-card-title>
    <v-card-actions>
      <primary-card-link-button :to="$routes.organization(organization.slug)">See organization</primary-card-link-button>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import PrimaryCardLinkButton from '~/components/buttons/PrimaryCardLinkButton.vue';
import { Organization } from '~/types';

export default Vue.extend({
  components: {
    PrimaryCardLinkButton
  },
  props: {
    organization: {
      type: Object,
      required: true
    } as PropOptions<Organization>,
  }
});
</script>
s
