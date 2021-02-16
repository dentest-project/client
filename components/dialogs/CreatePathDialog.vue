<template>
  <v-dialog width="480" :value=value @input="onDialogStatusChanged">
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">Create new folder</v-card-title>
        <v-card-text>
          <v-text-field v-model="pathName" label="Path name" autofocus clearable />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <submit-button>Create folder</submit-button>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import SubmitButton from '~/components/buttons/SubmitButton.vue';
import { Path } from '~/types';

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
    path: {
      type: Object,
      required: true
    } as PropOptions<Path>
  },
  data: function () {
    return {
      pathName: ''
    }
  },
  methods: {
    async onSubmit (): Promise<void> {
      try {
        await this.$api.createPath({
          parent: {
            id: this.path.id
          },
          path: this.pathName
        }, this.$axios);

        this.$emit('created');
        this.pathName = '';
      } catch (error) {
        this.$emit('errored');
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e);
    }
  }
});
</script>
