<template>
  <table class="TableParamTemplate">
    <tbody>
    <tr>
      <td v-for="(_, i) in modelValue" class="TableParamTemplate-settingsRow">
        <el-icon title="Insert a column before" size="small" @click="onInsertColumnBefore(i as number)"><ArrowLeft /></el-icon>
        <el-icon title="Delete the column" size="small" @click="onDeleteColumn(i as number)"><Delete /></el-icon>
        <el-icon title="Insert a column after" size="small" @click="onInsertColumnAfter(i as number)"><ArrowRight /></el-icon>
      </td>
      <td />
    </tr>
    <tr class="TableParamTemplate-header">
      <td v-for="(cell, i) in modelValue" class="cell TableParamTemplate-header">
        <el-input :model-value="cell.header" size="small" @update:model-value="(newValue) => onHeaderUpdated(i, newValue)" />
      </td>
    </tr>
    <tr>
      <td v-for="(cell, i) in modelValue" class="cell">
        <ContentChoicesInput
          v-if="cell.strategy === ContentStrategy.Choices"
          :model-value="cell.choices ?? []"
          @update:model-value="(newChoices) => onChoicesUpdated(i, newChoices)"
        />
        <ContentStrategySelector
          :model-value="cell.strategy"
          @update:model-value="(newStrategy) => onStrategyUpdated(i, newStrategy)"
        />
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight, Delete } from '@element-plus/icons-vue'
import { ContentStrategy } from '~/types'
import type { TableStepParamTemplate } from '~/types'

const props = defineProps<{
  modelValue: TableStepParamTemplate
}>()

const emit = defineEmits(['update:modelValue'])

const onHeaderUpdated = (x: number, newContent: string) => {
  const content = [...props.modelValue]

  content[x].header = newContent

  emit('update:modelValue', content)
}

const onStrategyUpdated = (x: number, newStrategy: ContentStrategy) => {
  const content = [...props.modelValue]

  content[x].strategy = newStrategy

  emit('update:modelValue', content)
}

const onChoicesUpdated = (x: number, newChoices: string[]) => {
  const content = [...props.modelValue]

  content[x].choices = newChoices

  emit('update:modelValue', content)
}

const onDeleteColumn = (columnId: number) => {
  const content = [...props.modelValue]

  content.splice(columnId, 1)

  emit('update:modelValue', content.length > 0 ? content : null)
}

const onInsertColumnAfter = (columnId: number) => {
  const content = [...props.modelValue]

  content.splice(columnId + 1, 0, {
    header: '',
    strategy: ContentStrategy.Free
  })

  emit('update:modelValue', content)
}

const onInsertColumnBefore = (columnId: number) => {
  const content = [...props.modelValue]

  content.splice(columnId, 0, {
    header: '',
    strategy: ContentStrategy.Free
  })

  emit('update:modelValue', content)
}

const nbColumns = computed(() => props.modelValue.length)
</script>

<style>
.TableParamTemplate {
  text-align: center;
}

.TableParamTemplate th,
.TableParamTemplate .TableParamTemplate-header,
.TableParamTemplate .TableParamTemplate-header td,
.TableParamTemplate .TableParamTemplate-header .el-input__wrapper,
.TableParamTemplate .TableParamTemplate-header input {
  background-color: var(--el-fill-color-darker);
  font-weight: bold;
}

.TableParamTemplate .el-icon:hover {
  cursor: pointer;
}

.TableParamTemplate .el-icon {
  fill: var(--el-color-secondary)
}

.TableParamTemplate td, .TableParamTemplate td .el-input__wrapper, .TableParamTemplate td input {
  background-color: var(--el-fill-color);
}

.TableParamTemplate th {
  padding: 1rem;
}
</style>
