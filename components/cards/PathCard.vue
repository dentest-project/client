<template>
  <v-card elevation="3" :color="$colors.quaternary" dark>
    <v-card-title>{{ path.path }}</v-card-title>
    <v-card-actions>
      <primary-card-link-button :to="$routes.path(path)"
        >Enter</primary-card-link-button
      >
      <v-btn
        v-if="canWrite"
        @click="activateMoveDialog"
        small
        outlined
        dark
        text
        >Move</v-btn
      >
    </v-card-actions>
    <move-path-dialog
      v-model="moveDialogOpened"
      :path="path"
      :parent="parent"
      @submit="onMoveDialogSubmit"
    />
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import MovePathDialog from '~/components/dialogs/MovePathDialog.vue'
import PrimaryCardLinkButton from '~/components/buttons/PrimaryCardLinkButton.vue'
import { Path, UpdatePathParent } from '~/types'

export default Vue.extend({
  components: {
    MovePathDialog,
    PrimaryCardLinkButton,
  },
  props: {
    path: {
      type: Object,
      required: true,
    } as PropOptions<Path>,
    parent: {
      type: Object,
      required: true,
    } as PropOptions<Path>,
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
    onMoveDialogSubmit(newPath: UpdatePathParent) {
      this.$emit('moved', newPath)
      this.moveDialogOpened = false
    },
  },
})
</script>
