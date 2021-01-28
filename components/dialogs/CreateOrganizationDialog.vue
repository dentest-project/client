<template>
  <v-dialog width="480" :value=value @input="onDialogStatusChanged">
    <form @submit.prevent="onSubmit">
      <v-card>
        <v-card-title class="headline">
          Create organization
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="organizationName" label="Organization name" autofocus clearable />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <submit-button>Create organization</submit-button>
        </v-card-actions>
      </v-card>
    </form>
    <v-snackbar v-model="conflictSnackbarOpened" :color="$colors.error">This organization name is already taken</v-snackbar>
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
      organizationName: '',
      conflictSnackbarOpened: false
    }
  },
  methods: {
    async onSubmit (): Promise<void> {
      if (this.organizationName.trim() === '') {
        return;
      }

      try {
        await this.$api.createOrganization({ name: this.organizationName }, this.$axios);

        this.$emit('created');
        this.organizationName = '';
      } catch (error) {
        if (error.response.status === 409) {
          this.conflictSnackbarOpened = true;
        } else {
          this.$emit('errored');
        }
      }
    },
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e);
    }
  }
});
</script>
