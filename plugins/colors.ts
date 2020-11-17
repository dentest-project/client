import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $colors: Colors
  }
}

interface Colors {
  primary: string,
  add: string,
  success: string,
  error: string
}

// palette: https://flatuicolors.com/palette/gb
Vue.prototype.$colors = {
  primary: '#40739e',
  add: '#0097E6',
  success: '#44BD32',
  error: '#C23616'
};
