<template>
  <client-only>
    <el-dialog :model-value="modelValue" @update:model-value="onDialogStatusChanged" title="Update the step">
      <div class="UpdateStepDialog-inputs">
        <div class="UpdateStepDialog-adverb">
          {{ step.type.charAt(0).toUpperCase() + step.type.slice(1) }}
        </div>
        <div v-for="(part, i) in parts" class="UpdateStepDialog-input">
          <el-input v-model="parts[i].content" :class="`UpdateStepDialog-input--${part.type}`" />
          <div v-if="part.type === StepPartType.Param">
            <ContentChoicesInput v-if="part.strategy === ContentStrategy.Choices" v-model="parts[i].choices" :key="step.id" />
            <ContentStrategySelector
              v-model="parts[i].strategy"
              @update:model-value="(newStrategy) => onStrategyUpdate(i, newStrategy)"
            />
          </div>
        </div>
      </div>
      <div v-if="step.extraParamType === StepParamType.Table" class="UpdateStepDialog-tableStepParam">
        <el-button v-if="extraParamTemplate === null" size="small" @click="onExtraParamTemplateRequest">
          Add data template
        </el-button>
        <TableParamTemplate v-else v-model="extraParamTemplate" />
      </div>
      <div class="UpdateStepDialog-tags">
        <TagsSelector v-model="tags" :project="project" />
        <div class="UpdateStepDialog-tagsDescription">
          Use tags to classify your steps, in order to retrieve them easily while designing scenarios
        </div>
      </div>
      <div class="UpdateStepDialog-actions">
        <el-button @click.stop="onSubmit" :disabled="!isSubmitEnabled">Update the scenario step</el-button>
        <DeleteButton label="Delete the scenario step" @deleted="onDelete" />
      </div>
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import {
  type Project,
  type Step,
  type StepPart,
  ContentStrategy,
  StepPartType,
  StepParamType
} from '~/types'

const props = defineProps<{
  modelValue: boolean,
  project: Project,
  step: Step
}>()

const { $api } = useNuxtApp()

const emit = defineEmits(['update:modelValue', 'updated', 'deleted'])

const parts = ref<StepPart[]>([...props.step.parts])
const tags = ref([...props.step.tags])
const extraParamTemplate = ref(props.step.extraParamTemplate ?? null)

const isSubmitEnabled = ref(true)

const onDialogStatusChanged = (e: boolean) => {
  emit('update:modelValue', e)
}

const onStrategyUpdate = (i: number, newStrategy: ContentStrategy) => {
  parts.value[i].choices = newStrategy === ContentStrategy.Choices ? [] : null
}

const onExtraParamTemplateRequest = () => {
  if (props.step.extraParamType === StepParamType.Table) {
    extraParamTemplate.value = [{
      header: '',
      strategy: ContentStrategy.Free
    }]
  }
}

const onSubmit = async () => {
  try {
    isSubmitEnabled.value = false

    await $api.updateStep({
      id: props.step.id,
      parts: parts.value.map((part, i) => ({ ...part, priority: i })),
      tags: [...tags.value],
      extraParamTemplate: extraParamTemplate.value
    })

    ElNotification({
      title: 'Step updated',
      message: 'The scenario step has been successfully updated.',
      type: 'success',
    })

    emit('updated')
    isSubmitEnabled.value = true
    emit('update:modelValue', false)
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while updating the scenario step',
      type: 'error',
    })
  }
}

const onDelete = async () => {
  try {
    await $api.deleteStep(props.step.id as number)

    ElNotification({
      title: 'Step deleted',
      message: 'The scenario step has been successfully deleted.',
      type: 'success',
    })

    emit('deleted')
    emit('update:modelValue', false)
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while deleting the scenario step',
      type: 'error',
    })
  }
}

watch(props, () => {
  parts.value = props.step.parts
  tags.value = props.step.tags
  extraParamTemplate.value = props.step.extraParamTemplate ?? null
})
</script>

<style>
.UpdateStepDialog-inputs {
  display: flex;
  width: 100%;
}

.UpdateStepDialog-adverb {
  padding-top: 7px;
  width: 50px;
}

.UpdateStepDialog-input {
  width: 100%;
  flex: 1;
  text-align: center;
}

.UpdateStepDialog-input .el-input, .UpdateStepDialog-input .el-input input {
  width: 100%;
}

.UpdateStepDialog-input--param input {
  color: var(--el-color-primary);
  font-weight: bold;
}

.UpdateStepDialog-tags {
  margin-top: 4rem;
}

.UpdateStepDialog-tagsDescription {
  font-size: 0.8rem;
  font-style: italic;
  color: var(--el-color-info);
}

.UpdateStepDialog-actions {
  margin-top: 2rem;
}
</style>
