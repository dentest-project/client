<template>
  <v-dialog width="480" :value="value" @input="onDialogStatusChanged">
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">Create new tag</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="tagName"
            label="Tag name"
            autofocus
            clearable
          />
          <v-color-picker v-model="color" hide-mode-switch hide-inputs />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <submit-button>Create tag</submit-button>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import SubmitButton from '~/components/buttons/SubmitButton.vue'
import { Project } from '~/types'

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
    initialName: {
      type: String,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    } as PropOptions<Project>,
  },
  data: function () {
    return {
      tagName: '',
      color: '#FF0000',
    }
  },
  methods: {
    async onSubmit(): Promise<void> {
      try {
        await this.$api.createTag(
          this.project.id,
          {
            name: this.tagName,
            color: this.color,
          }
        )

        this.$emit('created')
        this.tagName = ''
      } catch (error) {
        this.$emit('errored')
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e)
    },
  },
  watch: {
    initialName: function (value) {
      this.tagName = value
    },
  },
})
</script>
