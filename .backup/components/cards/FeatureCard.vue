<template>
  <v-card elevation="3" :color="$colors.secondary">
    <v-card-title>{{ feature.title }}</v-card-title>
    <v-card-actions>
      <secondary-card-link-button :to="$routes.feature(path, feature)">See feature</secondary-card-link-button>
      <v-btn
        v-if="canWrite"
        @click="activateMoveDialog"
        small
        outlined
                text
      >
        Move
      </v-btn>
      <v-spacer />
      <feature-status-chip :can-select="false" :feature="feature" />
    </v-card-actions>
    <move-feature-dialog
      v-model="moveDialogOpened"
      :feature="feature"
      :path="path"
      @submit="onMoveDialogSubmit"
    />
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import SecondaryCardLinkButton from '~/components/buttons/SecondaryCardLinkButton.vue'
import FeatureStatusChip from '~/components/chips/FeatureStatusChip.vue';
import MoveFeatureDialog from '~/components/dialogs/MoveFeatureDialog.vue'
import { Feature, Path, UpdateFeatureParentPath } from '~/types'

export default Vue.extend({
  components: {
    FeatureStatusChip,
    MoveFeatureDialog,
    SecondaryCardLinkButton,
  },
  props: {
    path: {
      type: Object,
      required: true,
    } as PropOptions<Path>,
    feature: {
      type: Object,
      required: true,
    } as PropOptions<Feature>,
    canWrite: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      moveDialogOpened: false,
    }
  },
  methods: {
    activateMoveDialog() {
      this.moveDialogOpened = true
    },
    onMoveDialogSubmit(newPath: UpdateFeatureParentPath) {
      this.$emit('moved', newPath)
      this.moveDialogOpened = false
    },
  },
})
</script>
