<template>
  <v-dialog width="480" :value="value" @input="onDialogStatusChanged">
    <v-card>
      <v-card-title class="headline">Delete folder?</v-card-title>
      <v-card-text>
        Are you sure that you want to delete this folder? All its content will
        be deleted.
      </v-card-text>
      <v-card-actions>
        <v-btn :color="$colors.cancel" text @click.stop="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn :color="$colors.error" text @click.stop="confirm"
          >Delete folder</v-btn
        >
      </v-card-actions>
    </v-card>
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
  methods: {
    async confirm(): Promise<void> {
      try {
        await this.$api.deletePath(this.path.id, this.$axios)

        this.$emit('deleted')
      } catch (error) {
        this.$emit('errored')
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e)
    },
    cancel() {
      this.$emit('input', false)
    },
  },
})
</script>
