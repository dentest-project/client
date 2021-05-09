import getCorrespondingAdverb from '~/helpers/getCorrespondingAdverb';
import {
  InlineStepParam,
  MultilineStepParam,
  ScenarioStep,
  Step,
  StepParamType,
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

const generateParams = (step: Step): GenerateParamsOutput => {
  let withTableParam = false;
  const params: Array<InlineStepParam | MultilineStepParam | TableStepParam> = step
    .parts
    .filter(p => p.type === StepPartType.Param)
    .map(stepPart => ({
      type: StepParamType.Inline,
      content: stepPart.content ,
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

const createScenarioStepFromStep = (priority: number, step: Step): CreateScenarioStepFromStepOutput => {
  const generatedParams = generateParams(step);
  const scenarioStep = {
    priority,
    adverb: getCorrespondingAdverb(step.type),
    step,
    params: generatedParams.params
  };

  return {
    scenarioStep,
    withTableParam: generatedParams.withTableParam
  };
}

export default createScenarioStepFromStep;
