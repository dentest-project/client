<template>
  <div class="examples">
    <h3>Examples</h3>
    <table v-if="mode === $modes.view">
      <thead>
        <tr>
          <th v-for="(key, i) in headers" :key="i">{{ key }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in value" :key="i">
          <td v-for="(cell, j) in row" :key="`${i}${j}`">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
    <table-form
      v-else
      :headers="headers"
      :deletable-columns="false"
      :headerable="false"
      :value="value"
      @input="onUpdated"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import TableForm from '~/components/TableForm.vue'
import { Mode } from '~/types'

export default Vue.extend({
  components: {
    TableForm,
  },
  model: {
    prop: 'step',
  },
  props: {
    mode: {
      type: Number,
      required: true,
    } as PropOptions<Mode>,
    examples: {
      type: Object,
      required: true,
    } as PropOptions<Record<string, Array<string>>>,
  },
  methods: {
    onUpdated(e: Array<Array<string>>): void {
      const out: Record<string, Array<string>> = {}
      const keys: Array<string> = Object.keys(this.examples)

      keys.forEach((k) => {
        out[k] = []
      })

      e.forEach((row, i) =>
        row.forEach((cell, j) => {
          out[keys[j]][i] = cell
        })
      )

      this.$emit('input', out)
    },
  },
  computed: {
    headers(): Array<string> {
      return Object.keys((this as any).examples)
    },
    value(): Array<Array<string>> {
      return (Object.values((this as any).examples) as Array<
        Array<string>
      >)[0].map((v, i) =>
        Object.keys((this as any).examples).map(
          (k) => (this as any).examples[k][i]
        )
      )
    },
  },
})
</script>

<style scoped>
.examples td,
.examples th {
  padding: 1rem;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
