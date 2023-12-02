// We change the scenario edition mode to "view" when clicking outside. But it quits also when a selectbox option is
// clicked. We need to prevent this by holding the focus when dealing with a selectbox element

import { defineStore } from 'pinia';

interface State {
  focusHeld: boolean
}

export const useScenarioContentFocusManagementStore = defineStore('scenarioContentFocusManagement', {
  state: (): State => ({
    focusHeld: false
  }),
  actions: {
    isFocusHeld() {
      return this.focusHeld
    },
    holdFocus() {
      this.focusHeld = true
    },
    releaseFocus() {
      this.focusHeld = false
    }
  }
})
