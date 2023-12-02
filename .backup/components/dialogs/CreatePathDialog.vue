<template>
  <v-dialog width="480" :value="value" @input="onDialogStatusChanged">
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">Create new folder</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="pathName"
            label="Folder name"
            autofocus
            clearable
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <submit-button>Create folder</submit-button>
        </v-card-actions>
      </v-card>
      <v-snackbar v-model="conflictSnackbarOpened" :color="$colors.error">
        This folder name is already taken
      </v-snackbar>
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
      pathName: '',
      conflictSnackbarOpened: false,
    }
  },
  methods: {
    async onSubmit(): Promise<void> {
      try {
        await this.$api.createPath(
          {
            parent: {
              id: this.path.id,
            },
            path: this.pathName,
          }
        )

        this.$emit('created')
        this.pathName = ''
      } catch (error) {
        if (error.statusCode === 409) {
          this.conflictSnackbarOpened = true
        } else {
          this.$emit('errored')
        }
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e)
    },
  },
})
</script>
