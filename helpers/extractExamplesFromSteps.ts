import type { ScenarioStep } from '~/types'

export const extractExamplesFromSteps = (steps: ScenarioStep[], previousExamples?: Record<string, string[]> | null) => {
  const examples = {}
  const keys: string[] = []
  const exampleRegex = /<([^<>]+)>/

  for (const step of steps) {
    for (const param of step.params) {
      if (typeof param.content === 'string' && exampleRegex.test(param.content)) {
        keys.push(exampleRegex?.exec(param.content)[1])
      } else if (typeof param.content !== 'string') {
        for (const row of param.content) {
          for (const cell of row) {
            if (exampleRegex.test(cell)) {
              keys.push(exampleRegex?.exec(cell)[1])
            }
          }
        }
      }
    }
  }

  if (keys.length === 0) {
    return null
  }

  const length = previousExamples && Object.values(previousExamples).length > 0 ? Object.values(previousExamples)[0].length : 1

  for (const key of keys) {
    examples[key] = previousExamples ? previousExamples[key] ?? Array(length).fill('') : ['']
  }

  return examples
}
