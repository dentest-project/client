<template>
  <Menu :light-mode="lightMode" @update:lightModeValue="v => { lightMode = v }" />
  <slot />
</template>


<script setup lang="ts">
import 'element-plus/theme-chalk/dark/css-vars.css'
import { useThemeStore } from '~/store/theme'

const { getTheme, setTheme } = useThemeStore()

const preferredDark = usePreferredDark()

const lightMode = ref<'light' | 'dark'>(getTheme() ?? (preferredDark.value ? 'dark' : 'light'))

useHead({
  htmlAttrs: {
    class: lightMode
  }
})

watch(lightMode, (newV, oldV) => {
  if (!oldV) {
    return
  }

  setTheme(lightMode.value)
})
</script>

<style>
@font-face {
  font-family: 'Nunito';
  src: url("/Nunito-SemiBold.ttf") format("truetype");
}

@font-face {
  font-family: 'Luciole';
  src: url("/Luciole.ttf") format("truetype");
}

:root {
  --el-color-primary: #686de0 !important;
  --el-color-primary-dark-2: #9599e9 !important;
  --el-color-primary-light-3: #7f83e5 !important;
  --el-color-primary-light-5: #8e91e8 !important;
  --el-button-active-bg-color: #8e91e8 !important;
  --el-font-family: Luciole !important;
  --el-button-font-weight: bold;
}

.el-input {
  --el-input-width: auto !important;
}

html {
  font-family:
    'Luciole',
    'Nunito',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

html.light {
  background-color: #EEEEEE;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

h1 {
  padding: 1rem 0;
  font-size: 32px;
}

h2 {
  padding: 0.5rem 0;
}

.vjs-value__string {
  color: #2814b4 !important;
  font-weight: bold;
}
.vjs-value__boolean, .vjs-value__number {
  font-weight: bold;
}
.vjs-value__null {
  font-weight: bold;
}
.vjs-comment {
  color: #ffffff !important;
  background-color: #000000;
  font-weight: bold;
  padding: 2px;
}
</style>
