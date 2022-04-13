import getCorrespondingAdverb from '~/helpers/getCorrespondingAdverb';
import {
  InlineStepParam,
  MultilineStepParam,
  ScenarioStep,
  Step,
  StepAdverb,
  StepParamType,
  StepPart,
  StepPartStrategy,
  StepPartType,
  TableStepParam
} from '~/types';

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
  if (part.strategy === StepPartStrategy.Choices && part.choices !== null && part.choices.length > 0) {
    return part.choices[0]
  }

  return part.content
}

const generateParams = (step: Step): GenerateParamsOutput => {
  let withTableParam = false;
  const params: Array<InlineStepParam | MultilineStepParam | TableStepParam> = step
    .parts
    .filter(p => p.type === StepPartType.Param)
    .map(stepPart => ({
      type: StepParamType.Inline,
      content: getDefaultValueForStepPart(stepPart),
      stepPart
    } as InlineStepParam));

  if (!step.extraParamType || step.extraParamType === StepParamType.None) {
    return {
      withTableParam,
      params
    };
  }

  if (step.extraParamType === StepParamType.Multiline) {
    params.push({
      type: step.extraParamType,
      content: ''
    });
  } else {
    withTableParam = true;
    params.push({
      type: step.extraParamType,
      content: [] as Array<Array<string>>
    });
  }

  return {
    withTableParam,
    params
  };
};

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

const createScenarioStepFromStep = (scenarioSteps: Array<ScenarioStep>, step: Step): CreateScenarioStepFromStepOutput => {
  const generatedParams = generateParams(step)
  const correspondingAdverb = getCorrespondingAdverb(step.type)
  const [insertingIndex, shouldUseAdverb] = findBestIndexForStep(scenarioSteps, correspondingAdverb)

  const scenarioStep = {
    priority: scenarioSteps.length,
    adverb: shouldUseAdverb ? correspondingAdverb : StepAdverb.And,
    step,
    params: generatedParams.params
  };

  return {
    scenarioStep,
    withTableParam: generatedParams.withTableParam,
    insertingIndex
  };
}

export default createScenarioStepFromStep;
