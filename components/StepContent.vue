<template>
  <div class="step">
    <deletable-row v-if="mode === $modes.edit" @delete="onDeleteClick">
      <v-select v-if="step.step" class="step-type-select" :items="adverbsSelectItems" :value="step.adverb" solo />
      <v-autocomplete
        v-if="!step.step"
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
    </deletable-row>
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
import Vue, { PropOptions } from 'vue'
import CreateStepDialog from '~/components/dialogs/CreateStepDialog.vue';
import DeletableRow from '~/components/DeletableRow.vue';
import { Mode, ScenarioStep, SelectItem, StepAdverb } from '~/types';

export default Vue.extend({
  components: {
    CreateStepDialog,
    DeletableRow
  },
  model: {
    prop: 'step'
  },
  props: {
    mode: {
      type: Number,
      required: true
    } as PropOptions<Mode>,
    step: {
      type: Object,
      required: true
    } as PropOptions<ScenarioStep>,
    availableAdverbs: {
      type: Array,
      required: true
    } as PropOptions<Array<StepAdverb>>
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
  computed: {
    adverbsSelectItems(): Array<SelectItem> {
      const labels = {
        [StepAdverb.Given]: 'Given',
        [StepAdverb.When]: 'When',
        [StepAdverb.Then]: 'Then',
        [StepAdverb.And]: 'And',
        [StepAdverb.But]: 'But'
      } as Record<StepAdverb, string>;

      return (this as any).availableAdverbs.map((a: StepAdverb): SelectItem => ({
        text: labels[a],
        value: a,
        disabled: false
      }));
    }
  },
  watch: {
    async autocompleteSearch() {
    }
  }
});
</script>

<style scoped>
.step {
  margin-bottom: 2rem;
}
.step-type-select {
  flex-grow: 0;
}
</style>
