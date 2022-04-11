<template>
  <v-dialog width="75%" :value="value" @input="onDialogStatusChanged">
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">Create new step</v-card-title>
        <v-card-text>
          <div class="create-step-dialog">
            <v-select :items="stepTypes" v-model="type" />
            <div class="create-step-inputs">
              <div
                class="create-step-input"
                v-for="(part, i) in parts"
                :key="partsHashes[i].toString() + '#' + i"
              >
                <v-text-field
                  v-model="parts[i].content"
                  :class="`create-step-input--${parts[i].type}`"
                  clearable
                  @select="(e) => onContentSelected(i, e)"
                  @focus="onPotentialSelectionEnd"
                  @blur="onPotentialSelectionEnd"
                  @keydown="onPotentialSelectionEnd"
                  @mousedown="onPotentialSelectionEnd"
                  @click:clear.stop="() => onInputCleared(i)"
                />
                <split-button
                  v-if="selection.inputId === i"
                  @click="onSplitButtonClicked"
                />
                <div v-else-if="parts[i].type === 'param'">
                  <free-inline-list v-if="parts[i].strategy === 'choices'" v-model="parts[i].choices" />
                  <div class="create-step-strategy-selector">
                    <inline-step-param-strategy :step-part-strategy="parts[i].strategy" @input="strategy => onParamStrategyChanged(i, strategy)" />
                  </div>
                </div>
              </div>
            </div>
            <div class="create-step-type-selector">
              <step-param-type-selector v-model="extraParamType" />
            </div>
            <tags-selector v-model="tags" :project="project" />
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
import Vue, { PropOptions } from 'vue'
import SplitButton from '~/components/buttons/SplitButton.vue'
import SubmitButton from '~/components/buttons/SubmitButton.vue'
import FreeInlineList from '~/components/FreeInlineList.vue';
import InlineStepParamStrategy from '~/components/InlineStepParamStrategy.vue';
import StepParamTypeSelector from '~/components/StepParamTypeSelector.vue'
import TagsSelector from '~/components/TagsSelector.vue'
import { Project, SelectItem, StepParamType, StepPart, StepPartStrategy, StepPartType, StepType, Tag, } from '~/types'

interface SelectionBoundaries {
  start: number | null
  end: number | null
}

interface Selection {
  inputId: number | null
  boundaries: SelectionBoundaries | null
}

export default Vue.extend({
  components: {
    FreeInlineList,
    InlineStepParamStrategy,
    TagsSelector,
    SplitButton,
    StepParamTypeSelector,
    SubmitButton,
  },
  model: {
    prop: 'value',
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    } as PropOptions<Project>,
  },
  data: function () {
    return {
      type: StepType.Given,
      parts: [
        {
          type: StepPartType.Sentence,
          priority: 0,
          content: '',
        },
      ] as Array<StepPart>,
      extraParamType: StepParamType.None,
      partsHashes: [Math.random()],
      selection: {
        inputId: null,
      } as Selection,
      tags: [] as Array<Tag>,
    }
  },
  methods: {
    fixPriorities() {
      for (let i = 0; i < this.parts.length; i++) {
        this.parts[i].priority = i
        this.partsHashes[i] = Math.random()
      }
    },
    onContentSelected(i: number, e: InputEvent): void {
      if (this.parts[i].type === StepPartType.Param) {
        return
      }

      const target = e.target as HTMLInputElement

      this.selection = {
        inputId: i,
        boundaries: {
          start: target.selectionStart,
          end: target.selectionEnd,
        },
      }
    },
    onInputCleared(i: number): void {
      if (this.parts[i].type === StepPartType.Sentence) {
        if (this.parts.length === 1) {
          this.parts[0].content = ''
          return
        }

        this.parts.splice(i, 1)
        this.fixPriorities()
        return
      }

      let fullContent = ''
      const elementToReplace = i > 0 ? i - 1 : 0
      let amountToDelete = 1
      if (i > 0) {
        fullContent += this.parts[i - 1].content + ' '
        amountToDelete++
      }
      fullContent += this.parts[i].content
      if (i < this.parts.length - 1) {
        fullContent += ' ' + this.parts[i + 1].content
        amountToDelete++
      }
      this.parts.splice(elementToReplace, amountToDelete, {
        type: StepPartType.Sentence,
        content: fullContent,
        priority: 0,
        choices: null
      })
      this.fixPriorities()
    },
    onPotentialSelectionEnd(e: InputEvent) {
      const input = e.target as HTMLInputElement

      window.setTimeout(() => {
        if (input.selectionStart === input.selectionEnd) {
          this.selection.inputId = null
        }
      }, 50)
    },
    onSplitButtonClicked(): void {
      const id = this.selection.inputId
      const boundaries = this.selection.boundaries

      if (null === id || null === boundaries) {
        return
      }

      const value = this.parts[id].content

      const before = value
        .substring(0, this.resolveSelectionBounding(boundaries.start))
        .trim()
      const selected = value
        .substring(
          this.resolveSelectionBounding(boundaries.start),
          this.resolveSelectionBounding(boundaries.end)
        )
        .trim()
      const after = value
        .substring(this.resolveSelectionBounding(boundaries.end))
        .trim()

      if (after !== '') {
        this.parts.splice(id + 1, 0, {
          type: StepPartType.Sentence,
          priority: 0,
          content: after,
          choices: null
        })
      }
      this.parts.splice(id + 1, 0, {
        type: StepPartType.Param,
        priority: id + 1,
        content: selected,
        strategy: StepPartStrategy.Free,
        choices: null
      })
      if (before !== '') {
        this.parts.splice(id + 1, 0, {
          type: StepPartType.Sentence,
          priority: 0,
          content: before,
          choices: null
        })
      }
      this.parts.splice(id, 1)
      this.fixPriorities()
      this.selection.inputId = null
    },
    async onSubmit(): Promise<void> {
      try {
        await this.$api.createStep(
          {
            type: this.type,
            project: {
              id: this.project.id,
            },
            extraParamType: this.extraParamType,
            parts: this.parts,
            tags: this.tags,
          },
          this.$axios
        )

        this.$emit('created')
        this.parts = [
          {
            type: StepPartType.Sentence,
            priority: 0,
            content: '',
            choices: null
          },
        ]
        this.type = StepType.Given
        this.extraParamType = StepParamType.None
        this.partsHashes = [Math.random()]
        this.selection = {
          inputId: null,
        } as Selection
        this.tags = [] as Array<Tag>
      } catch (error) {
        this.$emit('errored')
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e)
    },
    onParamStrategyChanged(i: number, strategy: StepPartStrategy) {
      this.parts[i].choices = strategy === StepPartStrategy.Free ? null : []
      this.parts[i].strategy = strategy
    },
    resolveSelectionBounding(n: number | null): number {
      return typeof n === 'number' ? n : 0
    },
  },
  computed: {
    stepTypes(): Array<SelectItem> {
      const labels = {
        [StepType.Given]: 'Given',
        [StepType.When]: 'When',
        [StepType.Then]: 'Then',
      } as Record<StepType, string>

      return [StepType.Given, StepType.When, StepType.Then].map(
        (k: StepType) => ({
          value: k,
          text: labels[k],
          disabled: false,
        })
      )
    },
  },
})
</script>

<style scoped>
.create-step-input--param {
  color: #686de0 !important;
  font-weight: bold;
}
.create-step-inputs {
  display: flex;
  margin-bottom: 1rem;
}
.create-step-input {
  width: 100%;
  text-align: center;
}
.create-step-type-selector, .create-step-strategy-selector {
  width: fit-content;
  margin: auto;
}
</style>
