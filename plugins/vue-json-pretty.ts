import { defineNuxtPlugin } from 'nuxt/app'
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VueJsonPretty', VueJsonPretty);
})
