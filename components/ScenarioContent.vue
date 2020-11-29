<template>
  <div class="scenario" :style="`background-color: ${mode === $modes.view ? '#f5f5f5' : $colors.lightSecondary};`">
    <edit-button v-if="mode === $modes.view" class="scenario-edit" @click="switchToEditMode" />
    <view-button v-else class="scenario-edit" @click="switchToViewMode" />
    <delete-button class="scenario-delete" @click="onDeleteClick" />
    <switch-scenario-type-chip v-if="shouldDisplayTypeSwitch" :value="scenario.type" :mode="mode" @input="onTypeChanged" />
    <editable-subtitle v-if="mode === $modes.edit" label="Scenario title" :value="scenario.title" @input="onTitleChanged" />
    <h2 v-else>{{ scenario.title }}</h2>
    <step-list :mode="mode" :steps="scenario.steps" :feature-root-project="featureRootProject" @input="onStepsChanged" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import DeleteButton from '~/components/buttons/DeleteButton.vue';
import EditButton from '~/components/buttons/EditButton.vue';
import ViewButton from '~/components/buttons/ViewButton.vue';
import EditableSubtitle from '~/components/EditableSubtitle.vue';
import StepList from '~/components/StepList.vue';
import SwitchScenarioTypeChip from '~/components/chips/SwitchScenarioTypeChip.vue';
import { FeatureRootProject, Mode, Scenario, ScenarioStep, ScenarioType } from '~/types';

export default Vue.extend({
  components: {
    ViewButton,
    DeleteButton,
    EditButton,
    EditableSubtitle,
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
    onStepsChanged(steps: Array<ScenarioStep>): void {
      this.$emit('input', {
        ...this.scenario,
        steps
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
        type,
        title: type === ScenarioType.Background ? '' : 'Scenario title'
      });
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
  border: 1px solid #aaaaaa;
  margin: 2rem 0;
  border-radius: 0.5rem;
  background-color: #f5f5f5;
  display: block;
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
</style>
