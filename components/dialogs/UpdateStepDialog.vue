<template>
  <v-dialog
    width="75%"
    :value="value && step && step.parts.length > 0"
    @input="onDialogStatusChanged"
  >
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">Update step</v-card-title>
        <v-card-text>
          <div class="update-step-dialog">
            <div class="update-step-inputs">
              <div v-for="(part, i) in parts" :key="part.id">
                <v-text-field v-model="parts[i].content" :class="`update-step-input--${part.type}`" />
                <div v-if="part.type === 'param'">
                  <free-inline-list v-if="parts[i].strategy === 'choices'" v-model="parts[i].choices" />
                  <div class="update-step-strategy-selector">
                    <inline-step-param-strategy :step-part-strategy="parts[i].strategy" @input="strategy => onParamStrategyChanged(i, strategy)" />
                  </div>
                </div>
              </div>
            </div>
            <tags-selector v-model="tags" :project="project" />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <error-action-button @click="onDeleteSubmit">Delete step</error-action-button>
          <submit-button>Update step</submit-button>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import ErrorActionButton from '~/components/buttons/ErrorActionButton.vue'
import SubmitButton from '~/components/buttons/SubmitButton.vue'
import FreeInlineList from '~/components/FreeInlineList.vue'
import InlineStepParamStrategy from '~/components/InlineStepParamStrategy.vue'
import TagsSelector from '~/components/TagsSelector.vue'
import { Project, Step, StepPartStrategy } from '~/types'

export default Vue.extend({
  components: { FreeInlineList, InlineStepParamStrategy, TagsSelector, ErrorActionButton, SubmitButton },
  model: {
    prop: 'value',
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    step: {
      type: Object,
      required: true,
    } as PropOptions<Step>,
    project: {
      type: Object,
      required: true,
    } as PropOptions<Project>,
  },
  data: function () {
    return {
      parts: this.step.parts,
      tags: this.step.tags,
    }
  },
  methods: {
    onDeleteSubmit(): void {
      this.$emit('delete-request', this.step.id)
    },
    async onParamStrategyChanged(i: number, strategy: StepPartStrategy) {
      const partId = this.parts[i].id;
      if (strategy === StepPartStrategy.Choices) {
        this.parts[i].choices = typeof partId !== 'undefined' ? await this.$api.getStepPartChoices(partId, this.$axios) : []
      } else {
        this.parts[i].choices = null
      }

      this.parts[i].strategy = strategy
    },
    async onSubmit(): Promise<void> {
      if (!this.step.id) {
        return
      }
      try {
        await this.$api.updateStep(
          {
            id: this.step.id,
            parts: this.parts,
            tags: this.tags,
          },
          this.$axios
        )

        this.$emit('updated')
      } catch (error) {
        this.$emit('errored')
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e)
    },
  },
  watch: {
    step(s: Step) {
      this.parts = s.parts
      this.tags = s.tags
    },
  },
})
</script>

<style scoped>
.update-step-input--param {
  color: #686de0 !important;
  font-weight: bold;
}
.update-step-inputs {
  display: flex;
}
.update-step-inputs > div {
  width: 100%;
}
.update-step-strategy-selector {
  width: fit-content;
  margin: auto;
}
</style>
