<template>
  <client-only>
    <el-dialog :model-value="modelValue" @update:model-value="onDialogStatusChanged" title="Create a step">
      <div class="AddStepDialog-description">
        Define new steps to use in your scenarios. A step is a sentence starting by either "Given" to define a context,
        or "When" to define an action, or "Then" to define an expected outcome (Given I'm in this situation, when I perform this action,
        then I have this outcome).
        If you want to define a variable parameter in your sentence, just highlight the text you want to variabilize, and split using the button that will appear.
        To remove a variable parameter, click on the cross inside the input.
      </div>
      <div class="AddStepDialog-inputs">
        <el-select v-model="adverb" class="AddStepDialog-adverb">
          <el-option v-for="adverbOption in adverbs" :value="adverbOption" :label="adverbOption.charAt(0).toUpperCase() + adverbOption.slice(1)" />
        </el-select>
        <div v-for="(part, i) in parts" class="AddStepDialog-input">
          <el-input
            v-model="parts[i].content"
            :class="`AddStepDialog-input--${part.type}`"
            @select="(e) => onContentSelected(i, e)"
            @focus="onPotentialSelectionEnd"
            @blur="onPotentialSelectionEnd"
            @keydown="onPotentialSelectionEnd"
            @mousedown="onPotentialSelectionEnd"
            @update:model-value="onPartsUpdate"
          >
            <template v-if="part.type === StepPartType.Param" #suffix>
              <el-icon class="el-input__icon AddStepDialog-input-close" title="Remove parameter" @click="onInputCleared(i)">
                <CloseBold />
              </el-icon>
            </template>
          </el-input>
          <SplitStepButton v-if="selection && selection.inputId === i" @click="onSplitButtonClicked" />
          <div v-else-if="part.type === StepPartType.Param">
            <ContentChoicesInput
              v-if="part.strategy === ContentStrategy.Choices"
              v-model="parts[i].choices"
              @update:model-value="onPartsUpdate"
            />
            <ContentStrategySelector
              v-model="parts[i].strategy"
              :with-row-id="false"
              @update:model-value="(newStrategy) => onStrategyUpdate(i, newStrategy)"
            />
          </div>
        </div>
      </div>
      <div class="AddStepDialog-adverbDescription">
        {{ adverbDescription }}
      </div>
      <div class="AddStepDialog-paramType">
        <StepParamIcon :step-param-type="type" class="AddStepDialog-stepParamIcon" />
        <StepParamTypeSelector v-model="type" />
      </div>
      <div v-if="type === StepParamType.Table" class="AddStepDialog-tableStepParam">
        <el-button v-if="stepParamTemplate === null" size="small" @click="onStepParamTemplateRequest">
          Add data template
        </el-button>
        <TableParamTemplate v-else v-model="stepParamTemplate" />
      </div>
      <div class="AddStepDialog-tags">
        <TagsSelector v-model="tags" :project="project" />
        <div class="AddStepDialog-tagsDescription">
          Use tags to classify your steps, in order to retrieve them easily while designing scenarios
        </div>
      </div>
      <div class="AddStepDialog-actions">
        <el-button @click.stop="onSubmit" :disabled="!isSubmitEnabled">Create the scenario step</el-button>
      </div>
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { CloseBold } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import {
  type Project,
  StepParamType,
  type StepPart,
  ContentStrategy,
  StepPartType,
  StepType,
  type TableStepParamTemplate,
  type Tag
} from '~/types'

interface InputSelection {
  inputId: number
  boundaries: {
    start: number
    end: number
  },
}

const props = defineProps<{
  modelValue: boolean,
  project: Project
}>()
const { $api } = useNuxtApp()

const emit = defineEmits(['update:modelValue', 'created'])

const adverbs = [StepType.Given, StepType.When, StepType.Then]
const adverb = ref(StepType.Given)
const parts = ref<StepPart[]>([
  {
    id: uuidv4(),
    type: StepPartType.Sentence,
    priority: 0,
    content: '',
  }
])
const selection = ref<InputSelection>()
const type = ref(StepParamType.None)
const stepParamTemplate = ref<TableStepParamTemplate | null>(null)
const tags = ref<Tag[]>([])
const isSubmitEnabled = ref(true)

const onDialogStatusChanged = (e: boolean) => {
  emit('update:modelValue', e)
}

const onContentSelected = (i: number, { target }: { target: HTMLInputElement }) => {
  if (parts.value[i].type === StepPartType.Param) {
    return
  }

  selection.value = {
    inputId: i,
    boundaries: {
      start: target.selectionStart ?? 0,
      end: target.selectionEnd ?? 0,
    },
  }
}

