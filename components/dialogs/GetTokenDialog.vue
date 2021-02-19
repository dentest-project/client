<template>
  <v-dialog width="480" :value=value @input="onDialogStatusChanged">
    <v-card>
      <v-card-title class="headline">Pull token</v-card-title>
      <v-card-text>
        Use this token to pull features from command line
        <v-text-field
          class="getTokenDialog-input"
          readonly
          :value="token"
          append-icon="mdi-content-copy"
          append-outer-icon="mdi-refresh"
          @click:append="onCopyClicked"
          @click:append-outer="onRefreshClicked"
        />
      </v-card-text>
    </v-card>
    <v-snackbar v-model="copiedSnackbarOpened" :color="$colors.success">Token copied</v-snackbar>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import SubmitButton from '~/components/buttons/SubmitButton.vue';
import { Project } from '~/types';

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
    project: {
      type: Object,
      required: true
    } as PropOptions<Project>
  },
  data: function () {
    return {
      token: '',
      copiedSnackbarOpened: false
    }
  },
  async mounted() {
    this.token = (await this.$api.getProjectUserToken(this.project.id, this.$auth.user.id, this.$axios)).token;
  },
  methods: {
    onDialogStatusChanged(e: boolean) {
      this.$emit('input', e);
    },
    onCopyClicked() {
      const input = document.querySelector('.getTokenDialog-input input') as HTMLInputElement;

      if (!input) {
        return;
      }

      input.select();
      document.execCommand('copy');
      this.copiedSnackbarOpened = true;
    },
    async onRefreshClicked() {
      this.token = (await this.$api.createProjectUserToken(this.project.id, this.$auth.user.id, this.$axios)).token;
    }
  }
});
</script>
