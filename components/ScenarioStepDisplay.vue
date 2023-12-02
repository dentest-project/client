<template>
  <div class="ScenarioStepDisplay">
    <span class="ScenarioStepDisplay-adverb">{{ adverb }}</span>
    <span v-for="part in parts" :class="['ScenarioStepDisplay-part', 'ScenarioStepDisplay-part--' + part.type]">{{ part.content }}</span>
    <div v-if="props.step.step?.extraParamType === StepParamType.Multiline" class="ScenarioStepDisplay-extraParam--multiline">
      <div v-for="line in (extraParamValue.content as string).split('\n')">
        {{ line }}
      </div>
    </div>
    <TableStepParamDisplay v-else-if="isTableStepParam(extraParamValue)" :param="extraParamValue" />
  </div>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
.ScenarioStepDisplay {
  margin: 0.5rem;
}

.ScenarioStepDisplay-adverb {
  font-weight: bold;
}

.ScenarioStepDisplay-part--param {
  color: var(--el-color-primary);
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
  color: var(--el-text-color-regular)
}
</style>
