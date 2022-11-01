<template>
  <table class="TableForm">
    <thead v-if="headers">
      <tr>
        <th />
        <th v-for="(header, hi) in headers" :key="hi">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="value.length > 0 && deletableColumns">
        <td />
        <td
          v-for="(cell, i) in value[0]"
          :key="`del-col-${i}`"
          class="delete-column-cell"
        >
          <insert-column-before-chip @click="onInsertColumnBefore(i)" />
          <delete-chip v-if="value[0].length > 1" @click="onDeleteColumn(i)" />
          <insert-column-after-chip @click="onInsertColumnAfter(i)" />
        </td>
      </tr>
      <tr v-for="(row, i) in value" :key="i" :class="{ 'head': headerable && headerRow && i === 0 }">
        <td class="delete-row-cell">
          <insert-row-before-chip @click="onInsertRowBefore(i)" /><br />
          <delete-chip v-if="value.length > 1" @click="onDeleteRow(i)" /><br />
          <insert-row-after-chip @click="onInsertRowAfter(i)" />
        </td>
        <td v-for="(cell, j) in row" :key="`${i}-${j}`" class="cell" :class="{ 'head': headerable && headerColumn && j === 0 }">
          <v-text-field
            :value="cell"
            filled
            @input="(e) => onCellUpdated(i, j, e)"
          />
        </td>
        <td v-if="headerable && i === 0">
          <table-header-chip @click="onToggleHeaderRow"/>
        </td>
      </tr>
      <tr v-if="headerable && value.length > 0">
        <td />
        <td class="head-toggler">
          <table-header-chip @click="onToggleHeaderColumn"/>
        </td>
        <td v-if="value[0].length > 1" :colspan="value[0].length - 1" />
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import DeleteChip from '~/components/chips/DeleteChip.vue'
import InsertColumnAfterChip from '~/components/chips/InsertColumnAfterChip.vue'
import InsertColumnBeforeChip from '~/components/chips/InsertColumnBeforeChip.vue'
import InsertRowAfterChip from '~/components/chips/InsertRowAfterChip.vue'
import InsertRowBeforeChip from '~/components/chips/InsertRowBeforeChip.vue'
import TableHeaderChip from '~/components/chips/TableHeaderChip.vue';

export default Vue.extend({
  components: {
    TableHeaderChip,
    InsertRowAfterChip,
    InsertRowBeforeChip,
    InsertColumnAfterChip,
    InsertColumnBeforeChip,
    DeleteChip,
  },
  model: {
    prop: 'value',
  },
  props: {
    deletableColumns: {
      type: Boolean,
      required: true,
    },
    headerable: {
      type: Boolean,
      required: true,
    },
    headers: {
      type: Array,
      required: false,
    },
    headerColumn: {
      type: Boolean,
      required: false,
    },
    headerRow: {
      type: Boolean,
      required: false,
    },
    value: {
      type: Array,
      required: true,
    } as PropOptions<Array<Array<string>>>,
  },
  methods: {
    onCellUpdated(y: number, x: number, content: string): void {
      const value = [...this.value]

      value[y][x] = content

      this.$emit('input', value, { headerColumn: this.headerColumn, headerRow: this.headerRow })
    },
    onDeleteColumn(columnId: number) {
      const value = [...this.value]

      value.map((r) => r.splice(columnId, 1))

      this.$emit('input', value, { headerColumn: this.headerColumn, headerRow: this.headerRow })
    },
    onDeleteRow(rowId: number) {
      const value = [...this.value]

      value.splice(rowId, 1)

      this.$emit('input', value, { headerColumn: this.headerColumn, headerRow: this.headerRow })
    },
    onInsertColumnAfter(columnId: number) {
      const value = [...this.value]

      value.map((r) => r.splice(columnId + 1, 0, ''))

      this.$emit('input', value, { headerColumn: this.headerColumn, headerRow: this.headerRow })
    },
    onInsertColumnBefore(columnId: number) {
      const value = [...this.value]

      value.map((r) => r.splice(columnId, 0, ''))

      this.$emit('input', value, { headerColumn: this.headerColumn, headerRow: this.headerRow })
    },
    onInsertRowAfter(rowId: number) {
      const value = [...this.value]

      value.splice(rowId + 1, 0, new Array(value[rowId].length).fill(''))

      this.$emit('input', value, { headerColumn: this.headerColumn, headerRow: this.headerRow })
    },
    onInsertRowBefore(rowId: number) {
      const value = [...this.value]

      value.splice(rowId, 0, new Array(value[rowId].length).fill(''))

      this.$emit('input', value, { headerColumn: this.headerColumn, headerRow: this.headerRow })
    },
    onToggleHeaderRow() {
      this.$emit('input', this.value, { headerColumn: this.headerColumn, headerRow: !this.headerRow })
    },
    onToggleHeaderColumn() {
      this.$emit('input', this.value, { headerColumn: !this.headerColumn, headerRow: this.headerRow })
    }
  },
})
</script>

<style scoped>
table {
  padding-top: 1rem;
}

.delete-column-cell {
  text-align: center;
}

.delete-row-cell {
  width: fit-content;
  line-height: 1rem;
}

.head-toggler {
  text-align: center;
}

.head .cell, .head.cell {
  background-color: rgba(0, 0, 0, 0.1);
  font-weight: bold;
}
</style>
