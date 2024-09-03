import { v4 as uuidv4 } from 'uuid'
import type { InlineStepParam, MultilineStepParam, Scenario, TableStepParam } from '~/types'
import { ScenarioType } from '~/types'

export const duplicateScenario = (toDuplicate: Scenario): Scenario => ({
  id: uuidv4(),
  type: toDuplicate.type,
  title: toDuplicate.type !== ScenarioType.Background ? toDuplicate.title + ' (copy)' : '',
  steps: [
    ...toDuplicate.steps.map((s) => ({
      id: uuidv4(),
      adverb: s.adverb,
      step: s.step,
      priority: s.priority,
      params: [
        ...s.params.map((p) => {
          if ('stepPart' in p) {
            return {
              id: uuidv4(),
              content: p.content,
              type: p.type,
              stepPart: p.stepPart,
            } as InlineStepParam
          }

          return {
            id: uuidv4(),
            content:
              typeof p.content === 'string'
                ? p.content
                : p.content.map((row) => [...row]),
            type: p.type,
            headerColumn: p.headerColumn,
            headerRow: p.headerRow
          } as MultilineStepParam | TableStepParam
        }),
      ],
    })),
  ],
  examples: toDuplicate.examples,
  tags: [
    ...toDuplicate.tags.map((t) => ({
      id: t.id,
      color: t.color,
      name: t.name,
    })),
  ],
})
