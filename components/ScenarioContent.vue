<template>
  <v-sheet class="scenario" :color="mode === $modes.view ? '#f0f0f0' : $colors.lightSecondary" shaped elevation="2">
    <edit-button v-if="$auth.loggedIn && mode === $modes.view" class="scenario-edit" @click="switchToEditMode" />
    <view-button v-else-if="$auth.loggedIn && mode === $modes.edit" class="scenario-edit" @click="switchToViewMode" />
    <delete-button v-if="$auth.loggedIn" class="scenario-delete" @click="onDeleteClick" />
    <switch-scenario-type-chip v-if="shouldDisplayTypeSwitch" :value="scenario.type" :mode="mode" @input="onTypeChanged" />
    <editable-subtitle v-if="mode === $modes.edit" label="Scenario title" :value="scenario.title" @input="onTitleChanged" />
    <h2 v-else>{{ scenario.title }}</h2>
    <step-list
      :mode="mode"
      :steps="scenario.steps"
      :feature-root-project="featureRootProject"
      @input="onStepsChanged"
    />
    <examples-content v-if="scenario.examples" class="scenario-examples" :examples="scenario.examples" :mode="mode" @input="onExamplesChanged" />
  </v-sheet>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import DeleteButton from '~/components/buttons/DeleteButton.vue';
import EditableSubtitle from '~/components/EditableSubtitle.vue';
import EditButton from '~/components/buttons/EditButton.vue';
import ExamplesContent from '~/components/ExamplesContent.vue';
import StepList from '~/components/StepList.vue';
import SwitchScenarioTypeChip from '~/components/chips/SwitchScenarioTypeChip.vue';
import ViewButton from '~/components/buttons/ViewButton.vue';
import { FeatureRootProject, Mode, Scenario, ScenarioStep, ScenarioType } from '~/types';

export default Vue.extend({
  components: {
    ViewButton,
    DeleteButton,
    EditButton,
    EditableSubtitle,
    ExamplesContent,
    StepList,
    SwitchScenarioTypeChip
  },
  model: {
    prop: 'scenario'
  },
  props: {
    backgroundable: {
      type: Boolean,
      required: true
    },
    scenario: {
      type: Object,
      required: true
    } as PropOptions<Scenario>,
    featureRootProject: {
      type: Object,
      required: true
    } as PropOptions<FeatureRootProject>
  },
  data() {
    return {
      mode: Mode.View
    };
  },
  methods: {
    onDeleteClick(): void {
      this.$emit('deleted');
    },
    onExamplesChanged(examples: Record<string, Array<string>>): void {
      this.$emit('input', {
        ...this.scenario,
        examples
      });
    },
    onStepsChanged(steps: Array<ScenarioStep>): void {
      const examples = this.updateExamples(steps);
      const type = examples ? ScenarioType.Outline : ScenarioType.Regular;

      this.$emit('input', {
        ...this.scenario,
        type,
        steps,
        examples
      });
    },
    onTitleChanged(title: string): void {
      this.$emit('input', {
        ...this.scenario,
        title
      });
    },
    onTypeChanged(type: string): void {
      this.$emit('input', {
        ...this.scenario,
        type: this.scenario.examples ? ScenarioType.Outline : type,
        title: type === ScenarioType.Background ? '' : 'Scenario title'
      });
    },
    updateExamples(steps: Array<ScenarioStep>): Record<string, Array<string>> | null {
      const newExamples: Record<string, Array<string>> = {};
      const keys: Array<string> = [];
      const re = new RegExp('<([^<>]+)>', 'g');

      steps.forEach((step: ScenarioStep) => {
        step.params.forEach(param => {
          if (typeof param.content === 'string') {
            param.content.replace(re, function (): string {
              keys.push(arguments[1]);

              return arguments[1];
            });
          } else {
            param.content.forEach(row => {
              row.forEach(cell => {
                cell.replace(re, function (): string {
                  keys.push(arguments[1]);

                  return arguments[1];
                });
              })
            })
          }
        });
      });

      if (keys.length === 0) {
        return null;
      }

      const currentValues = this.scenario.examples ? Object.values(this.scenario.examples) : [];
      const newValuesLength = currentValues.length > 0 ? currentValues[0].length : 1;
      keys.forEach(k => {
        if (this.scenario.examples && Object.keys(this.scenario.examples).indexOf(k) !== -1) {
          newExamples[k] = this.scenario.examples[k];
          return;
        }
        newExamples[k] = new Array(newValuesLength).fill('');
      });

      return newExamples;
    },
    switchToEditMode() {
      this.mode = Mode.Edit;
    },
    switchToViewMode() {
      this.mode = Mode.View;
    }
  },
  computed: {
    shouldDisplayTypeSwitch(): boolean {
      return (this as any).scenario.examples === undefined &&
        (this as any).backgroundable &&
        (this.mode === Mode.Edit || this.scenario.type === ScenarioType.Background);
    }
  }
});
</script>

<style scoped>
.scenario {
  padding: 1rem;
  margin: 2rem 0;
  width: 100%;
  position: relative;
}

.scenario .scenario-edit {
  position: absolute;
  right: 32px;
  top: -16px;
}

.scenario .scenario-delete {
  position: absolute;
  right: -16px;
  top: -16px;
}

.scenario .scenario-examples {
  margin-top: 2rem;
}
</style>
