import Vue from 'vue'
import { Mode } from '~/types';

declare module 'vue/types/vue' {
  interface Vue {
    $modes: Modes
  }
}

interface Modes {
  view: Mode,
  edit: Mode
}

Vue.prototype.$modes = {
  view: Mode.View,
  edit: Mode.Edit
} as Modes;
