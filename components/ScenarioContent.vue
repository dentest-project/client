<template>
  <el-col
    :class="['ScenarioContent', (draggedOver && getMovingStep() && 'ScenarioContent--draggedOver')]"
    :span="24"
    :sm="24"
    :md="24"
    :lg="modelValue.type === ScenarioType.Background ? 24 : 12"
    @dragenter.prevent="() => {}"
    @dragover.prevent="draggedOver = true"
    @dragleave.prevent="draggedOver = false"
    @drop.prevent="onDrop"
  >
    <el-card
      :class="[
        'ScenarioContent-card',
        `ScenarioContent-card--${mode === Mode.View ? 'view' : 'edit'}`,
        modelValue.type === ScenarioType.Background && 'ScenarioContent-card--background',
        (canWrite && 'ScenarioContent-card--canWrite')
      ]"
      @click="onScenarioClick"
    >
      <template #header>
        <el-button size="small" class="ScenarioContent-close" v-if="mode === Mode.Edit && canWrite" @click.stop="mode = Mode.View">
          <el-icon>
            <Close />
          </el-icon>
        </el-button>
        <h2 v-if="!canWrite && modelValue.type !== ScenarioType.Background">{{ modelValue.title }}</h2>
        <EditableSubtitle v-else-if="canWrite && modelValue.type !== ScenarioType.Background" label="Scenario title" empty-label="Untitled scenario" v-model="title" @submit="onTitleUpdate" />
        <BackgroundChip v-else class="ScenarioContent-backgroundChip" />
        <div v-if="modelValue.type === ScenarioType.Background" class="ScenarioContent-minimizeButtons">
          <MinimizeButton v-if="!minimized" @click.stop="minimize" />
          <ExpandButton v-else @click.stop="expand" />
        </div>
        <div v-if="canWrite" class="ScenarioContent-actions">
          <SwitchToBackgroundButton v-if="shouldDisplayBackgroundSwitch" :current-type="modelValue.type" @click.stop="onTypeChange" />
          <MoveUpButton v-if="canMoveUp" @click.stop="onMoveUp" />
          <MoveDownButton v-if="canMoveDown" @click.stop="onMoveDown" />
          <DuplicateButton v-if="modelValue.type !== ScenarioType.Background" @click.stop="onDuplicate" />
          <DeleteButton label="Delete" size="small" @deleted="onDelete" />
        </div>
        <div v-if="modelValue.type !== ScenarioType.Background" class="ScenarioContent-tags">
          <TagsSelector v-if="canWrite && mode === Mode.Edit" :project="project" v-model="modelValue.tags" @update:model-value="onTagsUpdate" />
          <TagsList v-else :tags="modelValue.tags" />
        </div>
      </template>
      <FeaturesWithBackgroundSelector
        v-if="modelValue.type === ScenarioType.Background && steps.length === 0 && mode === Mode.Edit && !minimized"
        v-model="featuresToCopyBackgroundFrom"
        :project="project"
        @update:model-value="onFeatureWithBackgroundSelected"
      />
      <ScenarioStepList
        v-if="!minimized"
        v-model="steps"
        :mode="canWrite ? mode : Mode.View"
        @update:model-value="onStepsUpdate"
      />
      <ExamplesContent
        v-if="modelValue.examples && !minimized"
        :mode="canWrite ? mode : Mode.View"
        :model-value="modelValue.examples"
        @update:model-value="onExamplesUpdate"
      />
      <div v-if="canWrite && steps.length === 0" class="ScenarioContent-empty">
        To build a scenario, drag'n'drop steps from the steps bank on the right
      </div>
    </el-card>
  </el-col>
</template>

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import FeaturesWithBackgroundSelector from '~/components/FeaturesWithBackgroundSelector.vue'
import { duplicateScenario } from '~/helpers/duplicateScenario'
import { extractExamplesFromSteps } from '~/helpers/extractExamplesFromSteps'
import { useStepStore } from '~/store/step'
import {
  Delay,
  type Feature,
  Mode,
  type Project,
  type Scenario,
  type ScenarioStep,
  ScenarioType,
  type Tag
} from '~/types'
import createScenarioStepFromStep from '../helpers/createScenarioStepFromStep'

const { getMovingStep } = useStepStore()
const { $api } = useNuxtApp()

