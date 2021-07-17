<template>
  <v-dialog width="480" :value="value" @input="onDialogStatusChanged">
    <v-card>
      <v-card-title class="headline">Delete your account?</v-card-title>
      <v-card-text>
        Are you sure that you want to delete your account? All of your
        information will be deleted. Which means this action is irreversible
      </v-card-text>
      <v-card-actions>
        <v-btn :color="$colors.cancel" text @click.stop="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn :color="$colors.error" text @click.stop="confirm">
          Delete my account
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import SubmitButton from '~/components/buttons/SubmitButton.vue'

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
  },
  methods: {
    async confirm(): Promise<void> {
      try {
        await this.$api.deleteMe(this.$axios)

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
