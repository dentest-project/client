<template>
  <div class="step-search">
    <v-autocomplete
      :loading="isAutocompleteLoading"
      :items="autocompleteItems"
      :search-input.sync="autocompleteSearch"
      solo
      @change="onAutocompleteChanged"
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            <v-btn small @mousedown="activateStepCreationDialog">
              <strong>Create a new step</strong>
            </v-btn>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-autocomplete>
    <create-step-dialog
      v-model="stepCreationDialog"
      @created="onStepCreated"
      @errored="onStepCreationError"
    />
    <v-snackbar v-model="stepCreatedSnackbarOpened" :color="$colors.success">Step deleted</v-snackbar>
    <v-snackbar v-model="stepCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the step</v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateStepDialog from '~/components/dialogs/CreateStepDialog.vue';
import DeletableRow from '~/components/DeletableRow.vue';
import { SelectItem } from '~/types';

export default Vue.extend({
  components: {
    CreateStepDialog,
    DeletableRow
  },
  model: {
    prop: 'step'
  },
  data() {
    return {
      isAutocompleteLoading: false,
      autocompleteSearch: null,
      autocompleteItems: [] as Array<SelectItem>,
      stepCreationDialog: false,
      stepCreatedSnackbarOpened: false,
      stepCreationErrorSnackbarOpened: false
    }
  },
  methods: {
    activateStepCreationDialog(): void {
      this.stepCreationDialog = true;
    },
    deactivateStepCreationDialog(): void {
      this.stepCreationDialog = false;
    },
    onAutocompleteChanged(val): void {
      console.log(val);
    },
    onDeleteClick(): void {
      this.$emit('deleted');
    },
    onStepCreated(): void {
      this.deactivateStepCreationDialog();
      this.stepCreatedSnackbarOpened = true;
    },
    onStepCreationError(): void {
      this.deactivateStepCreationDialog();
      this.stepCreationErrorSnackbarOpened = true;
    },
  },
  watch: {
    async autocompleteSearch() {
    }
  }
});
</script>

<style>
.step-search {
  width: 100%;
}
</style>
