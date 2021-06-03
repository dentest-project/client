<template>
  <v-dialog width="480" :value="value" @input="onDialogStatusChanged">
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">Create new feature</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="featureTitle"
            label="Feature title"
            autofocus
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <submit-button>Create feature</submit-button>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import SubmitButton from '~/components/buttons/SubmitButton.vue'
import { Path } from '~/types'

export default Vue.extend({
  components: { SubmitButton },
  model: {
    prop: 'value',
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    path: {
      type: Object,
      required: true,
    } as PropOptions<Path>,
  },
  data: function () {
    return {
      featureTitle: '',
    }
  },
  methods: {
    async onSubmit(): Promise<void> {
      try {
        await this.$api.createFeature(
          {
            path: {
              id: this.path.id,
            },
            title: this.featureTitle,
          },
          this.$axios
        )

        this.$emit('created')
        this.featureTitle = ''
      } catch (error) {
        this.$emit('errored')
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e)
    },
  },
})
</script>
