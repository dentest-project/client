<template>
  <div class="ScenarioStepDisplay">
    <span class="ScenarioStepDisplay-adverb">{{ adverb }}</span>
    <span v-for="part in parts" :class="['ScenarioStepDisplay-part', 'ScenarioStepDisplay-part--' + part.type]">{{ part.content }}</span>
    <div v-if="step.step?.extraParamType === StepParamType.Multiline" class="ScenarioStepDisplay-extraParam--multiline">
      <vueJsonPretty v-if="isExtraParamJson" :data="JSON.parse(extraParamValue.content)" showLength />
      <div v-else v-for="line in (extraParamValue.content as string).split('\n')">
        {{ line }}
      </div>
    </div>
    <TableStepParamDisplay v-else-if="isTableStepParam(extraParamValue)" :param="extraParamValue" />
  </div>
</template>

<script setup lang="ts">
import isJson from '~/helpers/isJson'
import { isInlineStepParam, isTableStepParam, type ScenarioStep, StepParamType, StepPartType } from '~/types'

const props = defineProps<{
  step: ScenarioStep
}>()

const adverb = computed(() => props.step.adverb.charAt(0).toUpperCase() + props.step.adverb.slice(1).toLowerCase())

const parts = computed(() => props.step.step?.parts.map((part) => {
  if (part.type === StepPartType.Sentence) {
    return {
      type: StepPartType.Sentence,
      content: part.content
    }
  }

  return {
    type: StepPartType.Param,
    content: props.step.params.find((param) => isInlineStepParam(param) && param.stepPart.id === part.id)?.content || ''
  }
}))

const extraParamValue = computed(() => props.step.params.find(p => !isInlineStepParam(p)))

const isExtraParamJson = computed(() => props.step.step?.extraParamType === StepParamType.Multiline && isJson(extraParamValue.value.content))
</script>

<style scoped>
.ScenarioStepDisplay {
  margin: 0.7rem;
}

.ScenarioStepDisplay-adverb {
  font-weight: bold;
}

.ScenarioStepDisplay-part--param {
  color: var(--el-color-primary-light-5);
  font-weight: bold;
}

.ScenarioStepDisplay-adverb, .ScenarioStepDisplay-part {
  display: inline-block;
  margin-right: 0.3rem;
}

.ScenarioStepDisplay-extraParam--multiline {
  background-color: var(--el-fill-color);
  min-height: 75px;
  padding: 0.5rem;
  color: var(--el-text-color-regular);
  font-size: 0.8rem;
  border-radius: 0.4rem;
}
</style>
