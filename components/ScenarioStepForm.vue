<template>
  <div class="ScenarioStepForm">
    <div class="ScenarioStepForm-inner">
      <el-select
        :model-value="modelValue.adverb"
        size="small"
        class="ScenarioStepForm-adverbSelect"
        @update:model-value="onAdverbUpdate"
        @focus="onAdverbFocus"
        @blur="onAdverbBlur"
      >
        <el-option v-for="adverb in availableAdverbs" :label="adverb.label" :value="adverb.value" />
      </el-select>
      <span v-for="part in parts" :class="['ScenarioStepForm-part', 'ScenarioStepForm-part--' + part.type]">
        <span v-if="part.type === StepPartType.Sentence">{{ part.content }}</span>
        <InlineStepParamForm
          v-else
          :model-value="part.param as InlineStepParam"
          @update:model-value="onInlineParamUpdated"
        />
      </span>
      <el-input
        v-if="multilineParam"
        class="ScenarioStepForm-multilineParam"
        type="textarea"
        :autosize="{ minRows: 3 }"
        :model-value="multilineParam.content as string"
        @update:model-value="onMultilineParamUpdate"
      />
      <TableForm
        v-else-if="tableParam"
        :model-value="tableParam"
        :deletable-columns="true"
        :headerable="true"
        @update:model-value="onTableParamUpdate"
      />
    </div>
    <div class="ScenarioStepForm-delete">
      <el-button size="small" type="danger" @click="emit('delete')">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { useScenarioContentFocusManagementStore } from '~/store/scenario-content-focus-management'
import {
  type InlineStepParam,
  isInlineStepParam,
  type ScenarioStep,
  StepAdverb,
  StepParamType,
  StepPartType,
  type TableParamOptions,
  type TableStepParam
} from '~/types'

const props = defineProps<{
  modelValue: ScenarioStep
}>()

const emit = defineEmits(['update:modelValue', 'delete'])

const { holdFocus, releaseFocus } = useScenarioContentFocusManagementStore()

const onAdverbUpdate = (adverb: StepAdverb) => {
  emit('update:modelValue', {
    ...props.modelValue,
    adverb
  })
  releaseFocus()
}

const onAdverbFocus = () => {
  holdFocus()
}

const onAdverbBlur = () => {
  releaseFocus()
}

const onInlineParamUpdated = (param: InlineStepParam) => {
  const updatedParamIndex = props.modelValue.params.findIndex((param) => isInlineStepParam(param) && (param.stepPart as InlineStepParam).id === param.stepPart.id)
  const params = [...props.modelValue.params]

  params[updatedParamIndex] = param

  emit('update:modelValue', {
    ...props.modelValue,
    params,
  })
}

const onMultilineParamUpdate = (newValue: string) => {
  const params = [...props.modelValue.params]
  const updatedParamIndex = props.modelValue.params.findIndex((param) => !isInlineStepParam(param))

  params[updatedParamIndex].content = newValue

  emit('update:modelValue', {
    ...props.modelValue,
    params
  })
}

const onTableParamUpdate = (newValue: TableParamOptions & { content: string[][] }) => {
  const params = [...props.modelValue.params]
  const updatedParamIndex = props.modelValue.params.findIndex((param) => !isInlineStepParam(param))

  params[updatedParamIndex] = {
    ...params[updatedParamIndex],
    ...newValue
  }

  emit('update:modelValue', {
    ...props.modelValue,
    params
  })
}

const availableAdverbs = computed(() => [
  props.modelValue.step?.type as StepAdverb,
  StepAdverb.And,
  StepAdverb.But
].map((adverb) => ({
  label: adverb.charAt(0).toUpperCase() + adverb.slice(1),
  value: adverb
})))

const parts = computed(() => props.modelValue.step?.parts.map((part) => ({
  ...part,
  param: (part.type === StepPartType.Param && props.modelValue.params.find((param) => isInlineStepParam(param) && (param as InlineStepParam).stepPart.id === part.id))
})))

const multilineParam = computed(() => props.modelValue.step?.extraParamType === StepParamType.Multiline && props.modelValue.params.find((param) => !isInlineStepParam(param)))

const tableParam = computed(() => props.modelValue.step?.extraParamType === StepParamType.Table && props.modelValue.params.find((param) => !isInlineStepParam(param)) as TableStepParam)
</script>

<style>
.ScenarioStepForm {
  margin: 0.5rem;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
}

.ScenarioStepForm:hover {
  background-color: var(--el-fill-color-lighter);
  cursor: grab;
}

.ScenarioStepForm-inner {
  flex-grow: 1;
}

.ScenarioStepForm-adverbSelect {
  font-weight: bold;
}

.ScenarioStepForm-part--param {
  color: var(--el-color-primary);
  font-weight: bold;
}

.ScenarioStepForm-adverbSelect, .ScenarioStepForm-part {
  display: inline-block;
  margin-right: 0.3rem;
}

.ScenarioStepForm-adverbSelect .el-input__inner {
  width: 35px;
}

.ScenarioStepForm-multilineParam textarea {
  background-color: var(--el-fill-color);
}

.ScenarioStepForm-delete {
  padding-left: 1rem;
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
