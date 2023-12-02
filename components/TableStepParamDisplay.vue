<template>
  <table class="TableStepParamDisplay">
    <thead v-if="param.headerRow && param.content.length > 0">
    <tr>
      <th v-for="head in param.content[0]">
        {{ head }}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row in (param.headerRow ? param.content.slice(1) : param.content)">
      <th v-if="param.headerColumn">
        {{ row[0] }}
      </th>
      <td v-for="cell in (param.headerColumn ? row.slice(1) : row)">
        {{ cell }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { TableStepParam } from '~/types'

defineProps<{
  param: TableStepParam
}>()
</script>

<style scoped>
.TableStepParamDisplay {
  display: block;
  overflow-x: auto;
}

.TableStepParamDisplay td, .TableStepParamDisplay th {
  padding: 1rem;
  margin: 0;
  min-width: 3rem;
}

.TableStepParamDisplay td {
  background-color: var(--el-fill-color);
}

.TableStepParamDisplay th {
  font-weight: bold;
  background-color: var(--el-fill-color-darker);
}
</style>
