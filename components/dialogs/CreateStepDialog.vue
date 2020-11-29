<template>
  <v-dialog width="75%" :value=value @input="onDialogStatusChanged">
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">Create new step</v-card-title>
        <v-card-text>
          <div class="create-step-dialog">
            <v-select :items="stepTypes" v-model="type" />
            <div class="create-step-inputs">
              <v-text-field
                v-for="(part, i) in parts"
                v-model="parts[i].content"
                :key="partsHashes[i].toString() + '#' + i"
                :class="`create-step-input--${parts[i].type}`"
                clearable
                @select="e => onContentSelected(i, e)"
                @click:clear.stop="() => onInputCleared(i)"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <submit-button>Create step</submit-button>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import SubmitButton from '~/components/buttons/SubmitButton.vue';
import { FeatureRootProject, SelectItem, Step, StepPartType, StepType } from '~/types';

export default Vue.extend({
  components: { SubmitButton },
  model: {
    prop: 'value'
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    featureRootProject: {
      type: Object,
      required: true
    } as PropOptions<FeatureRootProject>
  },
  data: function (): Step {
    return {
      type: StepType.Given,
      parts: [
        {
          type: StepPartType.Sentence,
          priority: 0,
          content: ''
        }
      ],
      partsHashes: [Math.random(0, 2000000000)]
    }
  },
  methods: {
    fixPriorities() {
      for (let i = 0 ; i < this.parts.length ; i++) {
        this.parts[i].priority = i;
        this.partsHashes[i] = Math.random(0, 2000000000);
      }
    },
    onContentSelected(i: number, e: InputEvent): void {
      if (this.parts[i].type === StepPartType.Param) {
        return;
      }

      const before = e.target.value.substring(0, e.target.selectionStart).trim();
      const selected = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd).trim();
      const after = e.target.value.substring(e.target.selectionEnd).trim();

      if (after !== '') {
        this.parts.splice(i + 1, 0, {
          type: StepPartType.Sentence,
          priority: 0,
          content: after
        });
      }
      this.parts.splice(i + 1, 0, {
        type: StepPartType.Param,
        priority: i + 1,
        content: selected
      });
      if (before !== '') {
        this.parts.splice(i + 1, 0, {
          type: StepPartType.Sentence,
          priority: 0,
          content: before
        });
      }
      this.parts.splice(i, 1);
      this.fixPriorities();
    },
    onInputCleared(i: number): void {
      if (this.parts[i].type === StepPartType.Sentence) {
        if (this.parts.length === 1) {
          this.parts[0].content = '';
          return;
        }

        this.parts.splice(i, 1);
        this.fixPriorities();
        return;
      }

      let fullContent = '';
      const elementToReplace = i > 0 ? i - 1 : 0;
      let amountToDelete = 1;
      if (i > 0) {
        fullContent += this.parts[i - 1].content + ' ';
        amountToDelete++;
      }
      fullContent += this.parts[i].content;
      if (i < this.parts.length - 1) {
        fullContent += ' ' + this.parts[i + 1].content;
        amountToDelete++;
      }
      this.parts.splice(elementToReplace, amountToDelete, {
        type: StepPartType.Sentence,
        content: fullContent,
        priority: 0
      });
      this.fixPriorities();
    },
    async onSubmit (): Promise<void> {
      try {
        await this.$api.createStep({
          type: this.type,
          project: {
            id: this.featureRootProject.id
          },
          parts: this.parts
        }, this.$axios);

        this.$emit('created');
        this.parts = [];
        this.type = StepType.Given
      } catch (error) {
        this.$emit('errored');
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e);
    }
  },
  computed: {
    stepTypes(): Array<SelectItem> {
      const labels = {
        [StepType.Given]: 'Given',
        [StepType.When]: 'When',
        [StepType.Then]: 'Then'
      } as Record<StepType, string>;

      return [StepType.Given, StepType.When, StepType.Then].map((k: StepType) => ({
        value: k,
        text: labels[k],
        disabled: false
      }));
    }
  }
});
</script>

<style scoped>
.create-step-input--param {
  color: green !important;
  font-weight: bold;
}
.create-step-inputs {
  display: flex;
}
</style>
