<template>
  <h3>Examples</h3>
  <table v-if="mode === Mode.View" class="ExamplesContent-table">
    <thead>
      <tr>
        <th v-for="header in headers">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in tableValue">
        <td v-for="cell in row">{{ cell }}</td>
      </tr>
    </tbody>
  </table>
  <TableForm
    v-else
    :deletable-columns="false"
    :headers="headers"
    :headerable="false"
    :model-value="{ headerColumn: false, headerRow: true, content: tableValue }"
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import { Mode } from '~/types'

const props = defineProps<{
  mode: Mode,
  modelValue: Record<string, string[]>
}>()

const emit = defineEmits(['update:modelValue'])

const onUpdate = ({ content }: { content: string[][] }) => {
  emit(
    'update:modelValue',
    Object.fromEntries(Object.keys(props.modelValue).map((key, keyId) => [
      key,
      content.flatMap((row) => row[keyId])])
    )
  )
}

const headers = computed(() => Object.keys(props.modelValue))

const tableValue = computed(() => Object.values(props.modelValue)[0].map((keyExamples, keyExampleId) => Object.keys(props.modelValue).map((key) => props.modelValue[key][keyExampleId])))
</script>

<style scoped>
.ExamplesContent-table td, .ExamplesContent-table th {
  padding: 1rem;
  margin: 0;
  min-width: 3rem;
}

.ExamplesContent-table td {
  background-color: var(--el-fill-color);
}

.ExamplesContent-table th {
  font-weight: bold;
  background-color: var(--el-fill-color-darker);
}

h3 {
  margin-top: 2rem;
}
</style>