const props = defineProps<{
  modelValue: Scenario,
  canMoveUp: boolean,
  canMoveDown: boolean,
  canBeBackground: boolean,
  canWrite: boolean,
  project: Project
}>()

const emit = defineEmits(['update:modelValue', 'up', 'down', 'duplicate', 'delete'])

const title = ref(props.modelValue.title)
const steps = ref(props.modelValue.steps)
const tags = ref(props.modelValue.tags)
const draggedOver = ref(false)
const mode = ref(Mode.View)
const featuresToCopyBackgroundFrom = ref<Pick<Feature, 'id' | 'title'>>()
const minimized = ref(false)

const onTitleUpdate = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    title: title.value
  }, Delay.Delayed)
}

const onTypeChange = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    type: props.modelValue.type === ScenarioType.Background
      ? (props.modelValue.examples ? ScenarioType.Outline : ScenarioType.Regular)
      : ScenarioType.Background,
    title: props.modelValue.type === ScenarioType.Background ? 'Scenario title' : '',
  }, Delay.Delayed)
}

const onDrop = () => {
  draggedOver.value = false

  const droppedStep = getMovingStep()

  if (!droppedStep) {
    return
  }

  const step = createScenarioStepFromStep([...steps.value], droppedStep)

  steps.value.splice(step.insertingIndex, 0, step.scenarioStep)

  emit('update:modelValue', {
    ...props.modelValue,
    steps
  }, Delay.Delayed)
}

const onStepsUpdate = (steps: ScenarioStep[], delay: Delay) => {
  const examples = extractExamplesFromSteps(steps, props.modelValue.examples)

  emit('update:modelValue', {
    ...props.modelValue,
    steps,
    examples,
    type: examples
      ? ScenarioType.Outline
      : (props.modelValue.type === ScenarioType.Background ? ScenarioType.Background : ScenarioType.Regular)
  }, delay)
}

const onExamplesUpdate = (examples: Record<string, string[]>, delay: Delay) => {
  emit('update:modelValue', {
    ...props.modelValue,
    examples
  }, delay)
}

const onTagsUpdate = (tags: Tag[]) => {
  emit('update:modelValue', {
    ...props.modelValue,
    tags
  }, Delay.Delayed)
}

const onMoveUp = () => {
  emit('up')
}

const onMoveDown = () => {
  emit('down')
}

const onDuplicate = () => {
  emit('duplicate')
}

const onDelete = () => {
  emit('delete')
}

const onScenarioClick = () => {
  if (props.canWrite && mode.value === Mode.View) {
    mode.value = Mode.Edit
  }
}

const onFeatureWithBackgroundSelected = async ({ id }: Pick<Feature, 'id' | 'title'>) => {
  const feature = await $api.getFeatureById(id)
  const background = feature.scenarios.find((scenario) => scenario.type === ScenarioType.Background)

  if (!background) {
    return
  }

  featuresToCopyBackgroundFrom.value = undefined

  emit('update:modelValue', duplicateScenario(background))
}

const minimize = () => {
  minimized.value = true
}

const expand = () => {
  minimized.value = false
}

const shouldDisplayBackgroundSwitch = computed(() => !props.modelValue.examples && props.canBeBackground)
</script>

<style scoped>
.ScenarioContent {
  margin-bottom: 20px;
  position: relative;
}

.ScenarioContent-card--canWrite.ScenarioContent-card--view:hover {
  cursor: pointer;
  background-color: var(--el-fill-color-light);
}

.ScenarioContent-actions {
  margin-top: 0;
}

h2 + .ScenarioContent-actions, .ScenarioContent-backgroundChip + .ScenarioContent-actions {
  margin-top: 1rem;
}

.ScenarioContent-minimizeButtons {
  margin: 1rem 0;
}

.ScenarioContent .ScenarioContent-card--background {
  background-color: rgba(128, 128, 128, 0.2);
}

.ScenarioContent--draggedOver .ScenarioContent-card {
  background-color: var(--el-color-success-light-7);
}

.ScenarioContent-card {
  height: 100%;
  border-radius: 1rem;
}

.ScenarioContent-empty {
  margin-top: 2rem;
  color: var(--el-color-info);
}

.ScenarioContent-tags {
  padding-top: 1rem;
}

.ScenarioContent-close {
  position: absolute;
  top: 0.5rem;
  right: 1.2rem;
}
</style>
