<template>
  <client-only>
    <el-dialog :model-value="modelValue" @update:model-value="onDialogStatusChanged" title="Pull feature">
      <div class="PullFeatureDialog-description">
        This is the feature, written in standardized Gherkin. You can copy it and paste it wherever you need in your project.
        It can be used as is, with the Gherkin interpreter that best suits your needs.<br><br>

        As a developer, you may prefer using IDE extensions, such as <a href="https://marketplace.visualstudio.com/items?itemName=Dentest.dentest" target="_blank">Dentest for VSCode</a>, or
        <a href="https://plugins.jetbrains.com/plugin/19626-dentest" target="_blank">Dentest for Jetbrains</a>, as
        they allow you to pull the features without leaving your IDE, by creating the Gherkin files at the right place in one click.
      </div>
      <el-input
        class="PullFeatureDialog-path"
        size="small"
        disabled
        placeholder="Path of the feature"
        :model-value="featurePath"
      />
      <div><CopyButton @click="onCopy" /></div>
      <el-input
        size="small"
        class="PullFeatureDialog-feature"
        type="textarea"
        multiline
        disabled
        :autosize="{ maxRows: 10 }"
        :model-value="featureContents"
        placeholder="Feature contents"
      />
    </el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { loggedInUser } from '~/helpers/auth'
import type { Feature } from '~/types'

const props = defineProps<{
  modelValue: boolean,
  feature: Feature
}>()
const { $api } = useNuxtApp()
const { data } = useAuth()

const emit = defineEmits(['update:modelValue'])

const featureContents = ref('')
const featurePath = ref('')

const loadFeatureContents = async () => {
  const pullToken = (await $api.getProjectUserToken(props.feature.rootProject?.id, loggedInUser(data.value).id)).token
  const featuresContents = await $api.pullFeatures(pullToken)

  const foundFeature = featuresContents.find((r) => r.id === props.feature.id)

  featureContents.value = foundFeature?.feature ?? ''
  featurePath.value = foundFeature?.path ?? ''
}

const onDialogStatusChanged = (e: boolean) => {
  emit('update:modelValue', e)
}

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(featureContents.value)

    ElNotification({
      title: 'Feature contents copied',
      message: 'The feature contents have been successfully copied to your clipboard. Paste them wherever you need.',
      type: 'success',
    })

    emit('update:modelValue', false)
  } catch (err) {
    ElNotification({
      title: 'Failed to copy',
      message: 'An error occurred while copying the feature contents to the clipboard',
      type: 'error',
    })
  }
}

loadFeatureContents()
</script>

<style scoped>
.PullFeatureDialog-description {
  font-size: 0.8rem;
  margin: 0 0 1rem 0;
  font-style: italic;
}

.PullFeatureDialog-path {
  width: 100%;
  margin-bottom: 1rem;
}

.PullFeatureDialog-feature {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace
}
</style>
