<template>
  <v-navigation-drawer hide-overlay fixed floating temporary right v-model="drawer">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Steps</v-list-item-title>
        <v-list-item-subtitle>
          Drag'n'drop your steps
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list-item>
      <v-list-item-title>
        <v-btn small @mousedown="activateStepCreationDialog">
          <strong>Create a new step</strong>
        </v-btn>
      </v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list>
      <v-list-group v-for="group in steps" v-model="group.active" :key="group.title" :prepend-icon="group.icon">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="group.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item v-for="step in group.steps" :key="step.id" link draggable="true" @dragstart="addToStore(step)" @dragend="removeFromStore" dense>
          <v-list-item-icon>
            <v-icon color="#CCCCCC">{{ group.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <div class="step-drawer-step">
              <span v-for="part in step.parts" :key="part.id" :class="`step-drawer-step-type--${part.type}`">{{ part.content }}</span>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    <create-step-dialog
      v-model="stepCreationDialog"
      :project="project"
      @created="onStepCreated"
      @errored="onStepCreationError"
    />
    <v-snackbar v-model="stepCreatedSnackbarOpened" :color="$colors.success">Step created</v-snackbar>
    <v-snackbar v-model="stepCreationErrorSnackbarOpened" :color="$colors.error">An error occurred while creating the step</v-snackbar>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { mapMutations } from 'vuex';
import CreateStepDialog from '~/components/dialogs/CreateStepDialog.vue';
import translateStepType from '~/helpers/translateType';
import { Project, Step, StepType } from '~/types';

interface DisplayableStepsGroup {
  title: string,
  icon: string,
  active: boolean,
  steps: Array<Step>
}

export default Vue.extend({
  model: {
    prop: 'value'
  },
  components: {
    CreateStepDialog
  },
  props: {
    project: {
      type: Object,
      required: true
    } as PropOptions<Project>,
    value: {
      type: Boolean,
      required: true
    }
  },
  async beforeMount() {
    await this.loadSteps();
  },
  data() {
    return {
      steps: [] as Array<DisplayableStepsGroup>,
      stepCreationDialog: false,
      stepCreatedSnackbarOpened: false,
      stepCreationErrorSnackbarOpened: false
    };
  },
  methods: {
    activateStepCreationDialog(): void {
      this.stepCreationDialog = true;
    },
    deactivateStepCreationDialog(): void {
      this.stepCreationDialog = false;
    },
    async onStepCreated(): Promise<void> {
      this.deactivateStepCreationDialog();
      this.stepCreatedSnackbarOpened = true;
      await this.loadSteps();
    },
    onStepCreationError(): void {
      this.deactivateStepCreationDialog();
      this.stepCreationErrorSnackbarOpened = true;
    },
    translateStepType(type: StepType): string {
      return translateStepType(type);
    },
    async loadSteps(): Promise<void> {
      const steps = await this.$api.getProjectSteps(this.project.id, this.$axios);

      this.steps = [
        ['Givens', 'mdi-ray-start', StepType.Given],
        ['Whens', 'mdi-ray-vertex', StepType.When],
        ['Thens', 'mdi-ray-end', StepType.Then]
      ].map(([title, icon, type]) => ({
        title,
        icon,
        steps: steps.filter((step: Step) => step.type === type),
        active: false
      }));
    },
    ...mapMutations({
      addToStore: 'stepsDrawer/dragStep',
      removeFromStore: 'stepsDrawer/clearDraggedStep'
    })
  },
  computed: {
    drawer: {
      get() {
        return this.value;
      },
      set(value: boolean) {
        this.$emit('input', value);
      }
    }
  }
});
</script>

<style scoped>
.step-drawer-step {
  font-style: italic;
  font-size: 0.9rem;
}

.step-drawer-step-type--param:before {
  content: " :";
}

.step-drawer-step-type--param:after {
  content: " ";
}

.step-drawer-step-type--param {
  color: #2814B4;
  font-weight: bold;
}
</style>
