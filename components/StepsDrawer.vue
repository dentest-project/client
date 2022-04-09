<template>
  <v-navigation-drawer
    class="step-drawer"
    :style="`border-color: ${$colors.primary}`"
    fixed
    floating
    right
    hide-overlay
    v-model="drawer"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">Steps</v-list-item-title>
        <v-list-item-subtitle> Drag'n'drop your steps </v-list-item-subtitle>
      </v-list-item-content>
      <v-btn icon @click.stop="drawer = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-list-item>
    <v-divider />
    <v-list-item>
      <v-list-item-title>
        <v-btn
          :color="$colors.primary"
          small
          dark
          @mousedown="activateStepCreationDialog"
        >
          <strong>Create a new step</strong>
        </v-btn>
      </v-list-item-title>
    </v-list-item>
    <v-divider />
    <steps-filters v-model="tagsFilter" :project="project" />
    <v-divider />
    <v-list>
      <v-list-group
        v-for="group in displayedSteps"
        v-model="group.active"
        :key="group.title"
        :prepend-icon="group.icon"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="group.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="step in group.steps"
          :key="step.id"
          link
          dense
          @click="activateStepUpdateDialog(step)"
        >
          <div
            class="step-drawer-step-with-type"
            draggable="true"
            @dragstart.stop="addToStore(step)"
            @dragend.stop="removeFromStore"
          >
            <v-list-item-icon>
              <v-icon color="#CCCCCC">{{
                  iconForStepParamType(step.extraParamType)
                }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <div class="step-drawer-step">
              <span
                v-for="part in step.parts"
                :key="part.id"
                :class="`step-drawer-step-type--${part.type}`"
              >{{ part.content }}</span
              >
              </div>
            </v-list-item-content>
          </div>
        </v-list-item>
      </v-list-group>
    </v-list>
    <create-step-dialog
      v-model="stepCreationDialog"
      :project="project"
      @created="onStepCreated"
      @errored="onStepCreationError"
    />
    <update-step-dialog
      v-if="updateStep"
      v-model="stepUpdateDialog"
      :step="updateStep"
      :project="project"
      @updated="onStepUpdated"
      @delete-request="onStepDeleteRequest"
      @errored="onStepUpdateError"
    />
    <delete-step-dialog
      v-if="deletingStepId"
      v-model="stepDeleteDialog"
      :step-id="deletingStepId"
      @input="onStepDeleteDialogChanged"
      @deleted="onStepDeleted"
      @errored="onStepDeleteError"
    />
    <v-snackbar
      v-model="stepCreatedSnackbarOpened"
      :color="$colors.success"
      absolute
    >
      Step created
    </v-snackbar>
    <v-snackbar
      v-model="stepUpdatedSnackbarOpened"
      :color="$colors.success"
      absolute
    >
      Step updated
    </v-snackbar>
    <v-snackbar
      v-model="stepDeletedSnackbarOpened"
      :color="$colors.success"
      absolute
    >
      Step deleted
    </v-snackbar>
    <v-snackbar
      v-model="stepCreationErrorSnackbarOpened"
      :color="$colors.error"
      absolute
    >
      An error occurred while creating the step
    </v-snackbar>
    <v-snackbar
      v-model="stepUpdateErrorSnackbarOpened"
      :color="$colors.error"
      absolute
    >
      An error occurred while updating the step
    </v-snackbar>
    <v-snackbar
      v-model="stepDeleteErrorSnackbarOpened"
      :color="$colors.error"
      absolute
    >
      An error occurred while deleting the step
    </v-snackbar>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapMutations } from 'vuex'
import CreateStepDialog from '~/components/dialogs/CreateStepDialog.vue'
import DeleteStepDialog from '~/components/dialogs/DeleteStepDialog.vue'
import UpdateStepDialog from '~/components/dialogs/UpdateStepDialog.vue'
import StepsFilters from '~/components/StepsFilters.vue'
import getStepSentence from '~/helpers/getStepSentence';
import { Project, Step, StepParamType, StepType, Tag } from '~/types'

interface DisplayableStepsGroup {
  title: string
  icon: string
  active: boolean
  steps: Array<Step>
}

