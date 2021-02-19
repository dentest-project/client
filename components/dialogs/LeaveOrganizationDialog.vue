<template>
  <v-dialog width="480" :value=value @input="onDialogStatusChanged">
    <v-card>
      <v-card-title class="headline">Leave organization?</v-card-title>
      <v-card-text>
        Are you sure that you want to leave this organization?
      </v-card-text>
      <v-card-actions>
        <v-btn :color="$colors.cancel" text @click.stop="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn :color="$colors.error" text @click.stop="confirm">Leave organization</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import Vue, { PropOptions } from 'vue';
  import SubmitButton from '~/components/buttons/SubmitButton.vue';
  import { Organization } from '~/types';

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
        required: true
      } as PropOptions<Organization>
    },
    methods: {
      async confirm (): Promise<void> {
        try {
          if (this.organization.id) {
            await this.$api.deleteOrganizationUser(this.organization.id, this.$auth.user.id, this.$axios);

            this.$emit('deleted');
          }
        } catch (error) {
          this.$emit('errored');
        }
      },
      onDialogStatusChanged(e: boolean) {
        this.$emit('input', e);
      },
      cancel() {
        this.$emit('input', false);
      }
    }
  });
</script>
