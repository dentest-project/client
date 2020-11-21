<template>
  <v-dialog width="480" :value=value @input="onDialogStatusChanged">
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">
          Create project
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="projectName" label="Project name" autofocus clearable />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <submit-button>Create project</submit-button>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import SubmitButton from '~/components/buttons/SubmitButton.vue';

export default Vue.extend({
  components: { SubmitButton },
  model: {
    prop: 'value'
  },
  props: {
    value: Boolean
  },
  data: function () {
    return {
      projectName: ''
    }
  },
  methods: {
    async onSubmit (): Promise<void> {
      try {
        await this.$api.createProject({
          title: this.projectName,
          rootPath: {
            path: '/'
          }
        }, this.$axios);

        this.$emit('created');
        this.projectName = '';
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