export default Vue.extend({
  model: {
    prop: 'value',
  },
  components: {
    StepsFilters,
    CreateStepDialog,
    DeleteStepDialog,
    UpdateStepDialog,
  },
  props: {
    project: {
      type: Object,
      required: true,
    } as PropOptions<Project>,
    value: {
      type: Boolean,
      required: true,
    },
  },
  async beforeMount() {
    await this.loadSteps()
  },
  data() {
    return {
      steps: [] as Array<Step>,
      updateStep: null as Step | null,
      tagsFilter: [] as Array<Tag>,
      deletingStepId: null as number | null,
      stepCreationDialog: false,
      stepUpdateDialog: false,
      stepDeleteDialog: false,
      stepCreatedSnackbarOpened: false,
      stepDeletedSnackbarOpened: false,
      stepUpdatedSnackbarOpened: false,
      stepCreationErrorSnackbarOpened: false,
      stepDeleteErrorSnackbarOpened: false,
      stepUpdateErrorSnackbarOpened: false,
    }
  },
  methods: {
    activateStepCreationDialog(): void {
      this.stepCreationDialog = true
    },
    deactivateStepCreationDialog(): void {
      this.stepCreationDialog = false
    },
    activateStepUpdateDialog(step: Step): void {
      this.stepUpdateDialog = true
      this.updateStep = step
    },
    deactivateStepUpdateDialog(): void {
      this.stepUpdateDialog = false
      this.updateStep = null
    },
    activateStepDeleteDialog(): void {
      this.stepDeleteDialog = true
    },
    deactivateStepDeleteDialog(): void {
      this.stepDeleteDialog = false
      this.deletingStepId = null
    },
    async onStepCreated(): Promise<void> {
      this.deactivateStepCreationDialog()
      this.stepCreatedSnackbarOpened = true
      await this.loadSteps()
    },
    async onStepUpdated(): Promise<void> {
      this.deactivateStepUpdateDialog()
      this.stepUpdatedSnackbarOpened = true
      await this.loadSteps()
    },
    async onStepDeleted(): Promise<void> {
      this.deactivateStepDeleteDialog()
      this.stepDeletedSnackbarOpened = true
      await this.loadSteps()
    },
    onStepDeleteDialogChanged(status: boolean): void {
      if (!status) {
        this.deactivateStepDeleteDialog()
      }
    },
    onStepDeleteRequest(stepId: number): void {
      this.deactivateStepUpdateDialog()
      this.deletingStepId = stepId
      this.activateStepDeleteDialog()
    },
    onStepCreationError(): void {
      this.deactivateStepCreationDialog()
      this.stepCreationErrorSnackbarOpened = true
    },
    onStepDeleteError(): void {
      this.deactivateStepDeleteDialog()
      this.stepDeleteErrorSnackbarOpened = true
    },
    onStepUpdateError(): void {
      this.deactivateStepUpdateDialog()
      this.stepUpdateErrorSnackbarOpened = true
    },
    async loadSteps(): Promise<void> {
      this.steps = await this.$api.getProjectSteps(this.project.id, this.$axios)
    },
    iconForStepParamType(type: StepParamType): string {
      switch (type) {
        case StepParamType.None:
          return 'mdi-circle-off-outline'
        case StepParamType.Multiline:
          return 'mdi-text-box'
        case StepParamType.Table:
          return 'mdi-table-large'
        default:
          return ''
      }
    },
    isStepCorrespondingToTags(step: Step): boolean {
      return (
        this.tagsFilterIds.length === 0 ||
        step.tags.map((t) => t.id).filter((t) => this.tagsFilterIds.includes(t))
          .length > 0
      )
    },
    ...mapMutations({
      addToStore: 'stepsDrawer/dragStep',
      removeFromStore: 'stepsDrawer/clearDraggedStep',
    }),
  },
  computed: {
    displayedSteps(): Array<DisplayableStepsGroup> {
      const steps: Array<Step> = (this as any).steps

      return [
        ['Givens', 'mdi-ray-start', StepType.Given],
        ['Whens', 'mdi-ray-vertex', StepType.When],
        ['Thens', 'mdi-ray-end', StepType.Then],
      ].map(([title, icon, type]) => ({
        title,
        icon,
        steps: steps.filter(
          (step: Step) =>
            step.type === type && (this as any).isStepCorrespondingToTags(step)
        ).sort((a, b) => getStepSentence(a).localeCompare(getStepSentence(b))),
        active: false,
      }))
    },
    tagsFilterIds(): Array<string> {
      return (this as any).tagsFilter.map((t: Tag) => t.id)
    },
    drawer: {
      get() {
        return this.value
      },
      set(value: boolean) {
        this.$emit('input', value)
      },
    },
  },
})
</script>

<style scoped>
.step-drawer {
  border-left: 3px solid;
  background-color: #EEEEEE;
}

.step-drawer-step {
  font-style: italic;
  font-size: 0.9rem;
}

.step-drawer-step-type--param:before {
  content: ' :';
}

.step-drawer-step-type--param:after {
  content: ' ';
}

.step-drawer-step-type--param {
  color: #2814b4;
  font-weight: bold;
}

.step-drawer-step-with-type {
  display: flex;
}
</style>
