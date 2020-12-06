<template>
  <table>
    <thead v-if="headers">
      <tr>
        <th />
        <th v-for="(header, hi) in headers" :key="hi">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="value.length > 0 && deletableColumns">
        <td />
        <td v-for="(cell, i) in value[0]" :key="`del-col-${i}`" class="delete-column-cell">
          <insert-column-before-chip @click="onInsertColumnBefore(i)" />
          <delete-chip v-if="value[0].length > 1" @click="onDeleteColumn(i)" />
          <insert-column-after-chip @click="onInsertColumnAfter(i)" />
        </td>
      </tr>
      <tr v-for="(row, i) in value" :key="i">
        <td class="delete-row-cell">
          <insert-row-before-chip @click="onInsertRowBefore(i)" /><br>
          <delete-chip v-if="value.length > 1" @click="onDeleteRow(i)" /><br>
          <insert-row-after-chip @click="onInsertRowAfter(i)" />
        </td>
        <td v-for="(cell, j) in row" :key="`${i}-${j}`">
          <v-text-field :value="cell" filled @input="e => onCellUpdated(i, j, e)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import DeleteChip from '~/components/chips/DeleteChip.vue';
import InsertColumnAfterChip from '~/components/chips/InsertColumnAfterChip.vue';
import InsertColumnBeforeChip from '~/components/chips/InsertColumnBeforeChip.vue';
import InsertRowAfterChip from '~/components/chips/InsertRowAfterChip.vue';
import InsertRowBeforeChip from '~/components/chips/InsertRowBeforeChip.vue';

export default Vue.extend({
  components: { InsertRowAfterChip, InsertRowBeforeChip, InsertColumnAfterChip, InsertColumnBeforeChip, DeleteChip },
  model: {
    prop: 'value'
  },
  props: {
    deletableColumns: {
      type: Boolean,
      required: true
    },
    headers: {
      type: Array,
      required: false
    },
    value: {
      type: Array,
      required: true
    } as PropOptions<Array<Array<string>>>
  },
  methods: {
    onCellUpdated(y: number, x: number, content: string): void {
      const value = [...this.value];

      value[y][x] = content;

      this.$emit('input', value);
    },
    onDeleteColumn(columnId: number) {
      const value = [...this.value];

      value.map(r => r.splice(columnId, 1));

      this.$emit('input', value);
    },
    onDeleteRow(rowId: number) {
      const value = [...this.value];

      value.splice(rowId, 1);

      this.$emit('input', value);
    },
    onInsertColumnAfter(columnId: number) {
      const value = [...this.value];

      value.map(r => r.splice(columnId + 1, 0, ''));

      this.$emit('input', value);
    },
    onInsertColumnBefore(columnId: number) {
      const value = [...this.value];

      value.map(r => r.splice(columnId, 0, ''));

      this.$emit('input', value);
    },
    onInsertRowAfter(rowId: number) {
      const value = [...this.value];

      value.splice(rowId + 1, 0, new Array(value[rowId].length).fill(''));

      this.$emit('input', value);
    },
    onInsertRowBefore(rowId: number) {
      const value = [...this.value];

      value.splice(rowId, 0, new Array(value[rowId].length).fill(''));

      this.$emit('input', value);
    }
  }
});
</script>

<style scoped>
.delete-column-cell {
  text-align: center;
}

.delete-row-cell {
  width: fit-content;
  line-height: 1rem;
}
</style>
