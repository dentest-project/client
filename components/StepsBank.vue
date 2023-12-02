<template>
  <h3>Scenario steps</h3>
  <small class="StepsBank-description"><em>Create and manage here all the steps that will be used inside your scenarios. To use a given step inside a scenario, you just have to drag'n'drop it to the desired place.</em></small>
  <AddStepButton @click="createStepDialog = true" />
  <el-collapse class="StepsBank-stepsListFilters">
    <el-collapse-item>
      <template #title>
        <h4 class="StepsBank-stepsListFiltersTitle"><el-icon><Filter /></el-icon>Filter steps</h4>
      </template>
      <el-input v-model="filterQuery" placeholder="Keep steps containing..." />
      <div class="StepsBank-tagsFilters">
        <StepsTagsFilter v-model="filterTags" :project="project" />
      </div>
    </el-collapse-item>
  </el-collapse>
  <el-collapse class="StepsBank-stepsList" v-model="activeCollectionAdverbs">
    <el-collapse-item v-for="collection in displayedSteps" :key="collection.adverb" :name="collection.adverb">
      <template #title>
        <h4 class="StepsBank-adverbTitle">
          <el-icon><component :is="collection.icon" /></el-icon>
          {{ collection.adverb.toUpperCase() }}
        </h4>
      </template>
      <small class="StepsBank-description"><em>
        {{ collection.description }}
      </em></small>
      <ul class="StepsBank-adverbCollection">
        <li
          v-for="step in collection.steps"
          :draggable="true"
          @click="() => onStepUpdate(step)"
          @dragstart.stop="() => moveStep(step)"
          @dragend.stop="stopMovingStep"
        >
          <StepParamIcon class="StepsBank-stepsParameterIcon" :step-param-type="step.extraParamType" />
          <div>
            <span v-for="part in step.parts" :class="`StepsBank-stepPart StepsBank-stepPart--${part.type}`">{{ part.content }}</span>
          </div>
        </li>
      </ul>
      <small class="StepsBank-description" v-if="collection.steps.length === 0"><em>
        There isn't any step here yet. You can create one using the "Create a step" button above.
      </em></small>
    </el-collapse-item>
  </el-collapse>
  <CreateStepDialog v-model="createStepDialog" :project="project" @created="loadSteps" />
  <UpdateStepDialog v-if="stepToUpdate" v-model="updateStepDialog" :project="project" :step="stepToUpdate" @updated="loadSteps" @deleted="loadSteps" />
</template>

<script setup async lang="ts">
import { useStepStore } from '~/store/step'
import { type Project, type Step, StepType, type Tag } from '~/types'
import { Tools, Lightning, Checked, Filter } from '@element-plus/icons-vue'

const props = defineProps<{
  project: Project
}>()

const { $api } = useNuxtApp()
const { moveStep, stopMovingStep } = useStepStore()

const createStepDialog = ref(false)
const updateStepDialog = ref(false)
const activeCollectionAdverbs = ref([StepType.Given])
const steps = ref<Step[]>([])
const stepToUpdate = ref<Step | null>(null)
const filterQuery = ref('')
const filterTags = ref<Tag[]>([])

const loadSteps = async () => {
  steps.value = await $api.getProjectSteps(props.project.id)
}

const onStepUpdate = (step: Step) => {
  stepToUpdate.value = step
  updateStepDialog.value = true
}

const filterStep = (step: Step) => {
  const sentence = step.parts.map(p => p.content.trim()).join(' ').toLowerCase()

  return sentence.includes(filterQuery.value.toLowerCase()) && (
    filterTags.value.length === 0 || step.tags.some(t => filterTags.value.some(t2 => t2.id === t.id))
  )
}

const sortSteps = (step1: Step, step2: Step) => step1
  .parts
  .map(p => p.content.trim())
  .join('')
  .toUpperCase()
  .localeCompare(step2.parts.map(p => p.content.trim()).join('').toUpperCase())

const displayedSteps = computed((): { adverb: StepType, description: string, steps: Step[], icon: unknown }[] => {
  return [
    [StepType.Given, Tools, 'Those sentences describe contexts'],
    [StepType.When, Lightning, 'Those sentences describe actions'],
    [StepType.Then, Checked, 'Those sentences describe expected outcomes']
  ].map(([type, icon, description]) => ({
    adverb: type,
    description,
    steps: (steps.value ?? []).filter((step) => step.type === type).filter(filterStep).sort(sortSteps),
    icon
  }))
})

await loadSteps()
</script>

<style>
h3 {
  margin-top: 1rem;
}

.StepsBank-description {
  display: block;
  margin-bottom: 1rem;
  word-break: normal;
}

.StepsBank-stepsListFilters {
  margin-top: 2rem;
}

.StepsBank-stepsListFilters .el-input, .StepsBank-stepsListFilters .el-input input {
  width: 100%;
}

.StepsBank-adverbTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-weight: 500;
}

.StepsBank-stepsListFiltersTitle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  font-weight: normal;
}

.StepsBank-adverbCollection {
  padding: 0;
}

.StepsBank-adverbCollection li {
  padding: 0.3rem 0.5rem;
  list-style-type: none;
  display: flex;
  align-items: center;
}

.StepsBank-adverbCollection li:hover {
  background-color: rgba(128, 128, 128, 0.2);
  cursor: grab;
}

.StepsBank-adverbCollection li + li {
  border-top: 1px solid var(--el-border-color-light);
}

.StepsBank-stepPart {
  padding-left: 0.3rem;
}

.StepsBank-stepPart--param {
  font-weight: bold;
  color: var(--el-color-primary);
}

.StepsBank-stepsList .el-collapse-item__header {
  background-color: transparent !important;
  line-height: inherit;
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
}

.StepsBank-stepsList .el-collapse-item__header, .StepsBank-stepsList .el-collapse-item__wrap,
.StepsBank-stepsListFilters .el-collapse-item__header, .StepsBank-stepsListFilters .el-collapse-item__wrap{
  background-color: transparent;
}

.StepsBank-stepsParameterIcon {
  color: var(--el-color-info);
}

.StepsBank-tagsFilters {
  margin-top: 1rem;
}
</style>
