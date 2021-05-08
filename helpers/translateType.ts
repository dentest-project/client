import { StepType } from '~/types';

const translateStepType = (type: StepType): string => {
  switch (type) {
    case StepType.Given:
      return 'Given';
    case StepType.When:
      return 'When';
    case StepType.Then:
      return 'Then'
  }
}

export default translateStepType;
