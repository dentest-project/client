<template>
  <v-card elevation="3" :color="$colors.primary" dark>
    <v-card-title>{{ project.title }}</v-card-title>
    <v-card-actions>
      <v-spacer />
      <primary-card-link-button :to="$routes.project(project.rootPath.id)">See project</primary-card-link-button>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import PrimaryCardLinkButton from '~/components/buttons/PrimaryCardLinkButton.vue';
import { Project } from '~/types';

export default Vue.extend({
  components: {
    PrimaryCardLinkButton
  },
  props: {
    project: {
      type: Object,
      required: true
    } as PropOptions<Project>,
  }
});
</script>
