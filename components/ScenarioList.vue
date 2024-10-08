<template>
  <el-row :gutter="20">
    <ScenarioContent
      v-for="(scenario, i) in modelValue"
      :key="scenario.id"
      :model-value="scenario"
      :can-move-up="i > 0 && !(i === 1 && modelValue[0].type === ScenarioType.Background)"
      :can-move-down="i < modelValue.length - 1 && !(i === 0 && scenario.type === ScenarioType.Background)"
      :can-write="canWrite"
      :can-be-background="i === 0"
      :project="project"
      @update:model-value="(newVal, delay) => { onUpdate(i, newVal, delay) }"
      @up="() => onUp(i)"
      @down="() => onDown(i)"
      @duplicate="() => onDuplicate(i)"
      @delete="() => onDelete(i)"
    />
  </el-row>
  <AddScenarioButton v-if="canWrite" @click="onAdd" />
</template>

<script setup lang="ts">
import { duplicateScenario } from '~/helpers/duplicateScenario'
import {
  Delay,
  type Project,
  type Scenario,
  ScenarioType,
} from '~/types'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
  modelValue: Scenario[],
  project: Project,
  canWrite: boolean
}>()

const emit = defineEmits(['update:modelValue', 'scenarioAdded'])

const onAdd = () => {
  emit('scenarioAdded', [
    ...props.modelValue,
    {
      id: uuidv4(),
      type: ScenarioType.Regular,
      title: 'Scenario title',
      steps: [],
      tags: [],
    },
  ])
}

const onUpdate = (i: number, scenario: Scenario, delay: Delay) => {
  const updatedList = [...props.modelValue]

  updatedList.splice(i, 1, scenario)

  emit('update:modelValue', updatedList, delay)
}

const onUp = (i: number) => {
  if (i === 0 || (i === 1 && props.modelValue[0].type === ScenarioType.Background)) {
    return
  }

  const updatedList = [...props.modelValue]
  const previousScenario = props.modelValue[i - 1]

  updatedList[i - 1] = props.modelValue[i]
  updatedList[i] = previousScenario

  emit('update:modelValue', updatedList, Delay.Delayed)
}

const onDown = (i: number) => {
  if (i === props.modelValue.length || (i === 0 && props.modelValue[0].type === ScenarioType.Background)) {
    return
  }

  const updatedList = [...props.modelValue]
  const nextScenario = props.modelValue[i + 1]

  updatedList[i + 1] = props.modelValue[i]
  updatedList[i] = nextScenario

  emit('update:modelValue', updatedList, Delay.Delayed)
}

const onDuplicate = (i: number) => {
  const updatedList = [...props.modelValue]

  updatedList.push(duplicateScenario({ ...props.modelValue[i] }))

  emit('update:modelValue', updatedList, Delay.Delayed)
}

const onDelete = (i: number) => {
  const updatedList = [...props.modelValue]

  updatedList.splice(i, 1)

  emit('update:modelValue', updatedList, Delay.Delayed)
}
</script>
