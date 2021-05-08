<template>
  <div class="step-search">
    <v-autocomplete
      :loading="isAutocompleteLoading"
      :items="autocompleteItems"
      :search-input.sync="autocompleteSearch"
      :item-text="getStepItemText"
      :item-value="getStepItemValue"
      solo
      @input="step => $emit('selected', step)"
    >
      <template v-slot:item="data">
        <v-list-item-content>
          <div>
            <strong>{{ translateStepType(data.item.type) }}</strong>
            <span v-for="part in data.item.parts" :key="part.id" :class="`step-search-step-type--${part.type}`">{{ part.content }} </span>
          </div>
        </v-list-item-content>
      </template>
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
      :feature-root-project="featureRootProject"
      @created="onStepCreated"
      @errored="onStepCreationError"
    />
    <v-snackbar v-model="stepCreatedSnackbarOpened" :color="$colors.success">Step created</v-snackbar>
    <v-snackbar v-model="stepCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the step</v-snackbar>
    <v-snackbar v-model="stepSearchErrorSnackbarOpened" :color="$colors.error">An error occurred while fetching steps</v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import CreateStepDialog from '~/components/dialogs/CreateStepDialog.vue';
import DeletableRow from '~/components/DeletableRow.vue';
import translateStepType from '~/helpers/translateType';
import { Project, Step, StepPart, StepType } from '~/types';

export default Vue.extend({
  components: {
    CreateStepDialog,
    DeletableRow
  },
  model: {
    prop: 'step'
  },
  props: {
    featureRootProject: {
      type: Object,
      required: true
    } as PropOptions<Project>
  },
  data() {
    return {
      isAutocompleteLoading: false,
      autocompleteSearch: null,
      autocompleteItems: [] as Array<Step>,
      stepCreationDialog: false,
      stepCreatedSnackbarOpened: false,
      stepCreationErrorSnackbarOpened: false,
      stepSearchErrorSnackbarOpened: false
    }
  },
  methods: {
    activateStepCreationDialog(): void {
      this.stepCreationDialog = true;
    },
    deactivateStepCreationDialog(): void {
      this.stepCreationDialog = false;
    },
    getStepItemText(step: Step) {
      return step.parts.map(p => p.content).join(' ');
    },
    getStepItemValue(step: Step) {
      return step;
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
    translateStepType(type: StepType): string {
      return translateStepType(type);
    }
  },
  watch: {
    async autocompleteSearch() {
      if (this.autocompleteItems.length > 0 || this.isAutocompleteLoading) {
        return;
      }

      this.isAutocompleteLoading = true;

      try {
        const steps: Array<Step> = await this.$api.getProjectSteps(this.featureRootProject.id, this.$axios);
        for (let i = 0 ; i < steps.length ; i++) {
          steps[i].parts.sort((a: StepPart, b: StepPart): number => {
            if (a.priority === b.priority) {
              return 0;
            }

            return a.priority < b.priority ? -1 : 1;
          });
        }
        this.autocompleteItems = steps;
      } catch (error) {
        this.stepSearchErrorSnackbarOpened = true;
      }

      this.isAutocompleteLoading = false;
    }
  }
});
</script>

<style>
.step-search {
  width: 100%;
}

.step-search-step-type--param:before {
  content: ":";
}

.step-search-step-type--param {
  color: #eb4d4b;
  font-weight: bold;
}
</style>
