import { Step } from '~/types';

interface State {
  draggedStep: Step|null
}

export const state = (): State => ({
  draggedStep: null
});

export const mutations = {
  dragStep(state: State, step: Step) {
    state.draggedStep = step;
  },
  clearDraggedStep(state: State) {
    state.draggedStep = null;
  }
};
