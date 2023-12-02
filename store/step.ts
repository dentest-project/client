import { defineStore } from 'pinia';
import type { Step } from '~/types'

interface State {
  movingStep?: Step
}

export const useStepStore = defineStore('step', {
  state: (): State => ({
    movingStep: undefined
  }),
  actions: {
    getMovingStep() {
      return this.movingStep
    },
    moveStep(step: Step) {
      this.movingStep = step
    },
    stopMovingStep() {
      this.movingStep = undefined
    }
  }
})
