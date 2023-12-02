import { StepAdverb, StepType } from '~/types'

export const getCorrespondingAdverb = (type: StepType): StepAdverb => {
  switch (type) {
    case StepType.Given:
      return StepAdverb.Given
    case StepType.When:
      return StepAdverb.When
    case StepType.Then:
      return StepAdverb.Then
  }
}
