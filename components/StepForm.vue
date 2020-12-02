<template>
  <form class="step-form">
    <div class="step-form-sentence">
      <v-select :items="adverbsSelectItems" :value="step.adverb" solo @input="onAdverbChanged" />
      <div v-for="(part, id) in step.step.parts">
        <span v-if="part.type === 'sentence'" :key="id">{{ part.content }}</span>
        <inline-step-param-form v-else :key="id" :param="getParamForPart(part)" @input="onInlineParamUpdated" />
      </div>
    </div>
    <v-textarea v-if="extraParamType === 'multiline'" :value="extraParamValue" filled auto-grow @input="onExtraParamUpdated" />
  </form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import InlineStepParamForm from '~/components/InlineStepParamForm.vue';
import {
  InlineStepParam,
  isInlineStepParam,
  ScenarioStep,
  SelectItem,
  StepAdverb,
  StepParam,
  StepParamType,
  StepPart,
} from '~/types';

export default Vue.extend({
  components: {
    InlineStepParamForm
  },
  model: {
    prop: 'step'
  },
  props: {
    step: {
      type: Object,
      required: true
    } as PropOptions<ScenarioStep>,
    availableAdverbs: {
      type: Array,
      required: true
    } as PropOptions<Array<StepAdverb>>
  },
  methods: {
    getParamForPart(part: StepPart): InlineStepParam | undefined {
      const param = (this.step as ScenarioStep)
        .params
        .find(p => isInlineStepParam(p) && p.stepPart?.id === part.id);

      if (param && isInlineStepParam(param)) {
        return param;
      }
    },
    onAdverbChanged(adverb: StepAdverb) {
      this.$emit('input', {
        ...this.step,
        adverb
      });
    },
    onInlineParamUpdated(param: InlineStepParam) {
      const updatedParamIndex = this
        .step
        .params
        .findIndex(p => isInlineStepParam(p) && p.stepPart?.id === param.stepPart.id);
      const params = [...this.step.params];

      params[updatedParamIndex] = param;

      this.$emit('input', {
        ...this.step,
        params
      });
    },
    onExtraParamUpdated(content: string | Array<Array<string>>) {
      const updatedParamIndex = this
        .step
        .params
        .findIndex(p => !isInlineStepParam(p));
      const params = [...this.step.params];

      params[updatedParamIndex].content = content;

      this.$emit('input', {
        ...this.step,
        params
      });
    }
  },
  computed: {
    adverbsSelectItems(): Array<SelectItem> {
      const labels = {
        [StepAdverb.Given]: 'Given',
        [StepAdverb.When]: 'When',
        [StepAdverb.Then]: 'Then',
        [StepAdverb.And]: 'And',
        [StepAdverb.But]: 'But'
      } as Record<StepAdverb, string>;

      return (this as any).availableAdverbs.map((a: StepAdverb): SelectItem => ({
        text: labels[a],
        value: a,
        disabled: false
      }));
    },
    extraParamType(): StepParamType {
      const extraParam = (this as any).step.params.find((p: StepParam) => !isInlineStepParam(p));

      if (!extraParam) {
        return StepParamType.None;
      }

      return extraParam.type;
    },
    extraParamValue(): StepParamType {
      return (this as any).step.params.find((p: StepParam) => !isInlineStepParam(p)).content;
    }
  }
});
</script>

<style scoped>
.step-form {
  width: 100%;
}

.step-form .step-form-sentence {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: left;
}

.step-form .step-form-sentence > * {
  padding: 0.3rem;
  text-align: center;
  flex-grow: 0;
}

.step-form .step-form-sentence > *:first-child {
  flex-basis: 150px;
}

@media screen and (max-width: 640px) {
  .step-form .step-form-sentence {
    display: grid;
  }

  .step-form .step-form-sentence > * {
    text-align: left;
  }
}
</style>
