<template>
  <v-dialog width="480" :value=value @input="onDialogStatusChanged">
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">
          Create project
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="projectName" label="Project name" autofocus clearable />
          <v-select :items="visibilities" v-model="projectVisibility" />
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
import Vue, { PropOptions } from 'vue';
import SubmitButton from '~/components/buttons/SubmitButton.vue';
import { CreateProject, Organization, ProjectVisibility, SelectItem, StepType } from '~/types';

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
    organization: {
      type: Object,
      required: false
    } as PropOptions<Organization>
  },
  data: function () {
    return {
      projectName: '',
      projectVisibility: ProjectVisibility.Public
    }
  },
  methods: {
    async onSubmit (): Promise<void> {
      if (this.projectName.trim() === '') {
        return;
      }

      const newProject = {
        title: this.projectName,
        visibility: this.projectVisibility,
        rootPath: {
          path: '/'
        }
      } as CreateProject;
      if (this.organization && this.organization.id) {
        newProject.organization = { id: this.organization.id };
      }

      try {
        await this.$api.createProject(newProject, this.$axios);
        this.$emit('created');
        this.projectName = '';
      } catch (error) {
        this.$emit('errored');
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e);
    }
  },
  computed: {
    visibilities(): Array<SelectItem> {
      const labels = {
        [ProjectVisibility.Public]: 'Public',
        [ProjectVisibility.Internal]: 'Internal',
        [ProjectVisibility.Private]: 'Private'
      } as Record<ProjectVisibility, string>;
      const availableVisibilities = this.organization && this.organization.id ? [ProjectVisibility.Public, ProjectVisibility.Internal, ProjectVisibility.Private] : [ProjectVisibility.Public, ProjectVisibility.Private];

      return availableVisibilities.map((k: ProjectVisibility) => ({
        value: k,
        text: labels[k],
        disabled: false
      }));
    }
  }
});
</script>
