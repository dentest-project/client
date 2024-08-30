<template>
  <div class="ScenarioStepForm">
    <el-button size="small" title="Reorder step">
      <DragHandle><el-icon><Sort /></el-icon></DragHandle>
    </el-button>
    <div class="ScenarioStepForm-inner">
      <div class="ScenarioStepForm-parts">
        <el-select
          :model-value="modelValue.adverb"
          size="small"
          class="ScenarioStepForm-adverbSelect"
          @update:model-value="onAdverbUpdate"
        >
          <el-option v-for="adverb in availableAdverbs" :label="adverb.label" :value="adverb.value" />
        </el-select>
        <span v-for="(part, i) in parts" :class="['ScenarioStepForm-part', 'ScenarioStepForm-part--' + part.type]">
          <span v-if="part.type === StepPartType.Sentence">{{ part.content }}</span>
          <InlineStepParamForm
            v-else
            :model-value="part.param as InlineStepParam"
            @update:model-value="(v, delay) => onInlineParamUpdated(part.paramIndex, v, delay)"
          />
        </span>
      </div>
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
        :model-value="modelValue.step?.extraParamTemplate ? { ...tableParam, content: tableParam.content.slice(1) } : tableParam"
        :creatable-columns="!modelValue.step?.extraParamTemplate"
        :deletable-columns="true"
        :headers="headers"
        :headerable="!modelValue.step?.extraParamTemplate"
        :cell-strategies="cellStrategies"
        @update:model-value="onTableParamUpdate"
      />
      <el-button
        v-if="tableParamWithTemplateAndMissingColumns"
        size="small"
        @click="addMissingColumnsFromStepDataTemplate"
      >
        Add missing columns from step data template
      </el-button>
    </div>
    <div class="ScenarioStepForm-delete">
      <el-button size="small" type="danger" @click="emit('delete')">
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete, Sort } from '@element-plus/icons-vue'
import {
  ContentStrategy,
  Delay,
  type InlineStepParam,
  isInlineStepParam,
  type ScenarioStep,
  StepAdverb,
  StepParamType,
  StepPartType,
  type TableParamOptions,
  type TableStepParam,
  type TableStepParamTemplate
} from '~/types'

const props = defineProps<{
  modelValue: ScenarioStep
}>()

const emit = defineEmits(['update:modelValue', 'delete'])

const onAdverbUpdate = (adverb: StepAdverb) => {
  emit('update:modelValue', {
    ...props.modelValue,
    adverb
  }, Delay.Instantly)
}

const onInlineParamUpdated = (paramIndex: number, newValue: InlineStepParam, delay: Delay) => {
  const params = [...props.modelValue.params]

  params[paramIndex].content = newValue.content

  emit('update:modelValue', {
    ...props.modelValue,
    params,
  }, delay)
}

const onMultilineParamUpdate = (newValue: string) => {
  const params = [...props.modelValue.params]
  const updatedParamIndex = props.modelValue.params.findIndex((param) => !isInlineStepParam(param))

  params[updatedParamIndex].content = newValue

  emit('update:modelValue', {
    ...props.modelValue,
    params
  }, Delay.Delayed)
}

const onTableParamUpdate = (newValue: TableParamOptions & { content: string[][] }, delay: Delay, newHeaders?: string[]) => {
  const params = [...props.modelValue.params]
  const updatedParamIndex = props.modelValue.params.findIndex((param) => !isInlineStepParam(param))

  if (props.modelValue.step?.extraParamTemplate) {
    const firstRow: string[] = newValue.content.length > 0
      ? (newHeaders ? newHeaders : newValue.content[0].map((_, i) => props.modelValue.step?.extraParamTemplate?.[i].header ?? ''))
      : props.modelValue.step?.extraParamTemplate.map((item) => item.header)

    params[updatedParamIndex] = {
      ...params[updatedParamIndex] as TableStepParam,
      content: [
        firstRow,
        ...newValue.content
      ]
    }
  } else {
    params[updatedParamIndex] = {
      ...params[updatedParamIndex],
      ...newValue
    }
  }

  emit('update:modelValue', {
    ...props.modelValue,
    params
  }, delay)
}

const addMissingColumnsFromStepDataTemplate = () => {
  const params = [...props.modelValue.params]
  const updatedParamIndex = props.modelValue.params.findIndex((param) => !isInlineStepParam(param))
  const template = props.modelValue.step?.extraParamTemplate as TableStepParamTemplate
  const presentColumns = (props.modelValue.params[updatedParamIndex] as TableStepParam).content[0]

  params[updatedParamIndex] = {
    ...params[updatedParamIndex] as TableStepParam,
    content: params[updatedParamIndex].content.map((row, i) => {
      const newRow = [...row]

      for (const columnId in template) {
        const column = template[columnId]
        if (presentColumns.includes(column.header)) {
          continue
        }

        let newValue

        if (i === 0) {
          newValue = column.header
        } else if (column.strategy === ContentStrategy.Choices) {
          newValue = column.choices[0] ?? ''
        } else {
          newValue = ''
        }

        newRow.splice(columnId, 0, newValue)
      }

      return newRow
    })
  }

  emit('update:modelValue', {
    ...props.modelValue,
    params
  }, Delay.Instantly)
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
  paramIndex: (part.type === StepPartType.Param && props.modelValue.params.findIndex((param) => isInlineStepParam(param) && (param as InlineStepParam).stepPart.id === part.id)),
  param: (part.type === StepPartType.Param && props.modelValue.params.find((param) => isInlineStepParam(param) && (param as InlineStepParam).stepPart.id === part.id))
})))

const multilineParam = computed(() => props.modelValue.step?.extraParamType === StepParamType.Multiline && props.modelValue.params.find((param) => !isInlineStepParam(param)))

const tableParam = computed(() => props.modelValue.step?.extraParamType === StepParamType.Table && props.modelValue.params.find((param) => !isInlineStepParam(param)) as TableStepParam)

const tableParamWithTemplateAndMissingColumns = computed(() => {
  if (!tableParam.value || !props.modelValue.step?.extraParamTemplate) {
    return false
  }

  const headerRow = tableParam.value.content[0]

  if (!headerRow) {
    return false
  }

  const template = props.modelValue.step?.extraParamTemplate as TableStepParamTemplate
  const missingColumns = template.map((tpl, i) => ({
    ...tpl,
    order: i
  })).filter((col) => !headerRow.includes(col.header))

  return missingColumns.length > 0 ? missingColumns : false
})

const cellStrategies = computed(() => props.modelValue.step?.extraParamTemplate?.map((col) => ({
  choices: col.choices,
  strategy: col.strategy
})))

const headers = computed(() => props.modelValue.step?.extraParamTemplate ? (props.modelValue.params.find((param) => !isInlineStepParam(param)) as TableStepParam).content[0] : undefined)
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
  width: 100%;
  overflow-x: auto;
  padding-left: 0.4rem;
}

.ScenarioStepForm-adverbSelect {
  font-weight: bold;
}

.ScenarioStepForm-part--param {
  color: var(--el-color-primary);
  font-weight: bold;
  min-width: 9rem;
  margin: 0 0.5rem;
}

.ScenarioStepForm-adverbSelect, .ScenarioStepForm-part {
  display: inline-block;
  margin-right: 0.3rem;
}

.ScenarioStepForm-adverbSelect {
  width: 5rem;
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
