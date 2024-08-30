import { v4 as uuidv4 } from 'uuid'
import {
  ContentStrategy,
  type InlineStepParam,
  type MultilineStepParam,
  type ScenarioStep,
  type Step,
  StepAdverb,
  StepParamType,
  type StepPart,
  StepPartType,
  type TableStepParam,
  TableStepParamTemplateColumn
} from '~/types'
import { getCorrespondingAdverb } from './getCorrespondingAdverb'

interface GenerateParamsOutput {
  withTableParam: boolean,
  params: Array<InlineStepParam | MultilineStepParam | TableStepParam>
}

interface CreateScenarioStepFromStepOutput {
  withTableParam: boolean,
  scenarioStep: ScenarioStep,
  insertingIndex: number
}

const getDefaultValueForStepPart = (part: StepPart) => {
  if (part.strategy === ContentStrategy.Choices && part.choices) {
    return part.choices[0]
  }

  return part.content
}

const getDefaultValueForTableTemplateCell = (cellDefinition: TableStepParamTemplateColumn) => {
  if (cellDefinition.strategy === ContentStrategy.Choices && cellDefinition.choices) {
    return cellDefinition.choices[0]
  }

  if (cellDefinition.strategy === ContentStrategy.RowIndex) {
    return '1'
  }

  return ''
}

const generateParams = (step: Step): GenerateParamsOutput => {
  let withTableParam = false

  const params: Array<InlineStepParam | MultilineStepParam | TableStepParam> = step
    .parts
    .filter(p => p.type === StepPartType.Param)
    .map(stepPart => ({
      id: uuidv4(),
      type: StepParamType.Inline,
      content: getDefaultValueForStepPart(stepPart),
      stepPart
    } as InlineStepParam));

  if (!step.extraParamType || step.extraParamType === StepParamType.None) {
    return {
      withTableParam,
      params
    }
  }

  if (step.extraParamType === StepParamType.Multiline) {
    params.push({
      id: uuidv4(),
      type: step.extraParamType,
      content: ''
    })
  } else {
    withTableParam = true
    params.push({
      id: uuidv4(),
      type: step.extraParamType,
      content: [] as Array<Array<string>>,
      headerColumn: false,
      headerRow: false
    })
  }

  return {
    withTableParam,
    params
  }
}

const findBestIndexForStep = (scenarioSteps: Array<ScenarioStep>, adverb: StepAdverb): [number, boolean] => {
  const firstGivenIndex = scenarioSteps.findIndex(s => s.adverb === StepAdverb.Given)
  const firstWhenIndex = scenarioSteps.findIndex(s => s.adverb === StepAdverb.When)
  const firstThenIndex = scenarioSteps.findIndex(s => s.adverb === StepAdverb.Then)


  if (adverb === StepAdverb.Given) {
    if (firstGivenIndex === -1) {
      return [0, true]
    }

    if (firstWhenIndex > 0) {
      return [firstWhenIndex, false]
    }

    if (firstThenIndex > 0) {
      return [firstThenIndex, false]
    }

    return  [scenarioSteps.length, false]
  } else if (adverb === StepAdverb.When && firstThenIndex > 0) {
    return  [firstThenIndex, firstWhenIndex === -1]
  } else if (adverb === StepAdverb.When) {
    return  [scenarioSteps.length, firstWhenIndex === -1]
  } else if (adverb === StepAdverb.Then) {
    return  [scenarioSteps.length, firstThenIndex === -1]
  }

  return [scenarioSteps.length, true]
}

export default function createScenarioStepFromStep(scenarioSteps: ScenarioStep[], step: Step): CreateScenarioStepFromStepOutput {
  const generatedParams = generateParams(step)
  const correspondingAdverb = getCorrespondingAdverb(step.type)
  const [insertingIndex, shouldUseAdverb] = findBestIndexForStep(scenarioSteps, correspondingAdverb)

  const scenarioStep = {
    id: uuidv4(),
    priority: scenarioSteps.length,
    adverb: shouldUseAdverb ? correspondingAdverb : StepAdverb.And,
    step,
    params: generatedParams.params
  }

  if (generatedParams.withTableParam) {
    const tableParamIndex = scenarioStep.params.findIndex((s) => s.type === StepParamType.Table)

    if (tableParamIndex !== -1) {
      (scenarioStep.params[tableParamIndex]).content = step.extraParamTemplate
        ? [
          step.extraParamTemplate.map((item) => item.header),
          step.extraParamTemplate.map((item) => getDefaultValueForTableTemplateCell(item))
        ]
        : [['', ''], ['', '']];
      (scenarioStep.params[tableParamIndex] as TableStepParam).headerRow = !!step.extraParamTemplate
    }
  }

  return {
    scenarioStep,
    insertingIndex
  }
}
