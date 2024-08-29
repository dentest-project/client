<template>
  <table class="TableForm">
    <thead v-if="headers">
      <tr>
        <th v-for="header in headers">{{ header }}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-if="nbRows > 0">
        <td v-for="(_, i) in modelValue.content[0]" class="TableForm-settingsRow">
          <span v-if="headerable && i === 0">
            <el-icon title="Make/unmake header" size="small" @click="onToggleHeaderColumn"><CollectionTag /></el-icon>
          </span>
          <el-icon v-if="creatableColumns" title="Insert a column before" size="small" @click="onInsertColumnBefore(i as number)"><ArrowLeft /></el-icon>
          <el-icon title="Delete the column" v-if="nbColumns > 1 && deletableColumns" size="small" @click.prevent.stop="onDeleteColumn(i as number)"><Delete /></el-icon>
          <el-icon v-if="creatableColumns" title="Insert a column after" size="small" @click="onInsertColumnAfter(i as number)"><ArrowRight /></el-icon>
        </td>
        <td />
      </tr>
      <tr v-for="(row, i) in modelValue.content" :class="[ headerable && modelValue.headerRow && i === 0 && 'TableForm-header' ]">
        <td v-for="(cell, j) in row" class="cell" :class="[ headerable && modelValue.headerColumn && j === 0 && 'TableForm-header' ]">
          <el-select v-if="(cellChoices ?? [])[j]" size="small" :model-value="cell" @update:model-value="(newValue) => onCellUpdated(i, j, newValue)">
            <el-option v-for="choice in (cellChoices ?? [])[j]" :value="choice" :label="choice" />
          </el-select>
          <el-input v-else :model-value="cell" size="small" @update:model-value="(newValue) => onCellUpdated(i, j, newValue)" />
        </td>
        <td class="TableForm-settingsColumn">
          <div class="TableForm-settingsColumn-addRow">
            <el-icon title="Insert a row before" size="small" @click="onInsertRowBefore(i as number)"><ArrowUp /></el-icon>
            <el-icon title="Insert a row after" size="small" @click="onInsertRowAfter(i as number)"><ArrowDown /></el-icon>
          </div>
          <el-icon title="Delete the row" v-if="nbRows > 1" size="small" @click="onDeleteRow(i as number)"><Delete /></el-icon>
          <span v-if="headerable && i === 0">
            <el-icon title="Make/unmake header" size="small" @click="onToggleHeaderRow"><CollectionTag /></el-icon>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CollectionTag, Delete } from '@element-plus/icons-vue'
import { clone } from 'remeda'

const props = defineProps<{
  deletableColumns: boolean,
  creatableColumns: boolean,
  headerable: boolean,
  headers?: string[],
  cellChoices?: (string[] | null)[]
  modelValue: {
    headerColumn: boolean,
    headerRow: boolean,
    content: string[][]
  }
}>()

const emit = defineEmits(['update:modelValue'])

const onCellUpdated = (y: number, x: number, newContent: string) => {
  const content = [...props.modelValue.content]

  content[y][x] = newContent

  emit('update:modelValue', { ...props.modelValue, content })
}


const onDeleteColumn = (columnId: number) => {
  const content = clone([...props.modelValue.content])

  content.forEach((r) => r.splice(columnId, 1))

  emit('update:modelValue', { ...props.modelValue, content })
}


const onDeleteRow = (rowId: number) => {
  const content = deepClone([...props.modelValue.content])

  content.splice(rowId, 1)

  emit('update:modelValue', { ...props.modelValue, content })
}


const onInsertColumnAfter = (columnId: number) => {
  const content = [...props.modelValue.content]

  content.forEach((r) => r.splice(columnId + 1, 0, ''))

  emit('update:modelValue', { ...props.modelValue, content })
}

const onInsertColumnBefore = (columnId: number) => {
  const content = [...props.modelValue.content]

  content.forEach((r) => r.splice(columnId, 0, ''))

  emit('update:modelValue', { ...props.modelValue, content })
}


const onInsertRowAfter = (rowId: number) => {
  const content = [...props.modelValue.content]

  content.splice(rowId + 1, 0, new Array(nbColumns.value).fill(''))

  emit('update:modelValue', { ...props.modelValue, content })
}

const onInsertRowBefore = (rowId: number) => {
  const content = [...props.modelValue.content]

  content.splice(rowId, 0, new Array(nbColumns.value).fill(''))

  emit('update:modelValue', { ...props.modelValue, content })
}

const onToggleHeaderRow = () => {
  emit('update:modelValue', { ...props.modelValue, headerRow: !props.modelValue.headerRow })
}

const onToggleHeaderColumn = () => {
  emit('update:modelValue', { ...props.modelValue, headerColumn: !props.modelValue.headerColumn })
}

const nbRows = computed(() => props.modelValue.content.length)

const nbColumns = computed(() => props.modelValue.content[0].length)
</script>

<style>
.TableForm {
  text-align: center;
}

.TableForm-settingsColumn {
  padding: 0.5rem;
}

.TableForm-settingsColumn {
  text-align: left;
  display: flex;
  align-items: center;
}

.TableForm-settingsColumn-addRow {
  display: flex;
  flex-direction: column;
  margin-right: 0.2rem;
}

.TableForm th,
.TableForm .TableForm-header,
.TableForm .TableForm-header td,
.TableForm .TableForm-header .el-input__wrapper,
.TableForm .TableForm-header input {
  background-color: var(--el-fill-color-darker);
  font-weight: bold;
}

.TableForm .el-icon:hover {
  cursor: pointer;
}

.TableForm .el-icon {
  fill: var(--el-color-secondary)
}

.TableForm td, .TableForm td .el-input__wrapper, .TableForm td input {
  background-color: var(--el-fill-color);
}

.TableForm .cell {
  min-width: 9rem;
}

.TableForm th {
  padding: 1rem;
  font-size: 12px;
}
</style>
