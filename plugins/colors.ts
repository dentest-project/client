import { defineNuxtPlugin } from 'nuxt/app'

interface Colors {
  primary: string,
  secondary: string,
  tertiary: string,
  quaternary: string,
  add: string,
  cut: string,
  success: string,
  warning: string,
  error: string,
  lightPrimary: string,
  lightSecondary: string,
  cancel: string,
  disabled: string,
  live: string,
  ready: string,
  draft: string
}

export default defineNuxtPlugin(() => ({
  provide: {
    'colors': (): Colors => ({
      primary: '#686de0',
      secondary: '#003668',
      tertiary: '#27ab83',
      quaternary: '#535c68',
      add: '#4834d4',
      cut: '#22a6b3',
      success: '#6ab04c',
      warning: '#f1c40f',
      error: '#eb4d4b',
      lightPrimary: '#E2E7FF',
      lightSecondary: '#78beff',
      cancel: '#777777',
      disabled: '#777777',
      live: '#6ab04c',
      ready: '#f1c40f',
      draft: '#777777',
    })
  }
}))
