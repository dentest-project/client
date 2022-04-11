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
  scenarioStep: ScenarioStep
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

const createScenarioStepFromStep = (scenarioSteps: Array<ScenarioStep>, step: Step): CreateScenarioStepFromStepOutput => {
  const generatedParams = generateParams(step);
  const correspondingAdverb = getCorrespondingAdverb(step.type);
  const shouldUseAdverb = scenarioSteps.map(s => s.adverb).reverse().find(s => ![StepAdverb.And, StepAdverb.But].includes(s)) !== correspondingAdverb

  const scenarioStep = {
    priority: scenarioSteps.length,
    adverb: shouldUseAdverb ? correspondingAdverb : StepAdverb.And,
    step,
    params: generatedParams.params
  };

  return {
    scenarioStep,
    withTableParam: generatedParams.withTableParam
  };
}

export default createScenarioStepFromStep;
