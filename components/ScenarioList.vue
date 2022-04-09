<template>
  <div>
    <v-row class="scenarios">
      <scenario-content
        v-for="(scenario, i) in scenarios"
        :can-move-up="i > 0 && !(i === 1 && isBackground(scenarios[0]))"
        :can-move-down="
        i < scenarios.length - 1 && !(i === 0 && isBackground(scenario))
      "
        :can-write="canWrite"
        :scenario="scenario"
        :backgroundable="i === 0"
        :project="project"
        :key="i"
        @input="(e) => onUpdated(i, e)"
        @copy="() => onCopy(i)"
        @deleted="() => onDeleted(i)"
        @up="() => onUp(i)"
        @down="() => onDown(i)"
      />
    </v-row>
    <add-button v-if="canWrite" @click="onAdd" title="Add scenario" />
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import AddButton from '~/components/buttons/AddButton.vue'
import ScenarioContent from '~/components/ScenarioContent.vue'
import {
  InlineStepParam,
  MultilineStepParam,
  Project,
  Scenario,
  ScenarioStep,
  ScenarioType,
  TableStepParam,
  Tag,
} from '~/types'

export default Vue.extend({
  components: {
    AddButton,
    ScenarioContent,
  },
  model: {
    prop: 'scenarios',
  },
  props: {
    canWrite: {
      type: Boolean,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    } as PropOptions<Project>,
    scenarios: {
      type: Array,
      required: true,
    } as PropOptions<Array<Scenario>>,
  },
  methods: {
    isBackground(scenario: Scenario): boolean {
      return scenario.type === ScenarioType.Background
    },
    onAdd(): void {
      this.$emit('input', [
        ...this.scenarios,
        {
          type: ScenarioType.Regular,
          title: 'Scenario title',
          steps: [] as Array<ScenarioStep>,
          tags: [],
        },
      ])
    },
    onDeleted(i: number) {
      const scenarios = [...this.scenarios]

      scenarios.splice(i, 1)
      this.$emit('input', scenarios)
    },
    onUpdated(i: number, scenario: Scenario) {
      const scenarios = [...this.scenarios]

      scenarios[i] = scenario
      this.$emit('input', scenarios)
    },
    onCopy(i: number) {
      const scenarios = [...this.scenarios]
      const toCopy = { ...scenarios[i] }

      scenarios.push({
        type: toCopy.type,
        title: toCopy.title,
        steps: [
          ...toCopy.steps.map((s: ScenarioStep) => ({
            adverb: s.adverb,
            step: s.step,
            priority: s.priority,
            params: [
              ...s.params.map((p) => {
                if ('stepPart' in p) {
                  return {
                    content: p.content,
                    type: p.type,
                    stepPart: p.stepPart,
                  } as InlineStepParam
                }

                return {
                  content:
                    typeof p.content === 'string'
                      ? p.content
                      : p.content.map((row) => [...row]),
                  type: p.type,
                } as MultilineStepParam | TableStepParam
              }),
            ],
          })),
        ],
        examples: toCopy.examples,
        tags: [
          ...toCopy.tags.map((t: Tag) => ({
            id: t.id,
            color: t.color,
            name: t.name,
          })),
        ],
      })

      this.$emit('input', scenarios)
    },
    onUp(i: number) {
      if (
        i === 0 ||
        (i === 1 && this.scenarios[0].type === ScenarioType.Background)
      ) {
        return
      }

      const scenarios = [...this.scenarios]
      const previousScenario = scenarios[i - 1]

      scenarios[i - 1] = scenarios[i]
      scenarios[i] = previousScenario

      this.$emit('input', scenarios)
    },
    onDown(i: number) {
      if (
        i === this.scenarios.length - 1 ||
        (i === 0 && this.scenarios[i].type === ScenarioType.Background)
      ) {
        return
      }

      const scenarios = [...this.scenarios]
      const nextScenario = scenarios[i + 1]

      scenarios[i + 1] = scenarios[i]
      scenarios[i] = nextScenario

      this.$emit('input', scenarios)
    },
  },
})
</script>

<style scoped>
.scenarios {
  margin: 1rem 0;
}
</style>
