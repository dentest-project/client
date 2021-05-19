<template>
  <v-dialog width="75%" :value=value @input="onDialogStatusChanged">
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
          <submit-button>Update step</submit-button>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import SubmitButton from '~/components/buttons/SubmitButton.vue';
import { Step, StepPart } from '~/types';

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
    step: {
      type: Object,
      required: true
    } as PropOptions<Step>
  },
  data: function () {
    return {
      parts: [] as Array<StepPart>
    }
  },
  methods: {
    async onSubmit (): Promise<void> {
      if (!this.step.id) {
        return;
      }
      try {
        await this.$api.updateStep({
          id: this.step.id,
          parts: this.parts
        }, this.$axios);

        this.$emit('updated');
      } catch (error) {
        this.$emit('errored');
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e);
    }
  },
  watch: {
    step(s: Step) {
      console.log(s);
      this.parts = s.parts;
    }
  }
});
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