const onSplitButtonClicked = () => {
  if (!selection.value) {
    return
  }

  const value = parts.value[selection.value?.inputId].content

  const before = value.substring(0, selection.value?.boundaries.start).trim()
  const selected = value.substring(selection.value?.boundaries.start, selection.value?.boundaries.end).trim()
  const after = value.substring(selection.value?.boundaries.end).trim()

  const newParts = [...parts.value]

  if (after !== '') {
    newParts.splice(selection.value?.inputId + 1, 0, {
      id: uuidv4(),
      type: StepPartType.Sentence,
      priority: 0,
      content: after,
      choices: null
    })
  }
  newParts.splice(selection.value?.inputId + 1, 0, {
    id: uuidv4(),
    type: StepPartType.Param,
    priority: selection.value?.inputId + 1,
    content: selected,
    strategy: ContentStrategy.Free,
    choices: null
  })
  if (before !== '') {
    newParts.splice(selection.value?.inputId + 1, 0, {
      id: uuidv4(),
      type: StepPartType.Sentence,
      priority: 0,
      content: before,
      choices: null
    })
  }
  newParts.splice(selection.value?.inputId ?? 0, 1)
  selection.value = undefined
  parts.value = newParts
}

const onPotentialSelectionEnd = ({ target }: FocusEvent | KeyboardEvent | Event) => {
  const input = target as HTMLInputElement

  window.setTimeout(() => {
    if (input.selectionStart === input.selectionEnd) {
      selection.value = undefined
    }
  }, 50)
}

const onInputCleared = (i: number) => {
  const newParts = [...parts.value]

  if (newParts[i].type === StepPartType.Sentence) {
    if (newParts.length === 1) {
      newParts[0].content = ''
      return
    }

    newParts.splice(i, 1)

    return
  }

  let fullContent = ''
  const elementToReplace = i > 0 ? i - 1 : 0
  let amountToDelete = 1
  if (i > 0) {
    fullContent += newParts[i - 1].content + ' '
    amountToDelete++
  }
  fullContent += newParts[i].content
  if (i < newParts.length - 1) {
    fullContent += ' ' + newParts[i + 1].content
    amountToDelete++
  }

  newParts.splice(elementToReplace, amountToDelete, {
    id: uuidv4(),
    type: StepPartType.Sentence,
    content: fullContent,
    priority: 0,
    choices: null
  })

  parts.value = newParts
}

const onPartsUpdate = () => {
  parts.value = parts.value.map((part, i) => ({ ...part, priority: i }))
}

const onStrategyUpdate = (i: number, newStrategy: ContentStrategy) => {
  parts.value[i].choices = newStrategy === ContentStrategy.Choices ? [] : null
}

const onStepParamTemplateRequest = () => {
  if (type.value === StepParamType.Table) {
    stepParamTemplate.value = [{
      header: '',
      strategy: ContentStrategy.Free
    }]
  }
}

const onSubmit = async () => {
  try {
    isSubmitEnabled.value = false
    await $api.createStep(
      {
        id: uuidv4(),
        type: adverb.value,
        project: {
          id: props.project.id,
        },
        extraParamType: type.value,
        parts: parts.value.map((part, i) => ({ ...part, priority: i })),
        tags: tags.value,
        extraParamTemplate: stepParamTemplate.value
      }
    )

    ElNotification({
      title: 'Step created',
      message: 'The scenario step has been successfully created. You can now use it to describe your scenarios, using a drag and drop',
      type: 'success',
    })

    emit('created')
    parts.value = [
      {
        type: StepPartType.Sentence,
        priority: 0,
        content: '',
        choices: null
      },
    ]
    adverb.value = StepType.Given
    type.value = StepParamType.None
    selection.value = undefined
    tags.value = []
    stepParamTemplate.value = null
    isSubmitEnabled.value = true
    emit('update:modelValue', false)
  } catch (error) {
    ElNotification({
      title: 'An error occurred',
      message: 'An error occurred while creating the scenario step',
      type: 'error',
    })
  }
}

const adverbDescription = computed(() => {
  if (adverb.value === StepType.Given) {
    return 'This sentence will describe a context'
  }

  if (adverb.value === StepType.When) {
    return 'This sentence will describe an action'
  }

  return 'This sentence will describe an expected outcome'
})
</script>

<style>
.AddStepDialog-description {
  font-size: 0.8rem;
  margin: 0 0 1rem 0;
  font-style: italic;
}

.AddStepDialog-inputs {
  display: flex;
  width: 100%;
}

.AddStepDialog-adverb {
  width: 100px;
}

.AddStepDialog-input {
  width: 100%;
  flex: 1;
  text-align: center;
}

.AddStepDialog-input .el-input, .AddStepDialog-input .el-input input {
  width: 100%;
}

.AddStepDialog-input--param input {
  color: var(--el-color-primary);
  font-weight: bold;
}

.AddStepDialog-input-close:hover {
  cursor: pointer;
}

.AddStepDialog-paramType {
  margin-top: 1rem;
  display: flex;
  align-items: center;
}

.AddStepDialog-stepParamIcon {
  margin-right: 1rem;
}

.AddStepDialog-adverbDescription, .AddStepDialog-tagsDescription {
  font-size: 0.8rem;
  font-style: italic;
  color: var(--el-color-info);
}

.AddStepDialog-tags {
  margin-top: 4rem;
}

.AddStepDialog-actions {
  margin-top: 2rem;
}
</style>
