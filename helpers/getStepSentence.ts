import type { Step } from '~/types';

const getStepSentence = (step: Step) => step.parts.map(p => p.content).join(' ')

export default getStepSentence
