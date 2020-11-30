<template>
  <form class="step-form">
    <div class="step-form-sentence">
      <v-select :items="adverbsSelectItems" :value="step.adverb" solo @input="onAdverbChanged" />
      <div v-for="(part, id) in step.step.parts">
        <span v-if="part.type === 'sentence'" :key="id">{{ part.content }}</span>
        <inline-step-param-form v-else :key="id" :param="getParamForPart(part)" @input="onInlineParamUpdated" />
      </div>
    </div>
    <div class="step-form-param-selector">
      <step-param-selector :step-param-type="extraParamType" class="step-form-param-selector" @input="onExtraParamTypeChanged" />
    </div>
  </form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import InlineStepParamForm from '~/components/InlineStepParamForm.vue';
import StepParamSelector from '~/components/StepParamSelector.vue';
import {
  InlineStepParam,
  MultilineStepParam,
  ScenarioStep,
  SelectItem,
  StepAdverb,
  StepParam,
  StepParamType,
  StepPart,
  TableStepParam
} from '~/types';

export default Vue.extend({
  components: {
    InlineStepParamForm,
    StepParamSelector
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
    getParamForPart(part: StepPart): InlineStepParam {
      return (this.step as ScenarioStep).params.find((p: InlineStepParam) => p.stepPart?.id === part.id);
    },
    onAdverbChanged(adverb: StepAdverb) {
      this.$emit('input', {
        ...this.step,
        adverb
      });
    },
    onInlineParamUpdated(param: InlineStepParam) {
      const updatedParamIndex = this.step.params.findIndex(p => p.stepPart?.id === param.stepPart.id);
      const params = [...this.step.params];

      params[updatedParamIndex] = param;

      this.$emit('input', {
        ...this.step,
        params
      });
    },
    onExtraParamTypeChanged(type: StepParamType) {
      const params = this.removeExtraParam([...this.step.params]);

      if (type === StepParamType.Multiline) {
        params.push({
          type: StepParamType.Multiline,
          content: ''
        } as MultilineStepParam);
      } else if (type === StepParamType.Table) {
        params.push({
          type: StepParamType.Table,
          content: []
        } as TableStepParam);
      }

      this.$emit('input', {
        ...this.step,
        params
      });
    },
    removeExtraParam(params: Array<StepParam>): void {
      const index = params.findIndex((p: StepParam) => p.type !== StepParamType.Inline);

      if (index !== -1) {
        params.splice(index, 1);
      }

      return params;
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
      const extraParam = (this as any).step.params.find((p: StepParam) => p.type !== StepParamType.Inline);

      if (!extraParam) {
        return StepParamType.None;
      }

      return extraParam.type;
    }
  }
});
</script>

<style scoped>
.step-form {
  width: 100%;
}

.step-form .step-form-param-selector {
  width: fit-content;
  margin: auto;
}

.step-form .step-form-sentence {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-form .step-form-sentence > * {
  padding: 0.3rem;
  text-align: center;
}
</style>
