<template>
  <v-card elevation="3" :color="$colors.secondary" dark>
    <v-card-title>{{ feature.title }}</v-card-title>
    <v-card-actions>
      <secondary-card-link-button :to="$routes.feature(path, feature)">See feature</secondary-card-link-button>
      <v-btn v-if="canWrite" @click="activateMoveDialog" small outlined dark text>Move</v-btn>
    </v-card-actions>
    <move-feature-dialog v-model="moveDialogOpened" :feature="feature" :path="path" @submit="onMoveDialogSubmit" />
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import SecondaryCardLinkButton from '~/components/buttons/SecondaryCardLinkButton.vue';
import MoveFeatureDialog from '~/components/dialogs/MoveFeatureDialog.vue';
import { Feature, Path, UpdateFeaturePath } from '~/types';

export default Vue.extend({
  components: {
    MoveFeatureDialog,
    SecondaryCardLinkButton
  },
  props: {
    path: {
      type: Object,
      required: true
    } as PropOptions<Path>,
    feature: {
      type: Object,
      required: true
    } as PropOptions<Feature>,
    canWrite: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      moveDialogOpened: false
    }
  },
  methods: {
    activateMoveDialog() {
      this.moveDialogOpened = true;
    },
    onMoveDialogSubmit(newPath: UpdateFeaturePath) {
      this.$emit('moved', newPath);
      this.moveDialogOpened = false;
    }
  }
});
</script>
