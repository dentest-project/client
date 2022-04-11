<template>
  <div v-if="step.step" class="step-display">
    <div class="step-display-sentence">
      <span class="step-display-adverb">{{ adverb }}</span>
      <span v-for="(part, id) in step.step.parts">
        <span v-if="part.type === 'sentence'" :key="id">
          {{ part.content }}</span
        >
        <span v-else :key="id" class="step-display-inline-param">
          {{ getParamForPart(part).content }}</span
        >
      </span>
    </div>
    <div
      v-if="extraParamType === 'multiline'"
      class="step-display-multiline-param"
    >
      <paragraph v-if="!isExtraParamValueJson" :str="extraParamValue" />
      <vue-json-pretty v-else :data="JSON.parse(extraParamValue)" :showLength="true" />
    </div>
    <table
      v-else-if="extraParamType === 'table'"
      class="step-display-table-param"
    >
      <tbody>
        <tr v-for="(row, j) in extraParamValue" :key="j">
          <td v-for="(cell, i) in row" :key="`${j}-${i}`">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import Paragraph from '~/components/Paragraph.vue';
import isJson from '~/helpers/isJson';
import {
  InlineStepParam,
  isInlineStepParam,
  ScenarioStep,
  StepAdverb,
  StepParam,
  StepParamType,
  StepPart,
} from '~/types'

export default Vue.extend({
  components: { Paragraph },
  model: {
    prop: 'step',
  },
  props: {
    step: {
      type: Object,
      required: true,
    } as PropOptions<ScenarioStep>,
  },
  methods: {
    getParamForPart(part: StepPart): InlineStepParam | undefined {
      const param = (this.step as ScenarioStep).params.find(
        (p) => isInlineStepParam(p) && p.stepPart?.id === part.id
      )

      if (param && isInlineStepParam(param)) {
        return param
      }
    },
  },
  computed: {
    adverb(): string {
      return ({
        [StepAdverb.Given]: 'Given',
        [StepAdverb.When]: 'When',
        [StepAdverb.Then]: 'Then',
        [StepAdverb.And]: 'And',
        [StepAdverb.But]: 'But',
      } as Record<StepAdverb, string>)[
        ((this as any).step as ScenarioStep).adverb
      ]
    },
    extraParamType(): StepParamType {
      const extraParam = (this as any).step.params.find(
        (p: StepParam) => !isInlineStepParam(p)
      )

      if (!extraParam) {
        return StepParamType.None
      }

      return extraParam.type
    },
    extraParamValue(): string | Array<Array<string>> {
      return (this as any).step.params.find(
        (p: StepParam) => !isInlineStepParam(p)
      ).content
    },
    isExtraParamValueJson(): boolean
    {
      const extraParamValue = (this as any).extraParamValue

      return typeof extraParamValue === 'string' && isJson(extraParamValue)
    }
  },
})
</script>

<style scoped>
.step-display {
  margin: 1rem 0;
}

.step-display-adverb {
  font-weight: bold;
}

.step-display-inline-param {
  font-weight: bold;
  color: #686de0;
}

.step-display-multiline-param {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.step-display-table-param {
  display: block;
  overflow-x: auto;
}

.step-display-table-param td {
  padding: 1rem;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
