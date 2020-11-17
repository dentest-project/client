<template>
  <v-dialog width="480" :value=value @input="onDialogStatusChanged">
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">
          Create project
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="projectName" label="Project name" clearable />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit" :color="$colors.primary" text>
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
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
        await this.$axios.post(`${this.$axios.defaults.baseURL}/projects`, {
          title: this.projectName,
          rootPath: {
            path: '/'
          }
        });

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
