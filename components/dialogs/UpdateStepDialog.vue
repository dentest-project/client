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
              <v-text-field
                v-for="(part, i) in parts"
                v-model="parts[i].content"
                :key="part.id"
                :class="`update-step-input--${part.type}`"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <error-action-button @click="onDeleteSubmit"
            >Delete step</error-action-button
          >
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
import { Step } from '~/types'

export default Vue.extend({
  components: { ErrorActionButton, SubmitButton },
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
  },
  data: function () {
    return {
      parts: this.step.parts,
    }
  },
  methods: {
    onDeleteSubmit(): void {
      this.$emit('delete-request', this.step.id)
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
    },
  },
})
</script>

<style scoped>
.update-step-input--param {
  color: green !important;
  font-weight: bold;
}
.update-step-inputs {
  display: flex;
}
</style>
